"use client"
import React from "react"
import ChatListHeader from "./ChatListHeader"
import SearchBar from "./SearchBar"
import List from "./List"
import { trpc } from "@/server/trpc/client"
import { formatRelativeTime } from "@/lib/utils"
import Avatar from "../Avatar"
import { useRouter } from "next/navigation"

export const ChatList = () => {

  const router = useRouter()

  const {
    data: chats,
    isLoading,
    isError,
  } = trpc.chatRouter.getChats.useQuery()
  console.log("chats: ", chats)
  return (
    <div className="bg-white flex flex-col max-h-screen z-20  ">
      <>
        <ChatListHeader />
        <SearchBar />
        {chats?.chats.map((chat) => {
          return (
            <div
              className="w-full relative flex items-center space-x-3 p-3 hover:bg-neutral-100rounded-lg transition cursor-pointer border bg-white"
              key={chat.id}
              onClick={() => {
                router.push(`/message/chat/${chat.id}`)
              }}
            >
              <Avatar url={chat.userB?.imageUrl ?? chat.userA?.imageUrl ?? ""} />
              <div className="min-w-0 flex-1 ">
                <div className=" focus:outline-none">
                  <div className="flex justify-between items-center mb-1">
                    <p className=" text-md  font-medium text-gray-900">
                      {chat.userB?.username ?? chat.userA?.username}
                    </p>

                    <p className="text-xs text-gray-400 font-light ml-5">
                      {formatRelativeTime(
                        chat.message[chat.message.length - 1]?.createdAt
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </>
    </div>
  )
}
