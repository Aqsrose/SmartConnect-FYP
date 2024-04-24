import Image from 'next/image'
import React from 'react'

const Empty = () => {
  return (
    <div className=' border-l  w-full bg-white flex flex-col h-[100vh] border-b-4 border-b-blue-950 items-center justify-center'>
      <Image src="/logo.png " alt="smartconnect"  height={300} width={300}
        
      /></div>
  )
}

export default Empty