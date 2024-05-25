"use client"
import React from "react"

import clsx from "clsx"

import Avater from "../Avater"

interface ChatListProps {
  chats: any
}

const ConversationBox: React.FC<ChatListProps> = ({ chats }) => {
  return (
    <>
      {chats.map((chat) => {
        return (
          <div className="w-full relative flex items-center space-x-3 p-3 hover:bg-neutral-100rounded-lg transition cursor-pointer border bg-white">
            <Avater url={chat.user.imageUrl}/>
            <div className="min-w-0 flex-1 ">
              <div className=" focus:outline-none">
                <div className="flex justify-between items-center mb-1">
                  <p className=" text-md  font-medium text-gray-900"> Demo</p>

                  <p className="text-xs text-gray-400 font-light ml-5">
                    {/* {format(new Date(lastMessage.createdAt),'p')} */}
                    11:03
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default ConversationBox
