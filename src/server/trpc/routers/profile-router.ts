import { z } from "zod"
import { privateProcedure, publicProcedure, router } from "../trpc"
import { TRPCError } from "@trpc/server"
import clerk from "@clerk/clerk-sdk-node"
import {
  filterUserForClient,
  filterUsersForClient,
} from "../../helpers/filterUserForClient"
import { User } from "../../../../prisma/types"

export const profileRouter = router({
  fetchFriendsForChat: privateProcedure
    .input(
      z.object({
        key: z.string(),
      })
    )
    .query(async ({ ctx, input: { key } }) => {
      // first we check which user is sending the search request
      const user = ctx.user

      // then we fetch the user's friends from our database
      const friends = await ctx.prisma.friend.findMany({
        where: {
          OR: [{ userId: user.id }, { friendId: user.id }],
        },
      })

      if (friends.length === 0) {
        return { sucess: true, message: "NO_FRIENDS" }
      }

      // get all the userIds into a flat array and then take all except the user that's making the request
      const userIds = friends
        .map((friend) => [friend.userId, friend.friendId])
        .flat()
        .filter((id) => id !== user.id)

      // this will get users by matching this key with userId, emailAddress, phoneNumber, username, web3Wallet, firstName and lastName
      const users = await clerk.users.getUserList({
        userId: userIds,
        query: key,
      })

      // so now, we technically should have the users that we want to return
      const filteredUsers = filterUsersForClient(users)

      return { success: true, users: filteredUsers }
    }),

  fetchUserMedia: privateProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = input

      const media = await ctx.prisma.media.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          labels: true,
          moderation: true,
        },
      })

      return { success: true, media }
    }),

  searchUsers: privateProcedure
    .input(
      z.object({
        key: z.string(),
      })
    )
    .query(async ({ ctx, input: { key } }) => {
      // first we check which user is sending the search request
      const user = ctx.user

      // this will get users by matching this key with userId, emailAddress, phoneNumber, username, web3Wallet, firstName and lastName
      const users = await clerk.users.getUserList({
        query: key,
      })

      // so now, we technically should have the users that we want to return
      const filteredUsers = filterUsersForClient(users)

      return { success: true, users: filteredUsers }
    }),

  removeFriend: privateProcedure
    .input(
      z.object({
        friendId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { friendId } }) => {
      const deletedFriend = await ctx.prisma.friend.deleteMany({
        where: {
          OR: [
            { userId: ctx.user.id, friendId },
            { friendId: ctx.user.id, userId: friendId },
          ],
        },
      })

      return { success: true }
    }),

  fetchFriends: privateProcedure.query(async ({ ctx }) => {
    const user = ctx.user

    const friends = await ctx.prisma.friend.findMany({
      where: {
        OR: [{ userId: user.id }, { friendId: user.id }],
      },
    })

    console.log("friends: ", friends)

    const userIds = friends
      .map((friend) => [friend.userId, friend.friendId])
      .flat()
      .filter((id) => id !== user.id)

    // this will get users by matching this key with userId, emailAddress, phoneNumber, username, web3Wallet, firstName and lastName

    let friendsWithUserInfo: User[] = []
    if (friends.length > 0) {
      const users = await clerk.users.getUserList({
        userId: userIds,
      })
      friendsWithUserInfo = filterUsersForClient(users)
    }

    // so now, we technically should have the users that we want to return
    return { success: true, friendsWithUserInfo }
  }),

  fetchNonFriends: privateProcedure.query(async ({ ctx }) => {
    const user = ctx.user

    const friends = await ctx.prisma.friend.findMany({
      where: {
        OR: [{ userId: user.id }, { friendId: user.id }],
      },
    })

    const friendIds = friends
      .map((friend) => [friend.userId, friend.friendId])
      .flat()
      .filter((id) => id !== user.id)

    const allUsers = await clerk.users.getUserList()

    const nonFriends = allUsers.filter(
      (u) => u.id !== user.id && !friendIds.includes(u.id)
    )

    const nonFriendsForClient = filterUsersForClient(nonFriends)

    return { success: true, nonFriends: nonFriendsForClient }
  }),

  fetchUserInfo: privateProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input: { userId } }) => {
      let filteredUser
      try {
        const user = await clerk.users.getUser(userId)
        filteredUser = filterUserForClient(user)
      } catch (error) {
        console.log("🔴 Error: ", error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }

      const friendCount = await ctx.prisma.friend.count({
        where: {
          OR: [{ userId: ctx.user.id }, { friendId: ctx.user.id }],
        },
      })

      return { success: true, user: filteredUser, friendCount }
    }),

  fetchCoverImage: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input: { userId }, ctx }) => {
      let coverImage
      try {
        coverImage = await ctx.prisma.userCoverImages.findFirst({
          where: {
            userId,
            isActive: true,
          },
        })
      } catch (error) {
        console.log("🔴 Prisma Error: ", error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }

      if (!coverImage) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      return { success: true, coverImage }
    }),

  fetchFriendsForRequest: privateProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input: { userId } }) => {
      const friends = await ctx.prisma.friend.findMany({
        where: {
          OR: [{ userId }, { friendId: userId }],
        },
      })

      return { success: true, friends }
    }),

  sendFriendRequest: privateProcedure
    .input(
      z.object({
        receiverId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { receiverId } }) => {
      const request = await ctx.prisma.friendRequests.create({
        data: {
          senderId: ctx.user.id,
          receiverId: receiverId,
        },
      })

      if (receiverId !== ctx.user.id) {
        const notification = await ctx.prisma.notification.create({
          data: {
            type: "FRIEND_REQUEST",
            userId: receiverId,
            content: `${ctx.user.username} sent you a friend request`,
            senderId: ctx.user.id,
            entityId: ctx.user.id, //notification will take the user to the sender's profile
          },
        })
      }

      return { success: true, request }
    }),

  fetchFriendRequests: privateProcedure.query(async ({ ctx }) => {
    const { id } = ctx.user

    const requests = await ctx.prisma.friendRequests.findMany({
      where: {
        OR: [{ receiverId: id }, { senderId: id }],
        status: "PENDING",
      },
    })

    return { success: true, requests }
  }),

  fetchCompleteFriendRequests: privateProcedure.query(async ({ ctx }) => {
    const { id } = ctx.user

    const rawRequests = await ctx.prisma.friendRequests.findMany({
      where: { OR: [{ receiverId: id }, { senderId: id }], status: "PENDING" },
    })

    const otherUserIds = [
      ...new Set(
        rawRequests.map((request) =>
          request.senderId === id ? request.receiverId : request.senderId
        )
      ),
    ]

    if (otherUserIds.length === 0) {
      return { success: true, completeRequests: [] }
    }

    // Fetch user information for these IDs
    const usersList = (
      await clerk.users.getUserList({
        userId: otherUserIds,
      })
    ).map(filterUserForClient)

    // Map user information to friend requests, only for the other user
    const completeRequests = rawRequests.map((request) => {
      const otherUserId =
        request.senderId === id ? request.receiverId : request.senderId
      const otherUser = usersList.find((user) => user.id === otherUserId)

      if (!otherUser) {
        console.error("USER NOT FOUND", request)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `User not found for friend request. REQUEST: ${request}, OTHER USER ID: ${otherUserId}`,
        })
      }

      return {
        ...request,
        otherUser,
      }
    })

    return { success: true, completeRequests }
  }),

  // not correct I think
  acceptFriendRequest: privateProcedure
    .input(
      z.object({
        senderId: z.string(), // ID of the user who sent the friend request
        // this will be the userId in the page url
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { senderId } = input
      const { id: receiverId } = ctx.user // Currently logged-in user

      // Check if the friend request exists and is pending
      const request = await ctx.prisma.friendRequests.findUnique({
        where: {
          senderId_receiverId: {
            senderId,
            receiverId,
          },
        },
      })

      if (!request || request.status !== "PENDING") {
        throw new Error("Friend request not found or already processed")
      }

      // Update the friend request status to accepted
      await ctx.prisma.friendRequests.update({
        where: {
          senderId_receiverId: {
            senderId,
            receiverId,
          },
        },
        data: {
          status: "ACCEPTED",
        },
      })

      // Create a friendship entry
      await ctx.prisma.friend.create({
        data: {
          userId: receiverId,
          friendId: senderId,
        },
      })

      const notification = await ctx.prisma.notification.create({
        data: {
          type: "FRIEND_REQUEST",
          userId: senderId,
          content: `${ctx.user.username} accepted your friend request`,
          senderId: receiverId,
          entityId: receiverId, //take user to the profile of who accepted the request
        },
      })

      return { success: true }
    }),

  // reject an incoming req
  rejectRequest: privateProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId } = input
      const rejectedRequest = await ctx.prisma.friendRequests.updateMany({
        where: {
          OR: [
            { senderId: ctx.user.id, receiverId: userId },
            { senderId: userId, receiverId: ctx.user.id },
          ],
        },
        data: {
          status: "DENIED",
        },
      })

      const notification = await ctx.prisma.notification.create({
        data: {
          type: "FRIEND_REQUEST",
          userId,
          content: `${ctx.user.username} rejected your friend request`,
          senderId: ctx.user.id,
          entityId: null,
        },
      })
    }),

  // basically when you cancel a req sent by yourself
  cancelRequest: privateProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input
      const deletedRequest = await ctx.prisma.friendRequests.deleteMany({
        where: {
          OR: [
            { senderId: ctx.user.id, receiverId: userId },
            { senderId: userId, receiverId: ctx.user.id },
          ],
        },
      })

      return { success: true, deletedRequest }
    }),

  updateCoverImage: privateProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { imageUrl } = input

      let row
      try {
        row = await ctx.prisma.userCoverImages.create({
          data: {
            url: imageUrl,
            userId: ctx.user.id,
            isActive: true,
          },
        })

        //set every other image's active state to false
        await ctx.prisma.userCoverImages.updateMany({
          data: {
            isActive: false,
          },
          where: {
            AND: [
              { userId: row.userId },
              {
                id: {
                  not: row.id,
                },
              },
            ],
          },
        })
      } catch (error) {
        console.log("🔴 Prisma Error: ", error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }

      return { success: true }
    }),
})
