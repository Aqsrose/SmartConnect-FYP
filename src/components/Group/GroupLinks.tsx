import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Search, MoreHorizontal,Info } from "lucide-react";

interface GroupLinksProps {
  setActiveLink: (link: string) => void;
}

const GroupLinks: React.FC<GroupLinksProps> = ({ setActiveLink }) => {
  const pathname = usePathname();
  const isActive = (path: string): boolean => pathname === `/GroupLinks/${path}`;

  const activeLinkClass = "text-[#10676B]";
  const linkClass = "flex items-center px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-2 lg:px-4 lg:py-2 hover:text-[#85b3b6] hover:bg-[#F2F2F2] rounded";

  return (
    <section className="flex flex-col sm:flex-row justify-between items-center mt-3 w-full shadow-sm bg-white px-4 py-2">
      <nav>
        <ul className="flex justify-around w-full text-sm mt-20 tbb:mt-7 border border-gray-100 p-3 tb:ml-20 tb:pr-10 tbb:ml-24 md:ml-[220px] md:p-0">
          {['Discussion', 'Members', 'Events', 'Media'].map((link) => (
            <li key={link}>
              <div 
                className={`${linkClass} ${isActive(link) ? activeLinkClass : ''}`}
                onClick={() => setActiveLink(link)}
              >
                {link}
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex -mt-[100px] -mr-[150px] sbb:-mr-[250px] tb:-mr-[350px] tbbb:-mr-[400px]  tbb:-mr-[0] md:mr-10 mdd:mt-7">
        <div className="px-3 py-2"><Search size={20}/></div>
        <div className="px-3 py-2"><MoreHorizontal size={20}/></div>
        <div className="px-3 py-2 block mdd:hidden lg:hidden"><Info size={20}/></div>
      </div>
    </section>
  );
}

export default GroupLinks;
