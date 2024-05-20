
import React from 'react';
function RightBar(){
  return (
    <div className="w-[270px] fixed right-0  h-full shadow-md hidden mdd:hidden md:hidden lg:hidden mddd:block lgg:block ">
     
      <div className=" text-white p-7 m-3 mt-32 rounded-lg border-2 border-[#01A9B4]" style={{ backgroundImage: 'linear-gradient(to bottom,#1A1E50,#10676B,#4D869C,#086972,#22577E,#004A7C)' }}>
        <h2 className="font-semibold mb-2">🔗 Connect</h2>
        <p> With MetaMask to manage and interact with your NFTs securely on the blockchain!</p>
      </div>

      <div className="mt-4 p-4">
        <h3 className="text-lg font-semibold mb-4 text-[#4D869C] ">Who to follow</h3>
        
          <div className="flex items-center gap-3 mb-4 border border-[#b5d8da] rounded-sm pt-2 pl-2 bg-gray-50">
            <img src="" alt='' className="w-9 h-9 rounded-full mb-2 ml-3"/>
            <div className='flex' >
              <div><p className="font-medium ml-1">John Doe</p>
              <p className="text-sm text-gray-500 ml-1 mb-3">@doe123</p></div>
              <div> <button className="text-xs text-blue-500 hover:text-blue-600 border border-[#b5d8da] mt-1 rounded-sm p-2 ml-5 ">Follow</button></div>
             <button className='text-sm text-[#10676B] -mt-9 ml-2 '>x</button>
            </div>
          </div> 

          <div className="flex items-center gap-3 mb-4 border border-[#b5d8da] rounded-sm pt-2 pl-2 bg-gray-50">
            <img src="" alt='' className="w-9 h-9 rounded-full mb-2 ml-3"/>
            <div className='flex' >
              <div><p className="font-medium ml-1">Alisa</p>
              <p className="text-sm text-gray-500 ml-1 mb-3">@alisa123</p></div>
              <div> <button className="text-xs text-blue-500 hover:text-blue-600 border border-[#b5d8da] mt-1 rounded-sm p-2 ml-5 ">Follow</button></div>
             <button className='text-sm text-[#10676B] -mt-9 ml-2 '>x</button>
            </div>
          </div> 

          <div className="flex items-center gap-3 mb-4 border border-[#b5d8da] rounded-sm pt-2 pl-2 bg-gray-50">
            <img src="" alt='' className="w-9 h-9 rounded-full mb-2 ml-3"/>
            <div className='flex' >
              <div><p className="font-medium ml-1">Ether</p>
              <p className="text-sm text-gray-500 ml-1 mb-3">@ether123</p></div>
              <div> <button className="text-xs text-blue-500 hover:text-blue-600 border border-[#b5d8da] mt-1 rounded-sm p-2 ml-5 ">Follow</button></div>
             <button className='text-sm text-[#10676B] -mt-9 ml-2 '>x</button>
            </div>
          </div> 

        </div>
    </div>
  );
}

export default RightBar;
