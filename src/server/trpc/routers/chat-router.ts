import { string, z } from "zod"
import { privateProcedure, publicProcedure, router } from "../trpc"
import { TRPCError } from "@trpc/server"
import { filterUsersForClient } from "../../helpers/filterUserForClient"
import clerk from "@clerk/clerk-sdk-node"
import { observable } from "@trpc/server/observable"
import { Message } from "@prisma/client"

export const chatRouter = router({
  // Subscription for new message notifications
  onMessageCreated: publicProcedure
    .input(
      z.object({
        senderId: z.string(),
      })
    )
    .subscription(({ ctx, input }) => {
      const { senderId } = input

      return observable((emit) => {
        const sendMessageCreatedToClient = async (message: Message) => {
          if (message.from !== senderId) {
            emit.next(message)
          }
        }

        ctx.ee.on("onMessageCreatedInChat", sendMessageCreatedToClient)

        return () => {
          ctx.ee.off("onMessageCreatedInChat", sendMessageCreatedToClient)
        }
      })
    }),

  messageSocketSubscription: publicProcedure
    .input(
      z.object({
        chatId: z.string().uuid(),
        senderId: z.string(),
        receiverId: z.string(),
        text: z.string(),
      })
    )
    .subscription(({ ctx, input }) => {
      const { chatId, senderId, receiverId, text } = input

      return observable((emit) => {
        const sendMessageCreatedInstantlyToClient = async () => {
          emit.next({ chatId, senderId, receiverId, text })
        }

        ctx.ee.on("getMessageInstantly", sendMessageCreatedInstantlyToClient)

        return () => {
          ctx.ee.off("getMessageInstantly", sendMessageCreatedInstantlyToClient)
        }
      })
    }),

  createChat: privateProcedure
    .input(
      z.object({
        userId: string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input

      const chat = await ctx.prisma.chat.create({
        data: {
          userA: ctx.user.id,
          userB: userId,
        },
      })

      return { success: true, chat }
    }),

  getMessages: privateProcedure
    .input(
      z.object({
        chatId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { chatId } = input

      // Ensure the current user is a participant in the chat
      const chat = await ctx.prisma.chat.findFirst({
        where: {
          id: chatId,
          OR: [{ userA: ctx.user.id }, { userB: ctx.user.id }],
        },
      })

      if (!chat) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to view these messages",
        })
      }

      const messages = await ctx.prisma.message.findMany({
        where: {
          chatId,
        },
        orderBy: {
          createdAt: "asc",
        },
      })

      return { success: true, messages }
    }),

  getChats: privateProcedure.query(async ({ ctx, input }) => {
    // Fetch chats involving the current user
    const chats = await ctx.prisma.chat.findMany({
      where: {
        OR: [{ userA: ctx.user.id }, { userB: ctx.user.id }],
      },
      include: {
        message: true,
      },
    })

    if (chats.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No chats found",
      })
    }

    // Extract user IDs involved in these chats
    const userIds = chats
      .map((chat) => [chat.userA, chat.userB])
      .flat()
      .filter(
        (id, index, self) => id !== ctx.user.id && self.indexOf(id) === index
      ) // remove duplicates and exclude the current user

    // Fetch user details from Clerk
    const users = await clerk.users.getUserList({
      userId: userIds,
    })

    // Function to filter users for the client
    const filteredUsers = filterUsersForClient(users)

    // Create a map of userId to user details for easy lookup
    const userMap = new Map(filteredUsers.map((user) => [user.id, user]))

    // Attach user details to each chat
    const chatsWithUsers = chats.map((chat) => ({
      ...chat,
      userA: userMap.get(chat.userA),
      userB: userMap.get(chat.userB),
    }))

    return { success: true, chats: chatsWithUsers }
  }),

  getChat: privateProcedure
  .input(z.object({ chatId: z.string() }))
  .query(async ({ ctx, input }) => {
    // Fetch the chat involving the current user by chatId
    const chat = await ctx.prisma.chat.findUnique({
      where: {
        id: input.chatId,
      },
      include: {
        message: true,
      },
    });

    if (!chat) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chat not found",
      });
    }

    // Ensure the current user is involved in the chat
    if (chat.userA !== ctx.user.id && chat.userB !== ctx.user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized to view this chat",
      });
    }

    // Extract the user IDs involved in the chat
    const userIds = [chat.userA, chat.userB].filter((id) => id !== ctx.user.id);

    // Fetch user details from Clerk
    const users = await clerk.users.getUserList({
      userId: userIds,
    });

    // Function to filter users for the client
    const filteredUsers = filterUsersForClient(users);

    // Create a map of userId to user details for easy lookup
    const userMap = new Map(filteredUsers.map((user) => [user.id, user]));

    // Attach user details to the chat
    const chatWithUsers = {
      ...chat,
      userA: userMap.get(chat.userA),
      userB: userMap.get(chat.userB),
    };

    return { success: true, chat: chatWithUsers };
  }),

  sendMessage: privateProcedure
    .input(
      z.object({
        chatId: z.string().uuid(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { chatId, text } = input

      // Ensure the current user is a participant in the chat
      const chat = await ctx.prisma.chat.findFirst({
        where: {
          id: chatId,
          OR: [{ userA: ctx.user.id }, { userB: ctx.user.id }],
        },
        include: {
          message: true
        }
      })

      if (!chat) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to send messages in this chat",
        })
      }

      const sentMessage = await ctx.prisma.message.create({
        data: {
          from: ctx.user.id,
          to: chat.userA === ctx.user.id ? chat.userB : chat.userA,
          text,
          chatId,
        },
      })

      ctx.ee.emit("onMessageCreatedInChat", sentMessage)

      return { success: true, sentMessage }
    }),
})
