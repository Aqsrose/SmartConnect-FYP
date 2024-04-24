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
      <section id="Home" className="h-[700px] flex flex-col max-w-full mx-auto w-[240px] sbb:w-[300px] tb:w-[280px] tbbb:w-[350px] tbb:w-[512px] items-center ml-5 sb:ml-8 tb:ml-28  md:ml-[200px] mdd:ml-[300px] lg:ml-[512px]  border border-gray-200">
          <div className=" pl-2 pt-4 pr-3  md:pt-3">
            <div className=" w-[220px] sbb:w-[280px] tb:w-[260px] tbbb:w-[330px] tbb:w-[490px] ml-[7px] sb:ml-[10px] sbb:ml-[10px] tb:ml-[10px] tbbb:ml-[10px] tbb:ml-[10px] h-24 pl-3 pt-2 pb-3 rounded-md mb-4 border border-gray-200">
              <div className="w-16 h-16 bg-white rounded-full overflow-hidden">
                <img
                  src="/Images/Ai.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover "
                />
              </div>
              <p className="text-gray-500 text-[10px] pl-3 w-16">your story</p>
            </div>
            <div className="text-center mt-4">
              <h2 className="text-lg  bg-gradient-to-r from-[#98D1CF] to-[#1F7074] bg-clip-text text-transparent mt-24 pr-0 pl-0 tb:pr-2  tbb:ml-0">
                Welcome to SmartConnect
              </h2>
              <p className="text-gray-500 mt-3 ml-1 mr-1 tbbb:ml-3 tbbb:mr-3">
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
          
          </div>
        <div className=" md:mt-[-35px] tb:mt-[-35px] lg:mt-[-35px]"></div>
      </section>
    </Layoutpage>
  )
}

export default Home
