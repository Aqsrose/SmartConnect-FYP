"use client"
import { trpc } from "@/server/trpc/client"
import { Loader2 } from "lucide-react"
import React, { useState } from "react"
import { BiSearchAlt, BiSearchAlt2 } from "react-icons/bi"
import { BsFilter } from "react-icons/bs"
import { User } from "../../../../../prisma/types"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

const SearchBar = () => {
  const [searchKey, setSearchKey] = useState<string>("")

  const {
    data: friends,
    refetch,
    isLoading,
    isError,
  } = trpc.profileRouter.fetchFriendsForChat.useQuery({ key: searchKey })
  const {
    mutate: createChat,
    isLoading: creatingChat,
    isError: errorCreatingChat,
  } = trpc.chatRouter.createChat.useMutation()

  console.log("value: ", searchKey)
  console.log("data: ", friends)

  const router = useRouter()

  const [openDropDown, setOpenDropDown] = useState(false)

  const handleCreateChat = (user: User) => {
    createChat(
      { userId: user.id },
      {
        onSuccess: (response) => {
          if (response.success) {
            router.push(`/message/chat/${response.chat.id}`)
          }
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Server Error",
            description: "An error occurred creating a chat",
          })
        },
      }
    )
  }

  return (
    <div className="bg-white flex py-3 pl-5 items-center gap-3 h-14 ">
      <div
        className="bg-panel--icon flex items-center gap-5 px-3 py-1 rounded-lg flex-grow border 
      "
      >
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l " />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start a new chat....."
            className="bg-transparent  text-sm focus:outline-none w-full"
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.currentTarget.value)
            }}
            onInput={() => setOpenDropDown(true)}
            onBlur={() => setOpenDropDown(false)}
            onFocus={(e) => (e.target.value ? setOpenDropDown(true) : null)}
          />
          {openDropDown && (
            <div className="absolute bg-white w-[341px] z-50 top-8 -left-12 border-black border-solid border shadow-sm p-2 flex gap-2">
              {isLoading ? (
                <Loader2 className="animate-spin m-auto" />
              ) : (
                friends?.users.map((user) => (
                  <div
                    className="flex gap-4 items-center border-b border-[#00000033] p-2 w-full cursor-pointer hover:bg-slate-200 rounded-md"
                    key={user.id}
                    onClick={() => handleCreateChat(user as any)}
                  >
                    <img
                      src={user.imageUrl}
                      alt="user img"
                      className="object-cover rounded-full w-12"
                    />
                    <p>{user.username}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchBar
