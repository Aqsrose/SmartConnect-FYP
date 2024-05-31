import Image from "next/image";
import React from "react";

function EmptyChatPage() {
  return (
    <main className="flex-grow  hidden tbb:flex flex-col items-center justify-center md:w-[350px] mdc:w-[450px] mdd:w-[500px] mddd:w-[600px] lgg:w-[700px] lggg:w-[950px] text-center p-4">
      <div className="w-16 h-16 overflow-hidden border-2 rounded-full border-green-700 -mt-28">
        <Image
          src="/Images/green.png"
          alt="Profile"
          width={100}
          height={100}
          className="object-cover"
        />
      </div>
      <div className="mt-4 text-lg text-black">Your Messages</div>
      <div className="mt-2 text-sm text-gray-400">
        Send private photos and messages to friends or groups
      </div>
    </main>
  );
}

export default EmptyChatPage;
