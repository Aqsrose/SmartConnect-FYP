"use client";
import Layoutpage from "@/components/Navbar/Layout";
import { ChevronsUp } from "lucide-react";
import CreateAdPostModal from "@/components/advertsiment/createAdPostModal";
import Modal from "@/components/Modal";
import React, { useState } from "react";
import BoostModal from "@/components/advertsiment/boostPostModal";
import AdPostPage from "@/components/advertsiment/adPost";

function CreateAdsPage() {
  const [showModal, setShowModal] = useState(false);
  const [boostshowModal, boostsetShowModal] = useState(false);
  const boosthandleOpenModal = () => {
    boostsetShowModal(true);
  };

  const boosthandleCloseModal = () => {
    boostsetShowModal(false);
  };
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <Layoutpage>
      <div className="flex flex-row mt-32 space-x-5 ml-3 tb:ml-[110px] tbb:ml-[190px] mdc:ml-[250px] mdd:ml-[300px] lggg:ml-[400px]">
        <div
          className="w-[170px] h-56 tbbb:w-56 tbbb:h-72 relative  rounded"
          style={{
            border: "2px solid",
            borderImage:
              "linear-gradient(to top ,#CDE8E5,#7AB2B2,#83C0C1,#7AB2B2) 1",
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-[#61A3BA] text-[25px] text-white font-semibold absolute top-14 ml-12  tbbb:ml-0 tbbb:left-24 pl-2">
            +
          </div>
          <button
            onClick={handleOpenModal}
            className="text-sm tbbb:text-xl text-[#3bb496]  absolute top-28 ml-5 tbbb:ml-0 tbbb:left-9"
          >
            Create new ad
          </button>
          <p className=" text-sm text-gray-500 absolute top-36 left-2 hidden tbbb:block">
            Make an ad using text, photos or video to promote your business
          </p>
        </div>

        <div
          className="w-[170px] h-56 tbbb:w-56 tbbb:h-72 relative  rounded "
          style={{
            border: "2px solid",
            borderImage:
              "linear-gradient(to top ,#FFC0D9,#FF407D,#FB88B4,#FF90C2) 1",
          }}
        >
          <ChevronsUp className="w-8 h-8 bg-[#f26594] rounded-lg text-xl text-white font-semibold absolute top-14 ml-16 tbbb:ml-0 tbbb:left-24" />
          <button
            onClick={boosthandleOpenModal}
            className=" text-sm tbbb:text-xl text-[#f2578a]  absolute top-28 left-12"
          >
            Boost a post
          </button>
          <p className=" text-sm text-gray-500 absolute top-36 left-4 hidden tbbb:block">
            {" "}
            Get more people to see and engage with your page posts
          </p>
        </div>
      </div>

      {/* <AdPostPage/> */}
      <Modal isOpen={boostshowModal} close={boosthandleCloseModal}>
        <BoostModal close={boosthandleCloseModal} />
      </Modal>
      <Modal isOpen={showModal} close={handleCloseModal}>
        <CreateAdPostModal close={handleCloseModal} />
      </Modal>
    </Layoutpage>
  );
}
export default CreateAdsPage;
