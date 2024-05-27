interface GroupMemberProps {
  groupId: string;
}

function GroupMembers({ groupId }: GroupMemberProps) {
  return (
    <div className="absolute top-2 left-4 border border-gray-100  w-[260px] sb:w-[300px] sbb:w-[350px] tb:w-[330px] tbbb:w-[350px] tbb:w-[500px] md:w-[520px] lgg:w-[400px] lggg:w-[500px]">
      {/* No of members */}
      <div className="flex">
        <div>
          <p className="p-2 font-semibold text-gray-500 ml-2">Members</p>
        </div>
        <div>
          <p className="p-2 text-gray-400"> 0</p>
        </div>
      </div>

      <div className="border-t bg-gradient-to-r from-blue-500 to-purple-500 mb-3"></div>

      <div className="mb-6">
        {/*no of Admins */}
        <div className="flex  p-3">
          <p className=" text-gray-500">Group Admins</p>
          <div>
            <p className="pl-2 text-gray-400"> 0</p>
          </div>
        </div>

        {/*Admins */}
        <div className="grid gap-4">
          {/*1*/}
          <div className="flex items-center ml-5">
            <div className="w-16 h-16 rounded-full overflow-hidden ">
              <img
                src="/images/Ai.jpg"
                alt="Profile"
                className=" w-16 h-16 object-cover bg-gray-200"
              />
            </div>
            <div className="ml-5">
              <p className=" text-xl  text-[#10676B]">Ali Backend Developer</p>
              <p className="text-green-300 font-semibold text-sm">Admin</p>
            </div>
          </div>

          {/*2*/}
          <div className="flex items-center ml-5">
            <div className="w-16 h-16 rounded-full overflow-hidden ">
              <img
                src="/images/Ai.jpg"
                alt="Profile"
                className=" w-16 h-16 object-cover bg-gray-200"
              />
            </div>
            <div className="ml-5">
              <p className=" text-xl  text-[#10676B]">
                Aqsa Frontend Developer
              </p>
              <p className="text-green-300 font-semibold text-sm">Admin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t bg-gray-500 mb-3"></div>

      {/*Members*/}
      <div>
        <p className=" text-gray-500 ml-3 ">Members</p>
        <div className="grid gap-5 mt-3">
          {/*1*/}
          <div className="flex items-center ml-5 relative">
            <div className="w-16 h-16 rounded-full overflow-hidden ">
              <img
                src="/images/Ai.jpg"
                alt="Profile"
                className=" w-16 h-16 object-cover bg-gray-200"
              />
            </div>
            <div className="ml-5">
              <p className=" text-xl  text-[#10676B]">Dani Dani</p>
              <p className="text-gray-300 font-semibold text-sm">@dani1234</p>
            </div>
            <div className="sb:ml-3 sbb:absolute sbb:top-5 sbb:right-8">
              <button className="text-sm px-3 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors">
                Remove
              </button>
            </div>
          </div>

          {/*2*/}
          <div className="flex items-center ml-5 relative">
            <div className="w-16 h-16 rounded-full overflow-hidden ">
              <img
                src="/images/Ai.jpg"
                alt="Profile"
                className=" w-16 h-16 object-cover bg-gray-200"
              />
            </div>
            <div className="ml-5">
              <p className=" text-xl  text-[#10676B]">Dani Dani</p>
              <p className="text-gray-300 font-semibold text-sm">@dani1234</p>
            </div>
            <div className="sb:ml-3 sbb:absolute sbb:top-5 sbb:right-8">
              <button className="text-sm px-3 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupMembers;
