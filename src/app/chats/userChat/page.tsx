import React from "react";
import Image from "next/image";
import { MoreHorizontal, SmilePlus } from "lucide-react";
import MessagesPage from "../messages/page";

function UserChatPage() {
  const messages = [
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

  return (
    <main className="flex-grow hidden tbb:flex flex-col tbb:w-[350px] mdc:w-[450px] mdd:w-[500px] mddd:w-[600px] lgg:w-[700px] lggg:w-[950px] ">
      <header className="flex items-center justify-between bg-white border-b border-gray-200 ">
        <div className="flex flex-grow items-center border border-gray-100 p-4 relative">
          <div className="flex-shrink-0 w-10 h-10 md:w-16 md:h-16 bg-white rounded-full overflow-hidden border-2 border-[#003C43]">
            <Image
              src="/Images/Ai.jpg"
              alt="Profile"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold">Muhammad Ali</div>
            <div className="text-xs text-green-500">Active now</div>
          </div>
          <div className="flex absolute right-3  ">
            <MoreHorizontal size={20} />
            {/* <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreHorizontal size={20} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40 shadow-lg mr-32">
                    <DropdownMenuItem className="flex gap-2 items-center cursor-pointer p-2">
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <button className="text-sm font-medium">
                        Delete Chat
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
          </div>
        </div>
      </header>

      {/* Messages part */}
      <div className="flex-grow p-4  tb:max-h-[450px] overflow-y-auto">
        <MessagesPage messages={messages} />
      </div>

      {/* footer */}
      <footer className="p-4 bg-white border-t border-gray-200 flex items-center sticky bottom-0">
        <button className="mr-4">
          <SmilePlus />
        </button>
        <input
          type="text"
          placeholder="Type a message"
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button className="ml-4 bg-gradient-to-r from-[#349E8D] to-[#2EC7AB] hover:from-[#2EC7AB] hover:to-[#349E8D] text-white px-4 py-2 rounded-lg">
          Send
        </button>
      </footer>
    </main>
  );
}
export default UserChatPage;
