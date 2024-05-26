"use client"
import React, { useState } from "react"
import Logo from "../landingpage/Logo"
import { SmallLogo } from "../landingpage/Logo"
import { Search, Bell, BellDot, Send } from "lucide-react"
import UserButtonComponent from "../UserButton"
import { trpc } from "@/server/trpc/client"
import Link from "next/link"
function Header() {
  const { data } = trpc.notificaitonRouter.fetchNotifcations.useQuery()
  console.log("notifications: ", data)

  const [openNotificationDropdown, setOpenNotificationDropdown] =
    useState(false)

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
        <div className="w-10 h-10 border border-[#ced1d1]  rounded pt-2 pl-2  relative">
          <Bell
            className="w-5 text-[#10676B] cursor-pointer"
            onClick={() => setOpenNotificationDropdown((prev) => !prev)}
          />
          {openNotificationDropdown && (
            <>
              {data?.notifications.length !== 0 ? (
                <div className="absolute bg-white w-[341px] z-50 right-0 top-11 border-black border-solid border shadow-sm p-2 flex flex-col gap-2">
                  {data?.notifications.map((notification) => (
                    <Link
                      href={
                        notification.notification.type.startsWith("POST")
                          ? `/post/${notification.notification.entityId}`
                          : ""
                      }
                    >
                      <div className="flex gap-4 items-center border-b border-[#00000033] p-2 w-full cursor-pointer hover:bg-slate-200 rounded-md">
                        <img
                          src={notification.user?.imageUrl}
                          alt="user img"
                          className="object-cover rounded-full w-12"
                        />
                        <div>
                          <p>{notification.user?.username}</p>
                          <p>{notification.notification.content}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="absolute bg-white w-[341px] z-50 right-0 top-11 border-black border-solid border shadow-sm p-2 flex flex-col gap-2">No notifications</div>
              )}
            </>
          )}
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
