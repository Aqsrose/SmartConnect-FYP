import { postSchema } from "../../validation schemas/postSchema"
import { privateProcedure, publicProcedure, router } from "../trpc"
import { TRPCError } from "@trpc/server"
import * as z from "zod"
import clerk from "@clerk/clerk-sdk-node"
import { PostWithRelations } from "../../../../prisma/types"
import { filterUserForClient } from "../../../server/helpers/filterUserForClient"
import { observable } from "@trpc/server/observable"
import {
  DetectLabelsCommand,
  RekognitionClient,
  DetectModerationLabelsCommand,
  StartContentModerationCommand,
  GetContentModerationCommand,
  StartLabelDetectionCommand,
  GetLabelDetectionCommand,
} from "@aws-sdk/client-rekognition"
import type { PrismaClient } from "@prisma/client"

const getFileNameFromUrl = (url: string) => {
  const parts = url.split("/")
  return parts[parts.length - 1]
}

const getLabels = async (prisma: PrismaClient, postId: string) => {
  console.log("region: ", process.env.AWS_BUCKET_REGION)
  console.log("bucket name: ", process.env.AWS_BUCKET_NAME)

  try {
    const client = new RekognitionClient({
      region: process.env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY!,
      },
    })

    const mediaItems = await prisma.media.findMany({
      where: { postId },
      select: { id: true, url: true, type: true },
    })

    for (const media of mediaItems) {
      if (media.type === "image") {
        // Image Label Detection
        const detectionParams = {
          Image: {
            S3Object: {
              Bucket: process.env.AWS_BUCKET_NAME,
              Name: getFileNameFromUrl(media.url),
            },
          },
          MaxLabels: 10,
          MinConfidence: 75,
        }

        const detectLabelsCommand = new DetectLabelsCommand(detectionParams)
        const response = await client.send(detectLabelsCommand)

        if (response.Labels) {
          await prisma.mediaLabels.createMany({
            data: response.Labels.map((label) => ({
              label: label.Name ?? "",
              confidence: label.Confidence ?? 0,
              mediaId: media.id,
            })),
          })

          console.log("labels for media id", media.id, ":", response.Labels)
        }
      } else if (media.type === "video") {
        // Video Label Detection
        const startLabelDetectionParams = {
          Video: {
            S3Object: {
              Bucket: process.env.AWS_BUCKET_NAME,
              Name: getFileNameFromUrl(media.url),
            },
          },
          MinConfidence: 75,
        }

        const startLabelDetectionCommand = new StartLabelDetectionCommand(
          startLabelDetectionParams
        )
        const startResponse = await client.send(startLabelDetectionCommand)

        if (startResponse.JobId) {
          let labelDetectionComplete = false
          let response

          while (!labelDetectionComplete) {
            const getLabelDetectionCommand = new GetLabelDetectionCommand({
              JobId: startResponse.JobId,
            })
            response = await client.send(getLabelDetectionCommand)

            if (response.JobStatus === "SUCCEEDED") {
              labelDetectionComplete = true
            } else if (response.JobStatus === "FAILED") {
              throw new Error("Video label detection job failed.")
            } else {
              // Wait before polling again
              await new Promise((resolve) => setTimeout(resolve, 5000))
            }
          }

          if (response && response.Labels) {
            // Process only up to 10 labels
            const limitedLabels = response.Labels.slice(0, 10)

            await prisma.mediaLabels.createMany({
              data: limitedLabels.map((label) => ({
                label: label.Label?.Name ?? "",
                confidence: label.Label?.Confidence ?? 0,
                mediaId: media.id,
              })),
            })

            console.log("labels for media id", media.id, ":", limitedLabels)
          }
        }
      }
    }
  } catch (error) {
    console.log("error: ", error)
  }
}

