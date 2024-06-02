"use client";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../SearchBar";
import { trpc } from "@/server/trpc/client";
import { formatRelativeTime } from "@/lib/utils";

function ChatList() {
  const router = useRouter();

  const {
    data: chats,
    isLoading,
    isError,
  } = trpc.chatRouter.getChats.useQuery();

  return (
    <div className="w-[300px]  sbb:w-[340px] tb:w-[300px] tbbb:w-[400px] tbb:w-[290px] md:w-[260px] lg:w-[300px] xl:w-[350px]  border-r border-gray-200">
      {/* top left part*/}
      <div className="flex items-center justify-between px-3 py-4">
        <SearchBar />
      </div>
      <div className="border-t bg-gray-500"></div>

      <div className="flex items-center justify-between px-3 py-2">
        <div className="font-semibold text-blue-500">Messages</div>
      </div>

      {/* users */}
      <div className=" max-h-[500px] overflow-y-auto">
        {chats?.chats.map((chat) => {
          return (
            <div
              onClick={() => router.push(`/chats/${chat.id}`)}
              className="flex items-center p-1  tbb:p-3 hover:bg-gray-50 bg-white border-none tbb:bg-gray-50 cursor-pointer tbb:border tbb:border-gray-200"
            >
              <div className="flex-shrink-0 w-14 h-14 tbb:w-16 tbb:h-16 bg-white rounded-full overflow-hidden border-2 border-[#003C43]">
                <Image
                  src={chat.userB?.imageUrl ?? chat.userA?.imageUrl ?? ""}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </div>
              <div className="ml-4 flex-grow ">
                <div className="text-sm font-semibold">
                  {chat.userB?.username ?? chat.userA?.username}
                </div>
                <div className="text-xs text-gray-500">
                  {chat.message[chat.message.length - 1]?.text}
                </div>
              </div>
              <div className="text-xs text-gray-500 ">
                {formatRelativeTime(
                  chat.message[chat.message.length - 1]?.createdAt
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default ChatList;
