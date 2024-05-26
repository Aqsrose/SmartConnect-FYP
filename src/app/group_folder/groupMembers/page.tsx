"use client"

import { trpc } from "@/server/trpc/client"

interface GroupMemberProps {
  groupId: string
}

function GroupMembers({ groupId }: GroupMemberProps) {


  return (
    <div className="absolute top-2 left-4 ">
      <div className="relative  border border-gray-100 rounded-sm h-[120px] tbb:h-[80px] w-[260px] sb:w-[300px] sbb:w-[350px] tb:w-[330px]  tbbb:w-[350px] tbb:w-[500px] md:w-[520px] lgg:w-[400px] lggg:w-[500px]  mb-3 bg-white">
        <div className="w-9 h-9 rounded-full overflow-hidden absolute top-5 left-2">
          <img
            src="/images/Ai.jpg"
            alt="Profile"
            className="object-cover bg-gray-200 "
          />
        </div>

        <p className="text-lg  text-[#10676B] absolute top-3 left-12">Aqsa</p>
        <p className="text-gray-300 absolute top-10 left-12 ">Aqsa Aqsa</p>

        <div className="flex space-x-36 mt-[70px]">
          <div>
            {" "}
            <button className="bg-gradient-to-r  from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white h-10 ml-32 sb:ml-40 sbb:ml-[200px] w-32 rounded transition duration-200  absolute  tbb:right-6 tbb:top-7">
              Member
            </button>
          </div>
        </div>
        <button className="text-sm text-[#409ea3] absolute top-2 right-2 ">
          x
        </button>
      </div>
    </div>
  )
}
export default GroupMembers
