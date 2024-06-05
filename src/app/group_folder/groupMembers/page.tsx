"use client"

import { trpc } from "@/server/trpc/client"

interface GroupMemberProps {
  groupId: string
}

function GroupMembers({ groupId }: GroupMemberProps) {
  const {
    data: groupMembers,
    isLoading,
    isError,
  } = trpc.groupRouter.fetchGroupMembers.useQuery({ groupId })

  const {
    data: group,
    isLoading: fetchingGroup,
    isError: errorFetchingGroup,
  } = trpc.groupRouter.fetchGroupById.useQuery({ groupId })

  return (
    <div className="absolute top-2 left-4 border border-gray-100  w-[260px] sb:w-[300px] sbb:w-[350px] tb:w-[330px] tbbb:w-[350px] tbb:w-[500px] md:w-[520px] lgg:w-[400px] lggg:w-[500px]">
      {/* No of members */}
      <div className="flex">
        <div>
          <p className="p-2 font-semibold text-gray-500 ml-2">Members</p>
        </div>
      </div>

      <div className="border-t bg-gradient-to-r from-blue-500 to-purple-500 mb-3"></div>

      <div className="mb-6">
        {/*no of Admins */}
        <div className="flex  p-3">
          <p className=" text-gray-500">Group Admins</p>
          <div>
            <p className="pl-2 text-gray-400">1</p>
          </div>
        </div>

        {/*Admins */}
        <div className="grid gap-4">
          {/*1*/}
          {groupMembers?.groupMembersWithUserData.map((member) => {
            if (member.user.id === group?.group?.adminId) {
              return (
                <div className="flex items-center ml-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden ">
                    <img
                      src={member.user.imageUrl}
                      alt="Profile"
                      className=" w-16 h-16 object-cover bg-gray-200"
                    />
                  </div>
                  <div className="ml-5">
                    <p className=" text-xl  text-[#10676B]">
                      @{member.user.username}
                    </p>
                    <p className="text-green-300 font-semibold text-sm">
                      Admin
                    </p>
                  </div>
                </div>
              )
            }
            return null
          })}
        </div>
      </div>

      <div className="border-t bg-gray-500 mb-3"></div>

      {/*Members*/}
      <div>
        <p className=" text-gray-500 ml-3 ">Members</p>
        <div className="grid gap-5 mt-3">
          {groupMembers?.groupMembersWithUserData.map((member) => {
            return (
              <div className="flex items-center ml-5 relative">
                <div className="w-16 h-16 rounded-full overflow-hidden ">
                  <img
                    src={member.user.imageUrl}
                    alt="Profile"
                    className=" w-16 h-16 object-cover bg-gray-200"
                  />
                </div>
                <div className="ml-5">
                  <p className=" text-xl  text-[#10676B]">{member.user.fullname}</p>
                  <p className="text-gray-300 font-semibold text-sm">
                    @{member.user.username}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default GroupMembers
