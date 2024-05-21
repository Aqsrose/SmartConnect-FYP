import React from "react"
import Logo from "../landingpage/Logo"
import { SmallLogo } from "../landingpage/Logo"
import { Search, Bell, BellDot, Send } from "lucide-react"
import UserButtonComponent from "../UserButton"
function Header() {
  return (
    <header className="fixed inset-x-0  mx-auto py-3 lg:py-3 px-4 sm:px-6 lg:px-8 bg-white border border-[#f4f2f2] z-50 flex ">
      <div className="w-full">
        <div className="mt-2 md:mt-0 hidden tbb:block md:block xl:block">
          {" "}
          <Logo />
        </div>
        <div className="w-14 h-14  md:hidden xl:hidden tbb:hidden pt-2">
          <SmallLogo />
        </div>
        <div className="flex-row">
          <div className="mb-4 pl-[50px] tbb:pl-32 pt-2 pr-2 md:pl-0 md:pr-0 md:ml-48 md:mr-8 mt-[-50px] lg:ml-48  lg:pl-0 lg:pr-0 flex">
            <div className="w-full border text-sm md:text-lg p-2 rounded flex">
              <Search className="text-[#10676B] w-5" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 text-sm hidden tbbb:block md:block lg:block"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="lggg:ml-[800px] ml-5  mt-4 flex space-x-2">
        <div className="w-10 h-10 border border-[#ced1d1]  rounded pt-2 pl-2  ">
          <Send className="w-5 text-[#10676B]" />
        </div>
        <div className="w-10 h-10 border border-[#ced1d1]  rounded pt-2 pl-2  ">
          <Bell className="w-5 text-[#10676B]" />
        </div>

        <div className="mt-[6px]">
          <UserButtonComponent />
        </div>
      </div>

      {/* <div><BellDot/></div> */}
    </header>
  )
}

export default Header
