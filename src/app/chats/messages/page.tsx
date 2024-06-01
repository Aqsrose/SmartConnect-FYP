"use client";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";

interface ChatContainerProps {
  messages: messages;
}

type messages =
  | {
      chatId: string;
      id: string;
      from: string;
      to: string;
      text: string;
      createdAt: string;
    }[]
  | undefined;

const MessagesPage: React.FC<ChatContainerProps> = ({ messages }) => {
  const { user } = useUser();

  const [messagesOptimistic, setMessagesOptimistic] = useState(messages);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessagesOptimistic(messages);
  }, [messages]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messagesOptimistic]);

  trpc.chatRouter.onMessageCreated.useSubscription(
    { senderId: user?.id! },
    {
      onData: (data) => {
        console.log("message received through socket: ", data);
        setMessagesOptimistic((prev) => {
          return [
            // @ts-expect-error
            ...prev,
            {
              // @ts-ignore
              chatId: data.chatId,
              // @ts-ignore
              id: data.id,
              // @ts-ignore
              from: data.from,
              // @ts-ignore
              to: data.to,
              // @ts-ignore
              text: data.text,
              // @ts-ignore
              createdAt: data.createdAt,
            },
          ];
        });
      },
      onError: (error) => {
        console.log("error on receiving message through socket: ", error);
      },
    }
  );

  return (
    <div className=" h-full w-full relative flex-grow overflow-auto custom-scrollbar bg-pink-1000 mb-2">
      <div className=" bg-fixed h-full w-full opacity-100 left-0 top-0 z-0 ">
        <div className="mx-10 my-6 relative  bottom-0 -z-40 left-0">
          <div className="flex w-full">
            <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
              <div className="flex flex-col gap-2 overflow-auto border  border-black">
                {messagesOptimistic &&
                  messagesOptimistic.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "text-white bg-[#435585] px-2 py-[5px] text-md rounded-md flex gap-2 items-end max-w-screen-sb  break-words whitespace-pre-wrap",
                        {
                          "ml-auto bg-[#116D6E] text-white":
                            message.from === user?.id,
                        }
                      )}
                    >
                      <p className="break-words whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>
                  ))}
                <div ref={endOfMessagesRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
