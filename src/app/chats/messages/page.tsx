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
    <div className="flex flex-col gap-2 p-2 max-w-full">
      {messagesOptimistic &&
        messagesOptimistic.map((message) => (
          <div
            key={message.id}
            style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
            className={cn(
              "text-white bg-[#435585] px-2 py-1 text-md rounded-md flex gap-2 max-w-[50%]",
              {
                "ml-auto bg-[#116D6E] px-2 py-1 text-md rounded-md flex gap-2 text-white max-w-[50%]":
                  message.from === user?.id,
              }
            )}
          >
            <p style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
              {message.text}
            </p>
          </div>
        ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessagesPage;
