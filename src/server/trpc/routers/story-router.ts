import { string, z } from "zod"
import { privateProcedure, publicProcedure, router } from "../trpc"
import { TRPCError } from "@trpc/server"
import { Prisma } from "@prisma/client"
import clerk from "@clerk/clerk-sdk-node"
import { filterUserForClient } from "../../../server/helpers/filterUserForClient"
import { StoryWithRelations } from "../../../../prisma/types"

export const addUserDataToStories = async (stories: StoryWithRelations[]) => {
  const userIds = stories.map((story) => story.userId)
  const usersList = (
    await clerk.users.getUserList({
      userId: userIds,
    })
  ).map(filterUserForClient)

  return stories.map((story) => {
    const user = usersList.find((user) => user.id === story.userId)

    if (!user) {
      console.error("USER NOT FOUND", story)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${story.id}, USER ID: ${story.userId}`,
      })
    }
    return {
      story,
      user,
    }
  })
}

export const storyRouter = router({
  createStory: privateProcedure
    .input(
      z.object({
        mediaType: z.string(),
        mediaUrl: z.string(),
        expiresAt: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { expiresAt, mediaType, mediaUrl } = input

      const expiryDate = new Date(expiresAt)

      const story = await ctx.prisma.userStory.create({
        data: {
          userId: ctx.user.id,
          mediaType,
          mediaUrl,
          expiresAt: expiryDate,
        },
      })

      return { success: true, story }
    }),

  deleteStory: privateProcedure
    .input(
      z.object({
        storyId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { storyId } = input

      const deletedStory = await ctx.prisma.userStory.delete({
        where: {
          id: storyId,
          userId: ctx.user.id,
        },
      })

      return { success: true, deletedStory }
    }),

  addStoryView: privateProcedure
    .input(
      z.object({
        storyId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { storyId } = input

      try {
        ctx.prisma.userStory.update({
          data: {
            views: {
              increment: 1,
            },
            storyViews: {
              create: {
                userId: ctx.user.id,
              },
            },
          },
          where: {
            id: storyId,
          },
        })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            console.log("View already counted")
          }
        }
      }

      return { success: true }
    }),

  fetchUserStories: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(),
        cursor: z.string().uuid().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50
      const { cursor } = input

      // Fetch raw stories
      let rawStories = await ctx.prisma.userStory.findMany({
        take: limit + 1, // Fetch one more than the limit to check if there are more stories
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          expiresAt: {
            gte: new Date()
          }
        },
        include: {
          storyViews: true,
        },
      })

      // Check if there are more stories than the limit for pagination
      const hasMore = rawStories.length > limit
      if (hasMore) {
        rawStories.pop() // Remove the extra story used for pagination check
      }

      // Group stories by userId
      const groupedStories = rawStories.reduce((acc, story) => {
        if (!acc[story.userId]) {
          acc[story.userId] = []
        }
        acc[story.userId].push(story)
        return acc
      }, {} as Record<string, typeof rawStories>)

      // Fetch and attach user data to each story
      const storiesWithUserData = await Promise.all(
        Object.keys(groupedStories).map(async (userId) => {
          const userStories = groupedStories[userId]
          const enrichedStories = await addUserDataToStories(userStories)
          return {
            userId,
            stories: enrichedStories,
          }
        })
      )

      // Extract the last story's id to use as the next cursor
      const nextCursor = hasMore
        ? rawStories[rawStories.length - 1].id
        : undefined

      return {
        success: true,
        stories: storiesWithUserData,
        nextCursor,
      }
    }),

  fetchStory: privateProcedure
    .input(
      z.object({
        storyId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { storyId } = input

      const story = await ctx.prisma.userStory.findFirst({
        where: {
          id: storyId,
        },
        include: {
          storyViews: true,
        },
      })

      const storyWithUser = story && (await addUserDataToStories([story]))[0]

      return { success: true, storyWithUser }
    }),
})
