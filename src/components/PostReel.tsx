"use client"

import React, { useEffect } from "react"
import Post from "./Post"
import { trpc } from "@/server/trpc/client"
import { cn } from "@/lib/utils"
import { Skeleton } from "./ui/skeleton"
import { useInView } from "react-intersection-observer"
import { Loader2 } from "lucide-react"

const PostReel = () => {
  // fetch all posts here

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = trpc.postRouter.fetchAllPosts.useInfiniteQuery(
    { limit: 2 },
    {
      getNextPageParam: (lastPageResponse) => lastPageResponse.nextCursor,
    }
  )

  const { ref, inView, entry } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-400" />
          <Skeleton className="h-4 w-[200px] bg-gray-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col max-w-full mx-auto w-[512px]">
      {data?.pages.map((response) =>
        response.posts.map((post) => {
          return (
            <Post
              key={post?.post.id}
              id={post?.post.id || ""}
              caption={post?.post.caption || ""}
              createdAt={post?.post.createdAt || ""}
              likes={post?.post._count.postLikes || 0}
              commentCount={post?.post._count.comments || 0}
              userImageUrl={post?.user?.imageUrl || ""}
              userDisplayName={
                (post?.user?.username ??
                  post?.user?.emailAddresses[0].emailAddress.split("@")[0]) ||
                ""
              }
              media={post!.post.media}
              postLikes={post!.post.postLikes}
            />
          )
        })
      )}
      <div
        ref={ref}
        className={cn(isFetchingNextPage || hasNextPage ? "block" : "hidden")}
      >
        {<Loader2 className="animate-spin mx-auto text-gray-400 mt-3" />}
      </div>
      <div
        className={cn("mt-3 mb-3 text-gray-800 font-lg text-center hidden", {
          block: !hasNextPage && !isFetchingNextPage,
        })}
      >
        You&apos;ve reached the end. Maybe take a break? 🤔
      </div>
    </div>
  )
}

export default PostReel

//will hold all the posts

// <ReactInifiniteScroll>
//   <Post/>
// </ReactInifiniteScroll>
