import React from 'react'
import Avater from '../Avater'
import {BsFillChatLeftTextFill,BsThreeDotsVertical} from 'react-icons/bs'
import ContactList from './ContactList'
import Link from 'next/link'

const ChatListHeader = () => {
  return (
    <div className='h-16 px-4 py-3 flex justify-between items-center'>
        <div className='cursor-pointer'>
            <Avater/> </div>
            <div className=' flex gap-6'>
              <Link href={'/message/ContactList'}>
                <BsFillChatLeftTextFill  
                className="text-panel-header-icon cursor-pointer text-xl" title='New Chat'
                
                />
                </Link>
              
        
           
        </div>
    </div>
  )
}

export default ChatListHeader