"use client"
import { useState } from "react"
import CreateGroupModal from "./CreateGroupModal"
import JoinGroup from "./JoinGroups"
import { Plus } from "lucide-react"
import { trpc } from "@/server/trpc/client"
import MyGroups from "./MyGroups"
function CreateGroup() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false)

  const { data } = trpc.groupRouter.fetchGroups.useQuery()
  console.log("foo: ", data)

  return (
    <div className=" items-center justify-center mdd:-ml-[200px] ">
      <div className="tbbb:relative md:flex tbb:flex tb:flex shadow-sm  md:w-[550px] lggg:w-[900px] ml-2 mr-2 tb:ml-28 tb:h-36 tb:pr-2 tbbb:h-24 tbb:ml-28 tbb:h-24 tbb:pr-2 md:ml-[170px] mdd:ml-[400px] xl:ml-[400px] space-x-4 border border-gray-100 rounded-lg pt-3 pl-8">
        <Plus className="mt-4 text-green-300 tb:mt-9 tb:-ml-3 tbb:mt-6 tbbb:mt-6" />
        <div className="pl-2 tb:pl-0">
          <p className="text-lg  text-[#10676B] -mt-7 ml-3 tb:mt-2 tb:ml-0 ">
            Create new Group
          </p>
          <p className="text-gray-300 ml-3 md:mr-20 tb:ml-0 tbbb:pr-9 tbb:mr-32 ">
            create public or private group
          </p>
        </div>
        <div className="m-3 tb:mt-7 tbb:mt-3 tbbb:mt-3">
          <button
            className="tbbb:absolute tbbb:top-5 tbbb:right-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded flex items-center transition duration-200 mt-2 "
            onClick={() => setModalOpen(true)}
          >
            Create 
          </button>
        </div>
      </div>
      <MyGroups/>
   
      <section className="bg-white p-4 rounded-lg shadow mb-6 tb:ml-[110px] md:ml-[170px] mdd:ml-[400px] md:w-[550px]  lggg:w-[900px] mt-2">
      <h2 className="text-1xl font-semibold text-green-500 mb-4 ">Recommended Groups</h2>
      {isModalOpen && <CreateGroupModal onClose={() => setModalOpen(false)} />}
      <div className="  ">
        {data?.notJoined.map((group, index) => (
          <JoinGroup
            key={index}
            id={group.id}
            name={group.name}
            description={group.description}
            isPublic={group.isPublic}
          />
        ))}
      </div>
      
      </section>
    </div>
    
  )
}

export default CreateGroup
