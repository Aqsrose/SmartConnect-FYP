"use client"
import { useState } from "react"
import CreateEventModal from "@/components/Events/createEventModal";
import Modal from "@/components/Modal"
import GroupsEventsPart from "@/components/Events/groupsEvents";

function GroupEvents() {
    const [showModal, setShowModal] = useState<boolean>(false)
  return (
    <div className="flex flex-col items-center justify-center -ml-2 absolute top-2 left-4   mb-[900px]  lggg:w-[550px]">
      <div className=" relative w-[270px] sb:w-[310px] sbb:w-[350px] tb:w-[300px] tbbb:w-[380px] tbb:w-[550px] md:w-[550px]  lg:w-[600px] mddd:w-[560px] lgg:lg:w-[460px] lggg:w-[490px] max-w-2xl bg-white rounded-lg shadow p-2 ">
        <div className="flex h-[100px] ">
          <div className="absolute top-4 left-2 text-green-700 text-lg font-semibold">
           <h4>Create an event to share exciting moments</h4>
          </div>
          <div className="absolute bottom-1 right-4"> <button
            className="font-bold  bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-sm  border text-white py-3 px-3  rounded"
            type="button"
            onClick={() => setShowModal((prev) => !prev)}
          >
            + Create new Event 
          </button></div>
        </div>
      </div>
      {showModal && (
        <Modal isOpen={showModal} close={() => setShowModal(false)}>
          <CreateEventModal close={() => setShowModal(false)}/>
        </Modal>
      )}
      {/* <div className=" w-full">
        <GroupsEventsPart/>
      </div> */}
    </div>
  );
}
export default GroupEvents;
