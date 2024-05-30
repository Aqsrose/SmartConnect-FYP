"use client"
import Image from "next/image"
import React from "react"

interface AvatarProps {
  url: string
}

const Avatar = ({ url }: AvatarProps) => {
  return (
    <div className="flex items-center justify-between">
      <div
        className="relative inline-block rounded-full overflow-hidden h-10 w-10 md:h-11
        md:w-11"
      >
        <Image src={url} alt={"Avatar"} fill className="object-cover" />
      </div>
    </div>
  )
}

export default Avatar
