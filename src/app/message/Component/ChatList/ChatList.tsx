"use client"
import React from 'react'
import ChatListHeader from './ChatListHeader'
import SearchBar from './SearchBar'
import List from './List'
import ChatListItems from './ChatListItems'
import { trpc } from '@/server/trpc/client'

export const ChatList = () => {

  const{data: chats, isLoading, isError} = trpc.chatRouter.getChats.useQuery()
  console.log("chats: ", chats)
  return (
    <div className='bg-white flex flex-col max-h-screen z-20  '>
      <>
        <ChatListHeader/>
        <SearchBar/>
        <ChatListItems chats={chats} />
        </>
    </div>
  )
}
