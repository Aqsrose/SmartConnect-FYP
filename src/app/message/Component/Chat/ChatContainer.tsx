"use client";

import { useState } from "react";


interface ChatContainerProps {
  messages: string[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  
  return (
    <div className=" h-full w-full relative flex-grow overflow-auto custom-scrollbar bg-pink-1000 ">
      <div className="  bg-fixed h-full w-full opacity-100 left-0 top-0 z-0 ">
        <div className="mx-10 my-6 relative  bottom-0 z-40 left-0">
          <div className="flex w-full">
            <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
              {messages?.map((msg, index) => (
                <div className="flex">
                  <div
                    key={index}
                    className="text-white bg-outgoing-background bg-[#005c4b] px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%]"
                  >
                    <p>{msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ChatContainer;
