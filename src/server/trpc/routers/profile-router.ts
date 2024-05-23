import { z } from "zod"
import { privateProcedure, publicProcedure, router } from "../trpc"
import { TRPCError } from "@trpc/server"
import clerk from "@clerk/clerk-sdk-node"
import {
  filterUserForClient,
  filterUsersForClient,
} from "../../helpers/filterUserForClient"

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
  fetchUserInfo: publicProcedure
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

      return { success: true, user: filteredUser }
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

  fetchFriends: privateProcedure
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
