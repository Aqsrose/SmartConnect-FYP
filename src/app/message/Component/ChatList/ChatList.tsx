import React from 'react'
import ChatListHeader from './ChatListHeader'
import SearchBar from './SearchBar'
import List from './List'
import ChatListItems from './ChatListItems'

export const ChatList = () => {
  return (
    <div className='bg-white flex flex-col max-h-screen z-20  '>
      <>
        <ChatListHeader/>
        <SearchBar/>
        <List/>
        <ChatListItems data={undefined} />
        </>
    </div>
  )
}