const getModerationLabels = async (prisma: PrismaClient, postId: string) => {
  console.log("region: ", process.env.AWS_BUCKET_REGION)
  console.log("bucket name: ", process.env.AWS_BUCKET_NAME)

  try {
    const client = new RekognitionClient({
      region: process.env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY!,
      },
    })

    const mediaItems = await prisma.media.findMany({
      where: { postId },
    })

    for (const media of mediaItems) {
      if (media.type === "image") {
        // Image Moderation
        const detectionParams = {
          Image: {
            S3Object: {
              Bucket: process.env.AWS_BUCKET_NAME,
              Name: getFileNameFromUrl(media.url),
            },
          },
          MinConfidence: 75,
        }

        const detectModerationLabelsCommand = new DetectModerationLabelsCommand(
          detectionParams
        )
        const response = await client.send(detectModerationLabelsCommand)

        if (response.ModerationLabels && response.ModerationLabels?.length > 0) {
          console.log(response)
          await prisma.mediaModeration.createMany({
            data: response.ModerationLabels.map((label) => ({
              confidence: label.Confidence ?? 0,
              moderationLabel: label.Name ?? "",
              mediaId: media.id,
            })),
          })

          const labelsString = response.ModerationLabels.map(
            (label) => label.Name
          ).join(", ")
          const notificationContent = `Your post has been flagged for the following reasons: ${labelsString}`

          await prisma.notification.create({
            data: {
              type: "POST_FLAGGED",
              userId: media.userId,
              content: notificationContent,
              entityId: media.postId,
              senderId: "system",
            },
          })
        }
      } else if (media.type === "video") {
        // Video Moderation
        const startModerationParams = {
          Video: {
            S3Object: {
              Bucket: process.env.AWS_BUCKET_NAME,
              Name: getFileNameFromUrl(media.url),
            },
          },
          MinConfidence: 75,
        }

        const startContentModerationCommand = new StartContentModerationCommand(
          startModerationParams
        )
        const startResponse = await client.send(startContentModerationCommand)

        if (startResponse.JobId) {
          let moderationComplete = false
          let response

          while (!moderationComplete) {
            const getContentModerationCommand = new GetContentModerationCommand(
              {
                JobId: startResponse.JobId,
              }
            )
            response = await client.send(getContentModerationCommand)

            if (response.JobStatus === "SUCCEEDED") {
              moderationComplete = true
            } else if (response.JobStatus === "FAILED") {
              throw new Error("Video moderation job failed.")
            } else {
              // Wait before polling again
              await new Promise((resolve) => setTimeout(resolve, 5000))
            }
          }

          if (response && response.ModerationLabels && response.ModerationLabels?.length > 0) {
            await prisma.mediaModeration.createMany({
              data: response.ModerationLabels.splice(0, 10).map((label) => ({
                confidence: label.ModerationLabel?.Confidence ?? 0,
                moderationLabel: label.ModerationLabel?.Name ?? "",
                mediaId: media.id,
              })),
            })

            const labelsString = response.ModerationLabels.splice(0, 10)
              .map((label) => label.ModerationLabel?.Name)
              .join(", ")
            const notificationContent = `Your post has been flagged for the following reasons: ${labelsString}`

            await prisma.notification.create({
              data: {
                type: "POST_FLAGGED",
                userId: media.userId,
                content: notificationContent,
                entityId: media.postId,
                senderId: "system",
              },
            })
          }
        }
      }
    }
  } catch (error) {
    console.log("error: ", error)
  }
}

