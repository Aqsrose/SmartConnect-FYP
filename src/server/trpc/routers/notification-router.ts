import { string, z } from "zod"
import { privateProcedure, router } from "../trpc"
import { TRPCError } from "@trpc/server"
import { Notification } from "@prisma/client"
import { filterUserForClient } from "../../helpers/filterUserForClient"
import clerk from "@clerk/clerk-sdk-node"

const addUserDataToNotifications = async (notifications: Notification[]) => {
  const userIds = notifications.map((notification) => notification.senderId)

  if (userIds.length === 0) {
    return notifications.map((notification) => ({
      notification,
      user: null,
    }))
  }

  const usersList = (
    await clerk.users.getUserList({
      userId: userIds,
    })
  ).map(filterUserForClient)

  return notifications.map((notification) => {
    const user = usersList.find((user) => user.id === notification.senderId)

    if (notification.senderId && !user) {
      console.error("USER NOT FOUND", notification)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Sender for notification not found. NOTIFICATION ID: ${notification.id}, USER ID: ${notification.senderId}`,
      })
    }

    return {
      notification,
      user: user || null,
    }
  })
}

export const notificaitonRouter = router({
  fetchNotifcations: privateProcedure.query(async ({ input, ctx }) => {
    let rawNotifications = await ctx.prisma.notification.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    const notifications = await addUserDataToNotifications(rawNotifications)

    return { success: true, notifications }
  }),
})
