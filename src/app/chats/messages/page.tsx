"use client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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

const dummyMessages = [
  {
    chatId: "1",
    id: "1",
    from: "user1",
    to: "user2",
    text: "Hello!testing testing testing",
    createdAt: new Date().toISOString(),
  },
  {
    chatId: "1",
    id: "2",
    from: "user2",
    to: "user1",
    text: "Hi there!",
    createdAt: new Date().toISOString(),
  },
];

const MessagesPage: React.FC<ChatContainerProps> = ({ messages }) => {
  const user = { id: "user1" }; // Dummy user data
  const [messagesOptimistic, setMessagesOptimistic] = useState(
    messages || dummyMessages
  );

  useEffect(() => {
    setMessagesOptimistic(messages || dummyMessages);
  }, [messages]);

  return (
    <div className=" h-full w-full relative flex-grow overflow-auto custom-scrollbar bg-pink-1000 ">
      <div className=" bg-fixed h-full w-full opacity-100 left-0 top-0 z-0 ">
        <div className="mx-10 my-6 relative  bottom-0 z-40 left-0">
          <div className="flex w-full">
            <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
              <div className="flex flex-col gap-2 overflow-auto">
                {messagesOptimistic &&
                  messagesOptimistic.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "text-white bg-[#435585] px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] w-fit",
                        {
                          "ml-auto bg-[#116D6E] text-white":
                            message.from === user.id,
                        }
                      )}
                    >
                      <p>{message.text}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
