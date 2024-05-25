"use client"
import { trpc } from "@/server/trpc/client"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import React, { useState } from "react"
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi"

const ContactList = () => {
  const [searchKey, setSearchKey] = useState<string>("")
  const [openDropDown, setOpenDropDown] = useState(false)

  const {
    data: friends,
    refetch,
    isLoading,
    isError,
  } = trpc.profileRouter.fetchFriendsForChat.useQuery(
    { key: searchKey },
    { enabled: searchKey !== "" }
  )

  console.log("value: ", searchKey)

  return (
    <div className="h-full flex flex-col bg-panel-header-background">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center  gap-12 text-white">
          <Link href={"/message"}>
            <BiArrowBack className="cursor-pointer text-xl" />
          </Link>
          <span>New Chat</span>
        </div>
      </div>

      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Contacts"
                className=" text-sm focus:outline-none w-full text-black"
                value={searchKey}
                onChange={(e) => {
                  setSearchKey(e.currentTarget.value)
                }}
                onInput={() => setOpenDropDown(true)}
              />
              {openDropDown && <div>This will be the dropdown</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactList
