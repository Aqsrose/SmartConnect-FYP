"use client"
import Image from 'next/image'
import React from 'react'


const Avater = () => {
  return (
    <div className='flex items-center justify-between'>
        <div className='relative inline-block rounded-full overflow-hidden h-10 w-10 md:h-11
        md:w-11'>
            <Image src={'/user1.png'} alt={'Avater'}    fill />    </div>
    </div>
  )
}

export default Avater