export const addUserDataToPosts = async (posts: PostWithRelations[]) => {
  const userIds = posts.map((post) => post.userId)
  const usersList = (
    await clerk.users.getUserList({
      userId: userIds,
    })
  ).map(filterUserForClient)

  return posts.map((post) => {
    const user = usersList.find((user) => user.id === post.userId)

    if (!user) {
      console.error("USER NOT FOUND", post)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.userId}`,
      })
    }
    return {
      post,
      user,
    }
  })
}
export const postRouter = router({
  onCreated: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .subscription(({ ctx, input }) => {
      const { userId } = input

      return observable<PostWithRelations>((emit) => {
        const sendPostCreatedEvent = async (post: PostWithRelations) => {
          const friends = await ctx.prisma.friend.findMany({
            where: {
              OR: [{ userId: post.userId }, { friendId: post.userId }],
            },
          })

          friends.forEach((friend) => {
            //sending to every friend other than the creator
            if (
              (friend.friendId === userId || friend.userId === userId) &&
              post.userId !== userId
            ) {
              emit.next(post)
            }
          })
        }

        ctx.ee.on("onPostCreated", sendPostCreatedEvent)

        return () => {
          ctx.ee.off("onPostCreated", sendPostCreatedEvent)
        }
      })
    }),

  //just gonna make it private for now
  //might adjust to be public when I change other things as well
  fetchAllPosts: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(),
        cursor: z.string().uuid().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50
      const { cursor } = input

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
            media: {
              include: {
                labels: true,
                moderation: true,
              },
            },
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

  fetchFriendPosts: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(),
        cursor: z.string().uuid().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50
      const { cursor } = input

      let rawPosts: PostWithRelations[]
      try {
        const userFriends = await ctx.prisma.friend.findMany({
          where: {
            OR: [{ userId: ctx.user.id }, { friendId: ctx.user.id }],
          },
          select: {
            userId: true,
            friendId: true,
          },
        })

        const friendIds = userFriends.map((friend) =>
          friend.userId !== ctx.user.id ? friend.userId : friend.friendId
        )

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
          where: {
            userId: {
              in: friendIds,
            },
          },
          include: {
            _count: {
              select: {
                comments: true,
                postLikes: true,
              },
            },
            postLikes: true,
            media: {
              include: {
                moderation: true,
                labels: true,
              },
            },
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

  fetchPost: publicProcedure
    .input(
      z.object({
        postId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { postId } = input

      if (!postId) throw new TRPCError({ code: "BAD_REQUEST" })

      let post: PostWithRelations | null

      post = await ctx.prisma.post.findFirst({
        where: {
          id: postId,
        },
        include: {
          _count: {
            select: {
              comments: true,
              postLikes: true,
            },
          },
          postLikes: true,
          media: {
            include: {
              moderation: true,
              labels: true,
            },
          },
        },
      })

      if (!post) throw new TRPCError({ code: "NOT_FOUND" })

      const postWithUser = (await addUserDataToPosts([post]))[0]

      return { success: true, post: postWithUser }
    }),

  fetchUserPosts: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(),
        cursor: z.string().uuid().nullish(),
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50
      const { cursor, userId } = input

      if (!userId) {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }

      let rawPosts: PostWithRelations[]
      try {
        rawPosts = await ctx.prisma.post.findMany({
          where: {
            userId: userId,
          },
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: [
            {
              createdAt: "desc",
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
            media: {
              include: {
                moderation: true,
                labels: true,
              },
            },
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

  createPost: privateProcedure
    .input(postSchema)
    .mutation(async ({ ctx, input }) => {
      const { caption, mediaUrls, fileTypes, hashTags, groupId } = input
      const userId = ctx.user.id

      if (!caption && mediaUrls?.length == 0) {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }

      let post
      try {
        post = await ctx.prisma.post.create({
          data: {
            userId: userId,
            caption: caption ?? null,
            media: {
              createMany: {
                data: mediaUrls!.map((url, index) => ({
                  // Assuming fileTypes is an array with the same length as mediaUrls
                  type: fileTypes![index].startsWith("image")
                    ? "image"
                    : "video",
                  url: url,
                  userId: ctx.user.id,
                })),
              },
            },
            groupId: groupId ?? null,
            hashTags: {
              createMany: {
                data: hashTags!.map((tag) => ({
                  name: tag,
                })),
              },
            },
          },
        })

        console.log("created post: ", post) //this post doesn't include relations by default
        // so we will need to fetch it again

        await getLabels(ctx.prisma, post.id)
        await getModerationLabels(ctx.prisma, post.id)

        // await storeLabels(media.id, labels)
        // await storeModerationLabels(media.id, moderationLabels)
      } catch (error) {
        console.log("🔴 Prisma Error: ", error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }

      ctx.ee.emit("onPostCreated", post)

      //for now I am just gonna add the notification logic here, which can later be
      //changed to be handled by a background worker process

      return { success: true, post }
    }),

  deletePost: privateProcedure
    .input(
      z.object({
        postId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { postId } = input

      if (!postId) {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }

      try {
        const batchPayload = await ctx.prisma.post.deleteMany({
          where: {
            id: postId,
            userId: ctx.user.id,
          },
        })
      } catch (error) {
        console.log("🔴 Prisma Error: ", error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }
      return { success: true }
    }),

  likePost: privateProcedure
    .input(
      z.object({
        postId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { postId } = input

      if (!postId) {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }

      try {
        //maybe make this more secure later by checking if the user has already liked the post
        const post = await ctx.prisma.post.update({
          data: {
            likes: {
              increment: 1,
            },
            postLikes: {
              create: {
                userId: ctx.user.id,
              },
            },
          },
          where: {
            id: postId,
          },
        })

        const user = await clerk.users.getUser(ctx.user.id)
        const filteredUser = filterUserForClient(user)
        //because we don't want to insert notificaitons for our own posts
        if (post.userId !== ctx.user.id) {
          const notification = await ctx.prisma.notification.create({
            data: {
              type: "POST_LIKE",
              userId: post.userId,
              content: `${filteredUser.username} liked your post`,
              entityId: post.id,
              senderId: ctx.user.id,
            },
          })
        }
      } catch (error) {
        console.log("🔴 Prisma Error: ", error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }

      return { success: true }
    }),
  unlikePost: privateProcedure
    .input(
      z.object({
        postId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { postId } = input

      if (!postId) {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }

      try {
        await ctx.prisma.post.update({
          data: {
            likes: {
              decrement: 1,
            },
            postLikes: {
              deleteMany: {},
            },
          },
          where: {
            id: postId,
          },
        })
      } catch (error) {
        console.log("🔴 Prisma Error: ", error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }
      return { success: true }
    }),

  savePost: privateProcedure
    .input(
      z.object({
        postId: z.string().uuid(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { postId, userId } = input

      if (!postId || !userId) {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }

      try {
        await ctx.prisma.savedPosts.create({
          data: {
            postId: postId,
            userId: userId,
          },
        })
      } catch (error) {
        console.log("🔴 Prisma Error: ", error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }
      return { success: true }
    }),

  fetchSavedPosts: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(),
        cursor: z.string().uuid().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50
      const { cursor } = input

      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      let rawSavedPosts = await ctx.prisma.savedPosts.findMany({
        take: limit + 1,
        cursor: cursor
          ? { postId_userId: { postId: cursor, userId: ctx.user.id } }
          : undefined,
        where: {
          userId: ctx.user.id,
        },
        orderBy: [
          {
            post: {
              createdAt: "desc",
            },
          },
        ],
        include: {
          post: {
            include: {
              _count: {
                select: {
                  comments: true,
                  postLikes: true,
                },
              },
              postLikes: true,
              media: {
                include: {
                  moderation: true,
                  labels: true,
                },
              },
            },
          },
        },
      })

      const postsWithUsers = await addUserDataToPosts(
        rawSavedPosts.map((sp) => sp.post)
      )

      const posts = postsWithUsers.map((post) => {
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
})
