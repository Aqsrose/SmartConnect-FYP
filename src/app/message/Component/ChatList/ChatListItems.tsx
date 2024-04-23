"use client"
import React, { useCallback, useMemo } from "react"

import clsx from "clsx"

import Avater from "../Avater"

interface ConversationBoxProps {
  selected?: boolean
  data: any
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  return (
    <div
      className={clsx(
        `
    
      w-full 
      relative 
      flex 
      items-center 
      space-x-3 
      p-3 
      hover:bg-neutral-100
      rounded-lg    
      transition
      cursor-pointer
      border
      `,
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      <Avater />
      <div className="min-w-0 flex-1 ">
        <div className=" focus:outline-none">
          <div
            className="
      flex
      justify-between
      items-center
      mb-1
      "
          >
            <p className=" text-md  font-medium text-gray-900"> Demo</p>

            <p className="text-xs text-gray-400 font-light ml-5">
              {/* {format(new Date(lastMessage.createdAt),'p')} */}
              11:03
            </p>

            {/* <p 
            // className={clsx(`
            //   truncate 
            //   text-sm
            //   `,
            //   hasSeen ? 'text-gray-500' : 'text-black font-medium'
            // )}
            >
              {lastMessageText}
            </p> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConversationBox
