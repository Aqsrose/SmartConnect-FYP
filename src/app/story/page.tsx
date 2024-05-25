import React from "react";
import Logo from "@/components/landingpage/Logo";
import { ChevronLeft, ChevronRight, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
function ViewStory() {
  return (
    <section className="relative lgg:w-[700px]  lggg:w-full h-full">

        {/* Logo */}
      <div className="absolute top-5 left-6">
        <Logo />
      </div>

        {/* Cross Button */}
      <Link href='/home'>
      <button className="absolute top-5 right-8 text-[40px] text-green-800">
        x
      </button></Link>

        {/*Chevron*/}
      <div className="absolute top-[300px] left-[400px] w-8 h-8 mt-12  border border-gray-700 rounded-full cursor-pointer pt-1 "> <ChevronLeft /></div>
        <div className="absolute top-[300px] right-[450px] w-8 h-8 mt-12  border border-gray-700 rounded-full cursor-pointer pt-1 pl-1 "> <ChevronRight /></div>
     
     {/*left Story*/}
      <div className="bg-[#E1AFD1] w-[200px] h-[250px] blur-sm absolute top-[250px] left-[180px] rounded">
      <div className="">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-red absolute top-8 left-12">
              <img
                src={"/Images/Ai.jpg"}
                alt="Profile"
                className="object-cover"
              />
            </div>
            <div className="text-black absolute top-36 left-[60px]">
              <p>dreamrose</p>
              <p className="text-sm ml-4">2hr ago</p>
            </div>
          </div>
      </div>

 {/*right Story*/}
 <div className="bg-[#E1AFD1] w-[200px] h-[250px] blur-sm absolute top-[250px] right-[200px] rounded">
      <div className="">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-red absolute top-8 left-12">
              <img
                src={"/Images/Ai.jpg"}
                alt="Profile"
                className="object-cover"
              />
            </div>
            <div className="text-black absolute top-36 left-[60px]">
              <p>dreamrose</p>
              <p className="text-sm ml-4">2hr ago</p>
            </div>
          </div>
      </div>

      {/*Current Story*/}
      <div className="absolute top-10 left-[500px] w-[500px] h-[670px] bg-slate-300 rounded">
        <div className="relative h-full">
          <div className="flex">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-red absolute top-4 left-4">
              <img
                src={"/Images/Ai.jpg"}
                alt="Profile"
                className="object-cover"
              />
            </div>
            <div className="text-white absolute top-4 left-[70px]">
              <p>dreamrose</p>
              <p className="text-sm">2hr ago</p>
            </div>
            <Trash2 aria-label="hidden" className="h-5 w-5 text-red-500 absolute top-5 right-12" />
            <div className="absolute top-5 right-4">
              <MoreHorizontal />
            </div>
          </div>
       
          <div className=" w-[460px] h-[550px] absolute top-20 left-5">
            <div className=" w-full h-full">
              <img
                src={"/Images/Ai.jpg"}
                alt="Profile"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="flex absolute bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="mr-2">
              <Eye />
            </div>
            <div>
              <p>2</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ViewStory;
