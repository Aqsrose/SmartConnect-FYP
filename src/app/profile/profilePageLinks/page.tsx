"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';


function ProfilePageLinks() {
  const pathname = usePathname();
  const isActive = (path:string) => pathname === path;
  const activeLinkClass = "text-[#10676B]";
  const linkClass = "flex items-center px-2 py-1 sb:px-2  sbb:px-2  tb:py-2  rounded md:px-4 md:py-2  lg:px-4 lg:py-2  hover:text-[#85b3b6] hover:bg-[#F2F2F2]";
  return (
    <section className="flex mr-20 -mt-5 ml-2 sb:ml-8 sbb:ml-10 tb:ml-32 tbbb:ml-60  w-full shadow-sm">
      <div>
    <nav className=" justify-center">
       <ul className="flex space-x-1 sb:space-x-2 sbb:space-x-3">
        <li>
          <Link href="/posts">
            <div className={`${linkClass} ${isActive('/Posts') ? activeLinkClass : ''}`}>
              <span className="" >
                Posts
              </span>
            </div>
          </Link>
        </li>

        <li>
          <Link href="/about">
            <div className={`${linkClass} ${isActive('/about') ? activeLinkClass : ''}`}>
              <span className="">
                About
              </span>
            </div>
          </Link>
        </li>

        <li>
          <Link href="/friends">
            <div className={`${linkClass} ${isActive('friends') ? activeLinkClass : ''}`}>
              <span className="">
                Friends
              </span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/media">
            <div className={`${linkClass} ${isActive('/media') ? activeLinkClass : ''}`}>
              <span className="">
               Media
              </span>
            </div>
          </Link>
        </li>
       
          </ul>
    </nav>
    </div>
     
     </section>
  );
}

export default ProfilePageLinks;
