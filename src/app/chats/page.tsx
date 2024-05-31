import { MoreHorizontal, Search, SmilePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import Layoutpage from "@/components/Navbar/Layout";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
function Chat() {
  return (
    <Layoutpage showRightBar={false}>
      <div className="flex  flex-col tbb:flex-row min-h-screen tb:ml-[100px] md:ml-[130px] md:mr-10 -mt-5 border border-gray-200 fixed">
        <div className="md:w-[250px] lg:w-[300px] xl:w-[350px] border-r border-gray-200">
          {/* top left part*/}
          <div className="flex items-center justify-between px-3 py-4">
            <div className="font-semibold text-green-600 text-lg">
              dreamrose74
            </div>
            <div className="w-12 h-9 border-2 border-gray-100 rounded flex items-center justify-center text-gray-600">
              <Search />
            </div>
          </div>
          <div className="border-t bg-gray-500"></div>
          <div className="items-center justify-between px-3 py-2 hidden tbb:flex">
            <div className="font-semibold text-blue-500">Messages</div>
            <div className="text-sm text-purple-500">Requests</div>
          </div>

          {/* users */}
          <div className=" max-h-[500px] overflow-y-auto">
            <div className="flex flex-wrap tbb:flex-col">
              {/* 1 */}
              <div className="flex flex-col sm:flex-row items-center p-1 tbb:p-3 hover:bg-gray-50 bg-white border-none tbb:bg-gray-50 cursor-pointer tbb:border tbb:border-gray-200">
                <div className="flex-shrink-0 w-14 h-14 tbb:w-16 tbb:h-16 bg-white rounded-full overflow-hidden border-2 border-[#003C43]">
                  <Image
                    src="/Images/Ai.jpg"
                    alt="Profile"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <div className="ml-4 flex-grow hidden md:block">
                  <div className="text-sm font-semibold">Aqsa</div>
                  <div className="text-xs text-gray-500">Good night</div>
                </div>
                <div className="text-xs text-gray-500 hidden md:block">2m</div>
              </div>

              {/* 2 */}
              <div className="flex flex-col sm:flex-row items-center p-1 tbb:p-3 hover:bg-gray-50 bg-white border-none tbb:bg-gray-50 cursor-pointer tbb:border tbb:border-gray-200">
                <div className="flex-shrink-0 w-14 h-14 tbb:w-16 tbb:h-16 bg-white rounded-full overflow-hidden border-2 border-[#003C43]">
                  <Image
                    src="/Images/Ai.jpg"
                    alt="Profile"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <div className="ml-4 flex-grow hidden md:block">
                  <div className="text-sm font-semibold">Ali</div>
                  <div className="text-xs text-gray-500">Good night</div>
                </div>
                <div className="text-xs text-gray-500 hidden md:block">2m</div>
              </div>
            </div>
          </div>
        </div>

        {/* other user */}
        <main className="flex-grow flex flex-col mdc:w-[450px] mdd:w-[500px] mddd:w-[600px] lgg:w-[700px] lggg:w-[950px]">
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
          <div className="flex-grow p-4 max-h-[450px] overflow-y-auto"></div>

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
            <button className="ml-4 bg-gradient-to-r  bg-[#349E8D] hover:from-[#2EC7AB] hover:to-[#349E8D] text-white px-4 py-2 rounded-lg">
              Send
            </button>
          </footer>
        </main>
      </div>
    </Layoutpage>
  );
}
export default Chat;
