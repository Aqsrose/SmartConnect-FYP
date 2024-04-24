"use client"
import { trpc } from "@/server/trpc/client"
import React, { useState } from "react"
import { BiSearchAlt, BiSearchAlt2 } from "react-icons/bi"
import { BsFilter } from "react-icons/bs"

const SearchBar = () => {
  const [searchKey, setSearchKey] = useState<string>("")

  const {
    data: friends,
    refetch,
    isLoading,
    isError,
  } = trpc.profileRouter.fetchFriendsForChat.useQuery({ key: searchKey })

  console.log("value: ", searchKey)
  console.log("data: ", friends)
  return (
    <div className="bg-white flex py-3 pl-5 items-center gap-3 h-14 ">
      <div
        className="bg-panel--icon flex items-center gap-5 px-3 py-1 rounded-lg flex-grow border 
      "
      >
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l " />
        </div>
        <div>
          <input
            type="text"
            placeholder="Search or start a new chat....."
            className="bg-transparent  text-sm focus:outline-none w-full"
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

export default SearchBar
