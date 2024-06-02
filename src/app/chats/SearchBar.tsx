"use client";
import { trpc } from "@/server/trpc/client";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { User } from "../../../prisma/types";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

const SearchBar = () => {
  const [searchKey, setSearchKey] = useState<string>("");

  const {
    data: friends,
    refetch,
    isLoading,
    isError,
  } = trpc.profileRouter.fetchFriendsForChat.useQuery({ key: searchKey });
  const {
    mutate: createChat,
    isLoading: creatingChat,
    isError: errorCreatingChat,
  } = trpc.chatRouter.createChat.useMutation();
  console.log(friends);
  const router = useRouter();

  const [openDropDown, setOpenDropDown] = useState(false);

  const handleCreateChat = (user: User) => {
    console.log("working");
    createChat(
      { userId: user.id },
      {
        onSuccess: (response) => {
          if (response.success) {
            router.push(`/message/chat/${response.chat.id}`);
          }
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Server Error",
            description: "An error occurred creating a chat",
          });
        },
      }
    );
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search"
        className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        value={searchKey}
        onChange={(e) => {
          setSearchKey(e.currentTarget.value);
        }}
        onInput={() => setOpenDropDown(true)}
        onFocus={(e) => (e.target.value ? setOpenDropDown(true) : null)}
      />
      {openDropDown && (
        <div className="absolute bg-white w-[280px] z-50 top-10 -left-6 border-black border-solid border shadow-sm p-2 flex gap-2">
          {isLoading ? (
            <Loader2 className="animate-spin m-auto" />
          ) : friends && friends.users.length > 0 ? (
            friends.users.map((user) => (
              <div
                className="flex gap-4 items-center border-b border-[#00000033] p-2 w-full cursor-pointer hover:bg-slate-200 rounded-md"
                key={user.id}
                onClick={() => handleCreateChat(user as any)}
              >
                <img
                  src={user.imageUrl}
                  alt="user img"
                  className="object-cover rounded-full w-12 h-12"
                />
                <p>{user.username}</p>
              </div>
            ))
          ) : (
            <div className="m-auto text-center p-2 text-gray-500">
              No friends found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
