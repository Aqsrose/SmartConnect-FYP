import { z } from "zod"
import { privateProcedure, router } from "../trpc"
import { PostWithRelations } from "../../../../prisma/types"
import { addUserDataToPosts } from "./post-router"
import { TRPCError } from "@trpc/server"
import { GroupUsers } from "@prisma/client"
import clerk from "@clerk/clerk-sdk-node"
import { filterUserForClient } from "../../helpers/filterUserForClient"

export const addUserDataToGroupUsersRows = async (groupUsers: GroupUsers[]) => {
  const userIds = groupUsers.map((groupUser) => groupUser.userId)
  const usersList = (
    await clerk.users.getUserList({
      userId: userIds,
    })
  ).map(filterUserForClient)

  return groupUsers.map((groupUser) => {
    const user = usersList.find((user) => user.id === groupUser.userId)

    if (!user) {
      console.error("USER NOT FOUND", groupUser)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `User for groupUserRow not found. groupUser ID: ${
          groupUser.userId + " " + groupUser.groupId
        }`,
      })
    }
    return {
      groupUser,
      user,
    }
  })
}

export const groupRouter = router({
  createGroup: privateProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        privacy: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description, privacy } = input

      let group
      try {
        group = await ctx.prisma.group.create({
          data: {
            name,
            description,
            adminId: ctx.user.id,
            isPublic: privacy === "public" ? true : false,
            groupUsers: {
              create: {
                userId: ctx.user.id,
              },
            },
          },
        })
      } catch (error) {
        console.log("🔴 Prisma Error: ", error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }

      return { success: true, group }
    }),

  fetchGroupMembers: privateProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { groupId } = input

      const group = await ctx.prisma.group.findFirst({
        where: {
          id: groupId,
        },
      })

      let rawGroupUsers: GroupUsers[]
      rawGroupUsers = await ctx.prisma.groupUsers.findMany({
        where: {
          groupId,
        },
      })

      rawGroupUsers = await ctx.prisma.groupUsers.findMany({
        where: {
          groupId,
        },
      })

      const userIds = rawGroupUsers.map((groupUser) => groupUser.userId)

      // Fetch user details from Clerk
      const usersList = (
        await clerk.users.getUserList({
          userId: userIds,
        })
      ).map(filterUserForClient)

      // Map user details to the corresponding group members
      const groupMembersWithUserData = rawGroupUsers.map((groupUser) => {
        const user = usersList.find((user) => user.id === groupUser.userId)

        if (!user) {
          console.error("USER NOT FOUND", groupUser)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `User not found. USER ID: ${groupUser.userId}`,
          })
        }

        return {
          groupUser,
          user,
        }
      })

      return { success: true, groupMembersWithUserData }
    }),

  fetchGroups: privateProcedure.query(async ({ ctx }) => {
    const {
      user: { id },
    } = ctx

    let groups, notJoined
    try {
      groups = await ctx.prisma.group.findMany({
        where: {
          groupUsers: {
            some: {
              userId: {
                equals: id,
              },
            },
          },
        },
      })

      notJoined = await ctx.prisma.group.findMany({
        where: {
          groupUsers: {
            none: {
              userId: id,
            },
          },
        },
      })
    } catch (error) {
      console.log("🔴 Prisma Error: ", error)
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
    }

    return { success: true, groups, notJoined }
  }),

  fetchGroupById: privateProcedure
    .input(
      z.object({
        groupId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { groupId } = input

      let group
      try {
        group = await ctx.prisma.group.findFirst({
          where: {
            id: groupId,
          },
          include: {
            _count: {
              select: {
                groupUsers: true,
              },
            },
          },
        })
      } catch (error) {
        console.log("🔴 Prisma Error: ", error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }

      return { success: true, group }
    }),

  joinGroup: privateProcedure
    .input(
      z.object({
        groupId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId } = input

      let groupUser
      try {
        groupUser = await ctx.prisma.groupUsers.create({
          data: {
            groupId,
            userId: ctx.user.id,
          },
        })
      } catch (error) {
        console.log("🔴 Prisma Error: ", error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }

      return { success: true, groupUser }
    }),

  leaveGroup: privateProcedure
    .input(
      z.object({
        groupId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId } = input

      let deletedRow
      try {
        deletedRow = await ctx.prisma.groupUsers.delete({
          where: {
            userId_groupId: {
              userId: ctx.user.id,
              groupId,
            },
          },
        })
      } catch (error) {
        console.log("🔴 Prisma Error: ", error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }

      return { success: true, deletedRow }
    }),

  fetchPosts: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(),
        cursor: z.string().uuid().nullish(),
        groupId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { groupId, cursor } = input
      const limit = input.limit ?? 50

      let rawPosts: PostWithRelations[]

      try {
        rawPosts = await ctx.prisma.post.findMany({
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: [
            {
              createdAt: "desc",
            },
            {
              likes: "desc",
            },
          ],
          include: {
            _count: {
              select: {
                comments: true,
                postLikes: true,
              },
            },
            postLikes: true,
            media: true,
          },
          where: {
            groupId,
          },
        })
      } catch (error) {
        console.log("🔴 Prisma Error: ", error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }

      let posts = await addUserDataToPosts(rawPosts)

      posts = posts.map((post) => {
        if (!ctx.user)
          return { ...post, post: { ...post.post, isLikedByUser: false } }
        const isLikedByUser = post.post.postLikes.some(
          (like) => like.userId === ctx.user?.id
        )
        return { ...post, post: { ...post.post, isLikedByUser } }
      })

      let nextCursor: typeof cursor | undefined = undefined

      //it means there still are posts to retrieve
      if (posts.length > limit) {
        const nextItem = posts.pop()
        nextCursor = nextItem!.post.id
      }

      return { success: true, posts, nextCursor }
    }),

  requestToJoin: privateProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { groupId } = input

      const groupJoinRequest = await ctx.prisma.groupJoinRequests.create({
        data: {
          userId: ctx.user.id,
          groupId,
        },
      })

      if (groupJoinRequest) {
        const group = await ctx.prisma.group.findFirst({
          where: {
            id: groupId,
          },
        })

        // send notification to the admin
        if (group) {
          const notificationToGroupAdmin = await ctx.prisma.notification.create(
            {
              data: {
                userId: group.adminId,
                type: "GROUP_JOIN_REQUEST",
                content: `${ctx.user.username} requested to join your group`,
                senderId: ctx.user.id,
                entityId: group.id,
              },
            }
          )
        }
      }

      return { success: true, groupJoinRequest }
    }),

  inviteToGroup: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        groupId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, groupId } = input

      const groupJoinRequest = await ctx.prisma.groupJoinRequests.create({
        data: {
          userId,
          groupId,
          isInvite: true,
          status: "WAITING_INVITE_RESPONSE",
        },
      })

      if (groupJoinRequest) {
        const group = await ctx.prisma.group.findFirst({
          where: {
            id: groupId,
          },
        })
        if (group) {
          await ctx.prisma.notification.create({
            data: {
              senderId: ctx.user.id,
              type: "GROUP_INVITE",
              userId,
              content: `${ctx.user.username} invited you to join their group: ${group.name}`,
              entityId: groupId,
            },
          })
        }
      }
    }),

  // accepting someone's group invitation changes the status to pending
  // now if the admin accepts the reuqest, we officially join the group
  acceptGroupInvitation: privateProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { groupId } = input

      await ctx.prisma.groupJoinRequests.updateMany({
        where: {
          groupId,
          userId: ctx.user.id,
        },
        data: {
          status: "PENDING",
        },
      })
    }),

  acceptGroupRequest: privateProcedure
    .input(
      z.object({
        userId: z.string(),
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId, userId } = input

      const acceptedGroupRequest =
        await ctx.prisma.groupJoinRequests.updateMany({
          where: {
            groupId,
            userId,
          },
          data: {
            status: "ACCEPTED",
          },
        })

      if (acceptedGroupRequest) {
        const groupUser = await ctx.prisma.groupUsers.create({
          data: {
            userId,
            groupId,
          },
        })

        const group = await ctx.prisma.group.findFirst({
          where: {
            id: groupId,
          },
        })

        if (group) {
          await ctx.prisma.notification.create({
            data: {
              type: "GROUP_JOIN_REQUEST",
              senderId: group.adminId,
              userId,
              entityId: group.id,
              content: `Your request to join ${group.name} has been accepted`,
            },
          })
        }
      }
    }),

  fetchGroupJoinRequests: privateProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { groupId } = input

      const group = await ctx.prisma.group.findFirst({
        where: {
          id: groupId,
        },
      })

      // Fetch join requests for the group
      const joinRequests = await ctx.prisma.groupJoinRequests.findMany({
        where: {
          groupId,
        },
      })

      // Extract user IDs from join requests
      const userIds = joinRequests.map((request) => request.userId)

      // Fetch user details from Clerk
      const usersList = (
        await clerk.users.getUserList({
          userId: userIds,
        })
      ).map(filterUserForClient)

      // Map user details to the corresponding join requests
      const joinRequestsWithUserData = joinRequests.map((request) => {
        const user = usersList.find((user) => user.id === request.userId)

        if (!user) {
          console.error("USER NOT FOUND", request)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `User not found. USER ID: ${request.userId}`,
          })
        }

        return {
          request,
          user,
        }
      })

      return { success: true, joinRequests: joinRequestsWithUserData }
    }),

  fetchUserJoinRequest: privateProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { groupId } = input
      const userId = ctx.user.id

      const joinRequest = await ctx.prisma.groupJoinRequests.findFirst({
        where: {
          groupId,
          userId,
        },
      })

      return { success: true, joinRequest }
    }),

  fetchGroupMedia: privateProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .query(async ({ctx, input}) => {

      const {groupId} = input

      const media = await ctx.prisma.post.findMany({
        where: {
          groupId
        },
        select: {
          media: {
            include: {
              moderation: true,
              labels: true
            }
          },
          id: true
        }
      })
    }),
})
