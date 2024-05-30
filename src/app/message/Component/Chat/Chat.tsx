"use client"
import React from "react"

import ChatContainer from "./ChatContainer"
import ChatHeader from "./ChatHeader"
import MessageBar from "./MessageBar"
import { useState } from "react"
import { trpc } from "@/server/trpc/client"
import { useUser } from "@clerk/nextjs"

interface ChatProps {
  chatId: string
}

const Chat = ({ chatId }: ChatProps) => {
  const { user } = useUser()

  const { data } = trpc.chatRouter.getMessages.useQuery({ chatId })
  console.log("chatId: ", chatId)
  console.log("messages: ", data)

  return (
    <div className="border-black border-1  w-full bg-white flex flex-col h-[100vh] z-10">
      <ChatHeader />
      <ChatContainer messages={data?.messages} />
      <MessageBar chatId={chatId} />
    </div>
  )
}

export default Chat
