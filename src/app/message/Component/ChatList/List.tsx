import React from 'react'

interface ChatListProps {
  chats: any
}

const List = ({chats}: ChatListProps) => {
  console.log("Chats inside list componenet: ", chats)
  return (
    <div className='bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar xs:hidden'></div>
  )
}

export default List