"use client"
import React, { useEffect, useState } from "react"
import Logo from "@/components/landingpage/Logo"
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { trpc } from "@/server/trpc/client"
import { useParams, useRouter } from "next/navigation"
import { formatRelativeTime } from "@/lib/utils"

interface PageProps {
  params: {
    storyId: string
    userId: string
  }
}

function ViewStory() {
  const router = useRouter()

  const ids = useParams()
  const { userId, storyId } = ids
  // console.log({storyId, userId})
  // fetchin all the user stories again
  // skip to the story that the user had clicked
  // display that story in the center of the screen
  // dispaly the previous on the left
  // display the next one on the right

  // and when the next/previous button is clicked, we point to this same page

  // const stories = [1, 2, 3, 4, 5]

  const { data, isLoading, isError } = trpc.storyRouter.fetchUserStories.useInfiniteQuery(
    { limit: 50 },
    {
      getNextPageParam: (lastPageResponse) => lastPageResponse.nextCursor,
    }
  )

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)

  useEffect(() => {
    if (data) {
      const allStories = data.pages.flatMap((page) =>
        page.stories.flatMap((userStories) =>
          userStories.stories.map((story) => ({
            ...story,
            userId: userStories.userId,
            user: story.user,
          }))
        )
      )

      const index = allStories.findIndex((story) => story.story.id === storyId)
      setCurrentStoryIndex(index)
    }
  }, [data, storyId])

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error</div>
  if (!data) return <div>No stories found.</div>

  const allStories = data?.pages.flatMap((page) =>
    page.stories.flatMap((userStories) =>
      userStories.stories.map((story) => ({
        ...story,
        userId: userStories.userId,
        user: story.user,
      }))
    )
  )

  const currentStory = allStories[currentStoryIndex]
  const previousStory = allStories[currentStoryIndex - 1]
  const nextStory = allStories[currentStoryIndex + 1]

  const navigateToStory = (storyId: string, userId: string) => {
    router.push(`/story/${userId}/${storyId}`)
  }

  console.log("lets see: ", document.referrer)

  return (
    <section className="relative lgg:w-[700px]  lggg:w-full h-full">
      {/* Logo */}
      <div className="absolute top-5 left-6">
        <Logo />
      </div>

      {/* Cross Button */}
      <Link href="/home">
        <button className="absolute top-5 right-8 text-[40px] text-green-800">
          x
        </button>
      </Link>

      {/*Chevron*/}
      {previousStory && (
        <div
          className="absolute top-[300px] left-[400px] w-8 h-8 mt-12 border border-gray-700 rounded-full cursor-pointer pt-1"
          onClick={() =>
            navigateToStory(previousStory.story.id, previousStory.userId)
          }
        >
          <ChevronLeft />
        </div>
      )}
      {nextStory && (
        <div
          className="absolute top-[300px] right-[450px] w-8 h-8 mt-12 border border-gray-700 rounded-full cursor-pointer pt-1 pl-1"
          onClick={() => navigateToStory(nextStory.story.id, nextStory.userId)}
        >
          <ChevronRight />
        </div>
      )}

      {/*left Story*/}
      {previousStory && (
        <div className="bg-[#E1AFD1] w-[200px] h-[250px] blur-sm absolute top-[250px] left-[180px] rounded">
          <div>
            <div className="w-24 h-24 rounded-full overflow-hidden bg-red absolute top-8 left-12">
              <img
                src={previousStory.user.imageUrl}
                alt="Profile"
                className="object-cover"
              />
            </div>
            <div className="text-black absolute top-36 left-[60px]">
              <p>{previousStory.user.username}</p>
              <p className="text-sm ml-4">
                {formatRelativeTime(previousStory.story.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/*right Story*/}
      {nextStory && (
        <div className="bg-[#E1AFD1] w-[200px] h-[250px] blur-sm absolute top-[250px] right-[200px] rounded">
          <div>
            <div className="w-24 h-24 rounded-full overflow-hidden bg-red absolute top-8 left-12">
              <img
                src={nextStory.user.imageUrl}
                alt="Profile"
                className="object-cover"
              />
            </div>
            <div className="text-black absolute top-36 left-[60px]">
              <p>{nextStory.user.username}</p>
              <p className="text-sm ml-4">
                {formatRelativeTime(nextStory.story.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/*Current Story*/}
      <div className="absolute top-10 left-[500px] w-[500px] h-[670px] bg-slate-300 rounded">
        <div className="relative h-full">
          <div className="flex">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-red absolute top-4 left-4">
              <img
                src={currentStory.user.imageUrl}
                alt="Profile"
                className="object-cover"
              />
            </div>
            <div className="text-white absolute top-4 left-[70px]">
              <p>{currentStory.user.username}</p>
              <p className="text-sm">
                {formatRelativeTime(currentStory.story.createdAt)}
              </p>
            </div>
            <Trash2
              aria-label="hidden"
              className="h-5 w-5 text-red-500 absolute top-5 right-12"
            />
            <div className="absolute top-5 right-4">
              <MoreHorizontal />
            </div>
          </div>

          <div className="w-[460px] h-[550px] absolute top-20 left-5">
            <div className="w-full h-full">
              <img
                src={currentStory.story.mediaUrl}
                alt="Story"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="flex absolute bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="mr-2">
              <Eye />
            </div>
            <div>
              <p>{currentStory.story.views}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ViewStory
