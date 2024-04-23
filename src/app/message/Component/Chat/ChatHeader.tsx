import React, { useState } from 'react';
import Avater from '../Avater';


const ChatHeader = () => {
 
  
 

  return (
    <div className='h-16 px-4 py-3  flex justify-between items-center  z-10'>
      <div className=' flex items-center justify-center gap-6'>
        <Avater />
        <div className=' flex flex-col'>
          <span className='text-black font-semibold'>Demo</span>
          <span className=' text-black text-sm'>online</span>
        </div>
      </div>
      
        
      </div>
    
  );
};

export default ChatHeader;
