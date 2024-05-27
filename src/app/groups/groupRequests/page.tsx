interface GroupRequestsProps {
  groupId: string;
}

function GroupRequestsPage({ groupId }: GroupRequestsProps) {
  return (
    <div className="absolute top-2 left-4 border border-gray-100  w-[260px] sb:w-[300px] sbb:w-[350px] tb:w-[330px] tbbb:w-[350px] tbb:w-[500px] md:w-[520px] lgg:w-[400px] lggg:w-[500px]">
      {/* No of requests */}
      <div className="flex">
        <div>
          <p className="p-2 font-semibold text-gray-500 ml-2">Requests</p>
        </div>
        <div>
          <p className="p-2 text-gray-400"> 0</p>
        </div>
      </div>

      {/*requests*/}
      <div>
        {/*1*/}
        <div className="grid gap-4 mt-3">
          <div className="flex items-center ml-5 relative ">
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
              <button className="text-sm px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">
                Accept
              </button>
            </div>
          </div>
        </div>

        {/*2*/}
        <div className="grid gap-4 mt-3">
          <div className="flex items-center ml-5 relative ">
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
              <button className="text-sm px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupRequestsPage;
