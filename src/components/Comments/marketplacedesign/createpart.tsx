"use client"
import Modal from "@/components/Modal"
import CreateNFTForm from "@/components/marketpalce/CreateNFT"
import { useState } from "react"

function Createpart() {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div className="w-[800px] rounded overflow-hidden shadow-sm tb:m-7  tb:ml-28 md:ml-[200px] mdd:ml-[300px] p-10 ">
      <div className="mdd:flex">
        <p className="tb:m-4 mt-5 text-xl text-green-900 -ml-4 tb:ml-5 tbb:ml-14 md:ml-0 pr-[550px] tb:pr-[550px] tbb:pr-[100px] flex">
          Discover, Collect, Sell And Create Your Own Nfts
        </p>
        <button
          className="bg-gradient-to-r text-sm from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white -ml-3 mt-2 tbb:ml-14 md:ml-0 tb:m-3 p-3  rounded"
          type="button"
          onClick={() => setShowModal((prev) => !prev)}
        >
          Create Nft
        </button>
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
