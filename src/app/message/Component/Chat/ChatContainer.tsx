"use client"

import { cn } from "@/lib/utils"
import { trpc } from "@/server/trpc/client"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

interface ChatContainerProps {
  messages: messages
}

type messages =
  | {
      chatId: string
      id: string
      from: string
      to: string
      text: string
      createdAt: string
    }[]
  | undefined

type message = {
  chatId: string
  id: string
  from: string
  to: string
  text: string
  createdAt: string
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  const { user } = useUser()

  const [messagesOptimistic, setMessagesOptimistic] = useState(messages)

  useEffect(() => {
    setMessagesOptimistic(messages)
  }, [messages])

  trpc.chatRouter.onMessageCreated.useSubscription(
    { senderId: user?.id! },
    {
      onData: (data) => {
        console.log("message received through socket: ", data)
        setMessagesOptimistic((prev) => {
          return [
            ...prev,
            {
              chatId: data.chatId,
              id: data.id,
              from: data.from,
              to: data.to,
              text: data.text,
              createdAt: data.createdAt,
            },
          ]
        })
      },
      onError: (error) => {
        console.log("error on receiving message through socket: ", error)
      },
    }
  )

  return (
    <div className=" h-full w-full relative flex-grow overflow-auto custom-scrollbar bg-pink-1000 ">
      <div className="  bg-fixed h-full w-full opacity-100 left-0 top-0 z-0 ">
        <div className="mx-10 my-6 relative  bottom-0 z-40 left-0">
          <div className="flex w-full">
            <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
              <div className="flex flex-col gap-2 overflow-auto">
                {messagesOptimistic &&
                  messagesOptimistic.map((message, index) => {
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "text-white bg-[#005c4b] px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] w-fit",
                          {
                            "ml-auto bg-blue-400 text-white":
                              message.from === user?.id,
                          }
                        )}
                      >
                        <p>{message.text}</p>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatContainer
