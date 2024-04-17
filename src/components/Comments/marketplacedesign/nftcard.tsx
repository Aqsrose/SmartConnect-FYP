import React from "react";
import { Heart,Clock,MoreHorizontal} from "lucide-react"
function NftCards(){
  return (
    <div className="flex justify-center items-center -mt-6 md:mr-[300px] mdd:mr-[100px]">
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-3 tb:ml-28">
      <div className="relative">
        <img className="w-full" src="images/room.jpeg" alt="NFT Image" />
        <div></div>
        <button className="flex absolute top-1 right-2 text-red-700 bg-white rounded-full p-2 opacity-90 hover:opacity-100">
        <Heart className="w-4"/>
        <p className="text-[12px] p-1">88</p>
        </button>
        <span className=" flex absolute top-2 left-2 text-green-900 text-xs bg-white rounded-full px-2 py-1 opacity-100">
          <Clock className="w-3"/>
       <p className="p-1">10 mins ago</p>
        </span>
        <button className="flex absolute bottom-1 right-2 text-red-700 bg-white rounded-full p-2 opacity-60 hover:opacity-100">
        <MoreHorizontal />
        </button>
      </div>
      <div className="m-3 flex">
        <div>
        <p className=" text-xl ">Amazing Digital Art</p>
        <p className="text-purple-700"> 0.047 ETH</p>
        <p className="text-gray-400 text-sm">@John Doe</p>
      </div>
      <div className="ml-[110px] mt-12">
      <button className=" text-blue-500 font-semibold opacity-80 hover:opacity-100">
        Buy now
        </button>
      </div>
    </div></div>
    </div>
   
  );
};

export default NftCards;