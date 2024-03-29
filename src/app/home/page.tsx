"use client"
import React, { useEffect } from "react"
import Layoutpage from "@/components/Navbar/Layout"
import { trpc } from "@/server/trpc/client"
import Post from "@/components/Post"
import { Loader2 } from "lucide-react"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"

function Home() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = trpc.postRouter.fetchFriendPosts.useInfiniteQuery(
    { limit: 2 },
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

  return (
    <Layoutpage>
      <section id="Home">
        <div className=" p-8 bg-white rounded-lg shadow-sm border border-gray-200 pb-52 md:pb-80 w-90 md:ml-60 tb:ml-40 tb:mr-10">
          <div className="pl-2 pt-4  pr-3  md:pt-3">
            <div className="h-24 pl-3 pt-2 pb-3 rounded-md mb-4 border border-gray-200">
              <div className="w-16 h-16 bg-white rounded-full overflow-hidden">
                <img
                  src="/Images/landing-image.png"
                  alt="Profile"
                  className="w-full h-full object-cover "
                />
              </div>
              <p className="text-gray-500 text-[10px] pl-5">story...</p>
            </div>

            <div className="flex items-center justify-center"></div>

            <div className="text-center mt-4">
              <h2 className="text-xl  bg-gradient-to-r from-[#98D1CF] to-[#1F7074] bg-clip-text text-transparent">
                Welcome to SmartConnect
              </h2>
              <p className="text-gray-500">
                Start following friends, influencers or account you&apos;re are
                interested in
              </p>
            </div>
          </div>
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
                      post?.user?.emailAddresses[0].emailAddress.split(
                        "@"
                      )[0]) ||
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
            className={cn(
              isFetchingNextPage || hasNextPage ? "block" : "hidden"
            )}
          >
            {<Loader2 className="animate-spin mx-auto text-gray-400 mt-3" />}
          </div>
          <div
            className={cn(
              "mt-3 mb-3 text-gray-800 font-lg text-center hidden",
              {
                block: !hasNextPage && !isFetchingNextPage,
              }
            )}
          >
            You&apos;ve reached the end. Maybe take a break? 🤔
          </div>
        </div>
        <div className=" md:mt-[-35px] tb:mt-[-35px] lg:mt-[-35px]"></div>
      </section>
    </Layoutpage>
  )
}

export default Home
