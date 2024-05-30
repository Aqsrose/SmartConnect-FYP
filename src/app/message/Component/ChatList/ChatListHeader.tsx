import React from "react"
import Avatar from "../Avatar"
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs"
import ContactList from "./ContactList"
import Link from "next/link"

const ChatListHeader = () => {
  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar url=""/>{" "}
      </div>
      <div className=" flex gap-6">
        <Link href={"/message/ContactList"}>
          <BsFillChatLeftTextFill
            className="text-panel-header-icon cursor-pointer text-xl"
            title="New Chat"
          />
        </Link>
      </div>
    </div>
  )
}

export default ChatListHeader
