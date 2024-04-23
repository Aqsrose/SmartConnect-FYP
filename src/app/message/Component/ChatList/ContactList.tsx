"use client"
import { trpc } from "@/server/trpc/client"
import React, { useState } from "react"
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi"

const ContactList = () => {
  const [searchKey, setSearchKey] = useState<string>("")

  const {
    data: friends,
    refetch,
    isLoading,
    isError,
  } = trpc.profileRouter.fetchFriendsForChat.useQuery({ key: searchKey })

  console.log("value: ", searchKey)
  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center  gap-12 text-white">
          <BiArrowBack className="cursor-pointer text-xl" />
          <span>New Chat</span>
        </div>
      </div>
      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar"></div>
      <div className="bg- flex items-center gap-5 px-3 py-1 rounded-lg flex-grow ">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
        </div>
        <div>
          <input
            type="text"
            placeholder="Search or start a new chat....."
            className="bg-transparent text-sm focus:outline-none w-full bg-input-background"
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.currentTarget.value)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ContactList
