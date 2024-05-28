"use client"
import { useState } from "react"
import CreateEventModal from "./createEventModal";
import Modal from "@/components/Modal"
import MyEventsPage from "./myEvents";


function CreateEventpage () {
    const [showModal, setShowModal] = useState<boolean>(false)
  return (
    <div className="w-[270px] sb:w-[300px] sbb:w-[350px] tb:ml-[100px] tb:w-[370px] tbbb:ml-[120px] tbbb:w-[470px] tbb:ml-[150px] tbb:w-[500px] md:ml-[170px]  md:w-[500px] sb:ml-3 sbb:ml-3 mdd:ml-[240px] mdc:ml-[120px] mdc:w-[580px] mdd:w-[650px] mddd:w-[600px] lgg:w-[650px]  mddd:ml-[120px] lgg:ml-[200px] lggg:ml-[320px]  mb-10">
      <div className=" text-white -mt-5 relative  tb:w-[370px] tbbb:w-[470px]  tbb:w-[500px] md:w-[500px] mdc:w-[580px] mdd:w-[650px] mddd:w-[600px] lgg:w-[650px] h-[120px] tb:h-[140px] ">
        
          <button
            className="font-bold   hover:from-[#8ED1DB] hover:to-[#4D3BE6] md:absolute md:top-2 md:left-[30px] mt-8 ml-[50px] sb:ml-[70px] sbb:ml-[90px] tb:ml-[100px]  tbbb:ml-[150px]  tbb:ml-[170px]  tb:text-[15px] sb:text-sm  border-2 border-[#8ED1DB] text-white py-3 px-3 tb:py-5 tb:px-5 rounded"style={{ backgroundImage: 'linear-gradient(to right, #4D3BE6, #6F8AE1, #8ED1DB)' }}
            type="button"
            onClick={() => setShowModal((prev) => !prev)}
          >
            + Create new Event 
          </button>
          <div className="border-t absolute bottom-3 bg-gradient-to-r from-blue-500 to-purple-500  my-4 w-[270px] sbb:w-[350px]  tb:w-[370px] tbbb:w-[470px]  tbb:w-[500px] md:w-[500px] mdc:w-[580px]  mdd:w-[650px] mddd:w-[600px] lgg:w-[650px]"></div>
      </div>
      {showModal && (
        <Modal isOpen={showModal} close={() => setShowModal(false)}>
          <CreateEventModal close={() => setShowModal(false)}/>
        </Modal>
      )}
       
     
    </div>
  );
};

export default CreateEventpage;
