import { trpc } from '@/server/trpc/client'
import React from 'react'
import Post from '../Post'
import { Skeleton } from '../ui/skeleton'
import { MoreVertical } from 'lucide-react'


const GroupPostReel = ({groupId}: {groupId: string}) => {
    const {
        data: groupPosts,
        isLoading,
        isError,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
      } = trpc.groupRouter.fetchPosts.useInfiniteQuery(
        { limit: 2, groupId },
        {
          getNextPageParam: (lastPageResponse) => lastPageResponse.nextCursor,
        }
      )
      if (isLoading) {
        return (
          <Skeleton className="flex flex-col max-w-full mx-auto w-[450px] h-[550px] items-center bg-gray-200 border rounded-sm shadow-sm  gap-4 ">
            <div className="flex items-center gap-4 ml-[200px] mt-3">
              <Skeleton className="w-16 h-16 rounded-full -ml-[200px]" />
              <div className="flex flex-col">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-20 h-2 mt-1" />
              </div>
              <Skeleton className="right-0 hover:bg-gray-20 rounded-full p-1 ml-[100px]">
                <MoreVertical className="text-gray-200"/>
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
        )
      }
  return (
      <>
    {!isLoading &&
        groupPosts?.pages.map((response) =>
          response.posts.map((post) => {
            return (
              <div className="">
              <Post
                key={post?.post.id}
                groupId={post?.post.groupId|| ""}
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
                userId={post.user.id}
                isLikedByUser={post.post.isLikedByUser ?? false}
              />
              </div>
            )
          })
        )}
        </>
  )
}

export default GroupPostReel