"use client"
import Layoutpage from "@/components/Navbar/Layout"
import Post from "@/components/Post"
import { trpc } from "@/server/trpc/client"
import { Camera, Lock } from "lucide-react"
import React, { useRef, useState } from "react"
import GroupLinks from "@/components/Group/GroupLinks"
import Link from "@/components/Group/GroupContainers"

interface PageProps {
  params: {
    groupId: string
  }
}

const page = ({ params: { groupId } }: PageProps) => {
  const { data } = trpc.groupRouter.fetchGroupById.useQuery({ groupId })
  console.log("foo: ", data);
  
  const [activeLink, setActiveLink] = useState<string>('');
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

  // console.log("group posts: ", groupPosts)
  return (
    <Layoutpage>
      <div className="bg-white h-full -mt-6 pt-0 p-4 pl-2 tb:pl-32 pr-3 md:pl-64 md:pr-20">
        <div className="w-full h-72 rounded-md  relative bg-gray-100">
          {data?.group?.coverImageUrl && (
            <img
              src={data.group.coverImageUrl}
              alt="Cover"
              className="w-full h-72 object-cover rounded-md"
            />
          )}
          <div className="absolute right-0 bottom-0 p-1 border-4 border-white rounded-full bg-gray-50">
            <Camera
              className="cursor-pointer"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="-mt-14">
          <p className="text-xl text-gray-700 mt-16 ml-5 text-bold-xl ">
            {data?.group!.name}
          </p>
          <div className="">
            <Lock className="w-4 h-4 text-gray-400  ml-5 " />
            <p className="text-sm text-gray-400 -mt-4 ml-10">
              {data?.group?.isPublic ? "Public Group" : "Private Group"}
            </p>
            <p className="text-sm text-gray-400 -mt-5 ml-[135px]">
              {data?.group?._count.groupUsers} members
            </p>
          </div>
          <div className="flex">
            <div className="w-10 h-10 bg-gray-100 rounded-full ml-5  border-2 border-white relative ">
              <img
                src=""
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full -ml-2 border-2 border-white relative">
              <img
                src=""
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full -ml-2 border-2 border-white relative">
              <img
                src=""
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="absolute right-0 mr-2 sbb:-mt-9 mt-3  tb:mt-1 tbb:-mt-9 mdd:-mt-16 md:mr-20 tbb:mr-4 xd:-mt-20 xd:mr-20 ">
          <button
            className="bg-gradient-to-r  bg-blue-500 hover:from-blue-600 hover:to-blue-500 px-4 py-2  text-white rounded transition duration-200 mr-2"
          >
            + invite
          </button>
          <button
            className="bg-gradient-to-r bg-[#349E8D] hover:from-[#488f84] hover:to-[#349E8D]  text-white px-4 py-2 rounded transition duration-200"
          >
            Share
          </button>
        </div>
      </div>
      
      {!isLoading &&
        groupPosts?.pages.map((response) =>
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
                userId={post.user.id}
                isLikedByUser={post.post.isLikedByUser ?? false}
              />
            )
          })
        )}
         <GroupLinks setActiveLink={setActiveLink} />
      <Link activeLink={activeLink} />
        
    </Layoutpage>
  )
}

export default page
