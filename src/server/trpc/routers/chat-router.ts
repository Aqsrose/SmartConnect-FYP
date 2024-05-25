import { string, z } from "zod"
import { privateProcedure, publicProcedure, router } from "../trpc"
import { TRPCError } from "@trpc/server"

export const chatRouter = router({
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
    const chats = await ctx.prisma.chat.findMany({
      where: {
        OR: [{ userA: ctx.user.id }, { userB: ctx.user.id }],
      },
    })

    return { success: true, chats }
  }),
})
