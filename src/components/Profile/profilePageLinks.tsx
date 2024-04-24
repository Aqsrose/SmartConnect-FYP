import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';


interface ProfilePageLinksProps {
  setActiveLink: (link: string) => void;
}

const ProfilePageLinks: React.FC<ProfilePageLinksProps> = ({ setActiveLink }) => {
  const pathname = usePathname();
  const isActive = (path: string): boolean => pathname === `/ProfilePageLinks/${path}`;

  const activeLinkClass = "text-[#10676B]";
  const linkClass = "flex items-center px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-2 lg:px-4 lg:py-2 hover:text-[#85b3b6] hover:bg-[#F2F2F2] rounded";

  return (
    <section className="flex flex-col sm:flex-row justify-between items-center mt-3 w-full shadow-sm bg-white px-4 py-2">
      <nav>
        <ul className="flex justify-around w-full text-sm  tbb:mt-7 border border-gray-100 p-3 tb:ml-20 tb:pr-10 tbb:ml-24 md:ml-[220px] md:p-0">
          {['Posts', 'About', 'Friends', 'Media'].map((link) => (
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
    </section>
  );
}

export default ProfilePageLinks;
