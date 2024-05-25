import { z } from "zod"
import { privateProcedure, publicProcedure, router } from "../trpc"
import { TRPCError } from "@trpc/server"

export const eventRouter = router({
  createEvent: privateProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        location: z.string(),
        time: z.string(),
        imageUrl: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { description, name, location, time, date, imageUrl } = input

      const createdEvent = await ctx.prisma.event.create({
        data: {
          description,
          name,
          location,
          time,
          date,
          organizerId: ctx.user.id,
          EventMedia: {
            create: {
              url: imageUrl,
            },
          },
          EventUsers: {
            create: {
              userId: ctx.user.id,
            },
          },
        },
      })

      return { success: true, createdEvent }
    }),

  fetchEvents: privateProcedure.query(async ({ ctx }) => {
    const events = await ctx.prisma.event.findMany({
      where: {
        EventUsers: {
          some: {
            userId: {
              equals: ctx.user.id,
            },
          },
        },
      },
      include: {
        EventMedia: true,
      },
    })
    return { success: true, events }
  }),

  fetchRecommendedEvents: privateProcedure.query(async ({ input, ctx }) => {
    const {
      user: { id },
    } = ctx

    const recommendedEvents = await ctx.prisma.event.findMany({
      where: {
        EventUsers: {
          none: {
            userId: id,
          },
        },
      },
    })

    return { sucecss: true, recommendedEvents }
  }),

  markInterested: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { eventId } = input

      await ctx.prisma.eventUsers.create({
        data: {
          userId: ctx.user.id,
          eventId,
        },
      })

      return { success: true }
    }),

  markUninterested: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { eventId } = input

      const markedEvent = await ctx.prisma.eventUsers.deleteMany({
        where: {
          eventId,
          userId: ctx.user.id,
        },
      })

      return { success: true, markedEvent }
    }),

  deleteEvent: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { eventId } = input

      const deletedEvent = await ctx.prisma.event.deleteMany({
        where: {
          organizerId: ctx.user.id,
          id: eventId,
        },
      })

      return { success: true, deletedEvent }
    }),
})
