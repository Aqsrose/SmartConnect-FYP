import Link from "next/link"

type GroupProps = {
  id:string,
  name: string,
  description:string,
  isPublic:boolean,
}

function JoinGroup({id, name, description, isPublic }: GroupProps) {
  console.log("id: ", id)
  return (
    
    <div className="relative space-x-4 border border-gray-100 rounded-sm h-[120px] tbb:h-[80px] tbbb:w-[350px] tbb:w-[500px] md:w-[520px] lggg:w-[870px]  mb-3 bg-white">
        <div className="w-9 h-9 rounded-full overflow-hidden absolute top-2 left-2">
          <img
            src="/images/Ai.jpg"
            alt="Profile"
            className="object-cover bg-gray-200 "
          />
        </div>
       
          <p className="text-lg  text-[#10676B] absolute top-3 left-12">
            {name}
          </p>
          <p className="text-gray-300 absolute top-10 left-12 ">
            {description}
          </p>
 
        <div className="flex space-x-36 mt-[70px]">
          <div> <button className="bg-gradient-to-r  from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white h-10 w-32 rounded transition duration-200  absolute  tbb:right-6 tbb:top-7">
            Join Group
          </button></div>
          <div>
          {isPublic && (
            <Link href={`/groups/${id}`}>
              <button className=" text-white rounded bg-gradient-to-r bg-[#2EC7AB] hover:from-[#2EC7AB] hover:to-[#3dd3ba] h-10 w-20 transition duration-200 absolute tbb:right-[180px] tbb:top-7">
                View
              </button>
            </Link>
          )}</div>
        </div>
        <button className='text-sm text-[#409ea3] absolute top-2 right-2 '>x</button>
      </div>
     
  

  )
}

export default JoinGroup
