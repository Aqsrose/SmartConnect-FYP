"use client"
import { trpc } from "@/server/trpc/client"
import Link from "next/link"
import React from "react"

function RightBar() {
  const { data } = trpc.profileRouter.fetchNonFriends.useQuery()

  return (
    <div className="w-[270px] fixed right-0  h-full shadow-md hidden mdd:hidden md:hidden lg:hidden mddd:block lgg:block bg-white">
      <div
        className=" text-white p-7 m-3 mt-32 rounded-lg border-2 border-[#01A9B4]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom,#1A1E50,#10676B,#4D869C,#086972,#22577E,#004A7C)",
        }}
      >
        <h2 className="font-semibold mb-2">🔗 Connect</h2>
        <p>
          {" "}
          With MetaMask to manage and interact with your NFTs securely on the
          blockchain!
        </p>
      </div>

      <div className="mt-4 pl-4 overflow-auto">
        <h3 className="text-lg font-semibold mb-4 text-[#4D869C]">
          Who to follow
        </h3>

        {data &&
          data.nonFriends.map((nonFriend) => {
            return (
              <div className="flex items-center gap-3 mb-4 border border-[#b5d8da] rounded-sm pt-2 pl-2 bg-gray-50">
                <img src={nonFriend.imageUrl} alt="" className="w-9 h-9 rounded-full mb-2 ml-3" />
                <div className="flex">
                  <div>
                    <p className="font-medium ml-1">{nonFriend.fullname}</p>
                    <p className="text-sm text-gray-500 ml-1 mb-3">
                      {nonFriend.username}
                    </p>
                  </div>
                  <div>
                    <Link
                      href={`/profile/${nonFriend.id}`}
                      className="text-xs text-blue-500 hover:text-blue-600 border border-[#b5d8da] mt-1 rounded-sm p-2 ml-5"
                    >
                      See
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default RightBar
