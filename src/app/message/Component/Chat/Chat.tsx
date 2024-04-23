"use client"
import React from 'react'

import ChatContainer from './ChatContainer'
import ChatHeader from './ChatHeader'
import MessageBar from './MessageBar'
import { useState } from 'react'


const Chat = () => {

  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = (message: string) => {
    setMessages([...messages, message]);
  };

  return (
    <div className='border-black border-1  w-full bg-white flex flex-col h-[100vh] z-10'>
        <ChatHeader/>
        <ChatContainer messages={messages}/>
       
        <MessageBar addMessage={addMessage}/>
    </div>
  )
}

export default Chat