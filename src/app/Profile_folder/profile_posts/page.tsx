"use client"

import Post from "@/components/Post"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { trpc } from "@/server/trpc/client"
import { useUser } from "@clerk/nextjs"
import { Loader2, MoreVertical } from "lucide-react"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

interface Props {
  userId: string
}

function ProfilePostsPage({ userId }: Props) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = trpc.postRouter.fetchUserPosts.useInfiniteQuery(
    { userId, limit: 2 },
    {
      getNextPageParam: (lastPageResponse) => lastPageResponse.nextCursor,
    }
  )

  console.log("data: ", data)

  const { ref, inView, entry } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  if (isLoading) {
    return (
      <div className="absolute top-2 left-4 border border-gray-100  w-[260px] sb:w-[300px] sbb:w-[350px] tb:w-[330px] tbbb:w-[350px] tbb:w-[500px] md:w-[520px] lgg:w-[400px] lggg:w-[500px]">
      <Skeleton className="flex flex-col max-w-full mx-auto w-[450px] h-[550px] items-center bg-gray-200 border rounded-sm shadow-sm  gap-4 ">
        <div className="flex items-center gap-4 ml-[200px] mt-3">
          <Skeleton className="w-16 h-16 rounded-full -ml-[200px]" />
          <div className="flex flex-col">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-20 h-2 mt-1" />
          </div>
          <Skeleton className="right-0 hover:bg-gray-20 rounded-full p-1 ml-[100px]">
            <MoreVertical className="text-gray-200" />
          </Skeleton>
        </div>

        <Skeleton className="w-full h-[400px] relative" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-32 h-6" />
          </div>
        </div>
      </Skeleton>
      </div>
    )
  }

  return (
    <div className="absolute top-2 left-4 border border-gray-100  w-[260px] sb:w-[300px] sbb:w-[350px] tb:w-[330px] tbbb:w-[350px] tbb:w-[500px] md:w-[470px] lg:w-[470px] lgg:w-[440px] lggg:w-[500px]">
      <div className="flex flex-col">
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
                isLikedByUser={post.post.isLikedByUser ?? false}
                userId={post.user.id}
                groupId={post.post.groupId || ""}
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
          className={cn(
            "mt-3 mb-3  text-gray-800 font-lg text-center hidden md:ml-[20px]   mddd:ml-[20px]  lgg:ml-[20px]",
            {
              block: !hasNextPage && !isFetchingNextPage,
            }
          )}
        >
          You&apos;ve reached the end. Maybe take a break? 🤔
        </div>
      </div>
    </div>
  )
}
export default ProfilePostsPage
