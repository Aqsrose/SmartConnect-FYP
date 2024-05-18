"use client"
import Modal from "@/components/Modal"
import CreateNFTForm from "@/components/marketpalce/CreateNFT"
import { useState } from "react"

function Createpart() {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div className="w-[280px] sb:w-[300px] sbb:w-[350px] tb:w-[350px] tbbb:w-[420px]  tbb:w-[500px] md:w-[550px] sb:ml-3 sbb:ml-3  lgg:w-[650px] tb:ml-32 mddd:ml-44  lgg:ml-72 mt-10 mb-10">
      <div className=" text-white  h-[220px] m-3 flex rounded-lg border-2 border-[#D20062]" style={{ backgroundImage: 'linear-gradient(to bottom,#FF0080,#FF5580,#C73659,#B51B75,#F7418F,#D74B76)' }}>
      <div className="p-5">
  <p className=" text-base sb:text-lg tbbb:text-xl md:text-2xl tbb:p-8 sbb:p-5 tb:p-5 md:p-7 text-white flex flex-wrap  pb-2 mddd:text-3xl mddd:pl-5">
    Discover, Sell And Create Your Own Nfts
  </p>

  <button
    className="font-bold tbbb:font-semibold text-[10px] sb:text-sm sb:-mt-1 md:-mt-3 sbb:ml-4 tb:ml-4 tbbb:ml-7 md:ml-7 border border-white text-white  mt-4  p-2 rounded-full"
    type="button"
    onClick={() => setShowModal((prev) => !prev)}
  >
    Create Nft
  </button>
</div>
     <div>
      <img src="images/design.PNG" alt="NFT Image" className="h-[200px] w-[200px] mr-32"/>
     </div>  
      </div>
     
      {showModal && (
        <Modal isOpen={showModal} close={() => setShowModal(false)}>
          <CreateNFTForm />
        </Modal>
      )}
    </div>
  )
}
export default Createpart
