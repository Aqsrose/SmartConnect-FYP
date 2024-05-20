import React from "react";
import { Search, MoreHorizontal, Info } from "lucide-react";

interface GroupLinksProps {
  setActiveLink: (link: string) => void;
  
}

const GroupLinks: React.FC<GroupLinksProps> = ({ setActiveLink }) => {
  const linkClass = "flex items-center px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-2 lg:px-4 lg:py-2 hover:text-[#85b3b6] hover:bg-[#F2F2F2] rounded";

  return (
    <div className="flex flex-col tb:-ml-[190px] justify-between items-center  bg-white px-4 py-2">
      <div className="flex ml-32 sbb:ml-[230px] tb:ml-[620px] tbb:ml-[690px] mdd:ml-[770px] mddd:ml-[580px] lgg:ml-[740px] lggg:ml-[800px]">
        <div className="px-3 py-2"><Search size={20} /></div>
        <div className="px-3 py-2"><MoreHorizontal size={20} /></div>
        <div className="px-3 py-2 hidden "><Info size={20} /></div>
      </div>
      <nav className="tb:ml-[300px] tbbb:ml-[350px] md:ml-[50px] lgg:-ml-[280px] lggg:-ml-[550px]">
        <ul className="flex justify-around w-full  text-sm  border border-gray-100 p-3 space-x-2 sbb:space-x-5 tb:space-x-5  ">
          {['Discussion','Events', 'Media', 'Chats'].map((link) => (
            <li key={link}
            className={linkClass}
                onClick={() => setActiveLink(link)}
            >
                {link}
            </li>
          ))}
        </ul>
      </nav>
      
    </div>
  );
}

export default GroupLinks;
