"use client";
import React, { useState } from "react";
import Logo from "../landingpage/Logo";
import { SmallLogo } from "../landingpage/Logo";
import {
  Search,
  Bell,
  BellDot,
  Send,
  Loader2,
  AlertCircle,
  Megaphone,
} from "lucide-react";
import UserButtonComponent from "../UserButton";
import { trpc } from "@/server/trpc/client";
import Link from "next/link";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useRouter } from "next/navigation";

function Header() {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data } = trpc.notificaitonRouter.fetchNotifcations.useQuery();

  const [openNotificationDropdown, setOpenNotificationDropdown] =
    useState(false);

  const getNotificationDestinationUrl = (
    type: string,
    entityID: string | null
  ) => {
    if (type.startsWith("POST") || type.startsWith("COMMENT")) {
      return `/post/${entityID}`;
    }
    if (type === "FRIEND_REQUEST") {
      if (entityID) return `/profile/${entityID}`;
      else return ``;
    }

    // FRIEND_REQUEST
    // NEW_MESSAGE
    // POST_LIKE
    // COMMENT_LIKE
    // STORY_VIEW
    // POST_COMMENT
    // COMMENT_REPLY
    // GROUP_INVITE
    // EVENT_REMINDER

    return "";
  };

  const {
    data: users,
    isLoading: loadingUsers,
    isError: errorLoadingUsers,
  } = trpc.profileRouter.searchUsers.useQuery({ key: searchKey });

  const unreadCount =
    data?.notifications.reduce((count, item) => {
      return item.notification.isRead ? count : count + 1;
    }, 0) ?? 0;

  const { mutate: markAsRead } =
    trpc.notificaitonRouter.markAsRead.useMutation();

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
            <div className="w-full border text-sm md:text-lg p-2 rounded flex relative">
              <Search className="text-[#10676B] w-5" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 text-sm hidden tbbb:block md:block lg:block"
                onChange={(e) => {
                  setSearchKey(e.currentTarget.value);
                }}
                onInput={() => setOpenDropDown(true)}
                onFocus={(e) => (e.target.value ? setOpenDropDown(true) : null)}
              />
              {openDropDown && (
                <div className="absolute bg-white w-[341px] z-50 top-8 -left-12 border-black border-solid border shadow-sm p-2 flex gap-2 flex-col">
                  {loadingUsers ? (
                    <Loader2 className="animate-spin m-auto" />
                  ) : (
                    users?.users.map((user) => (
                      <div
                        className="flex gap-4 items-center border-b border-[#00000033] p-2 w-full cursor-pointer hover:bg-slate-200 rounded-md"
                        key={user.id}
                        onClick={() => router.push(`/profile/${user.id}`)}
                      >
                        <img
                          src={user.imageUrl}
                          alt="user img"
                          className="object-cover rounded-full w-12"
                        />
                        <p>{user.username}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lggg:ml-[800px]   mt-4 flex space-x-2">
        <Link href="/createads">
          <button
            className=" hover:from-[#6F8AE1] hover:to-[#4D3BE6] px-4 py-2  text-white rounded transition duration-200 flex"
            style={{
              backgroundImage:
                "linear-gradient(to right, #086972, #44679F, #005691, #004A7C, #22577E)",
            }}
          >
            <Megaphone className="w-5 text-white mr-2" /> Ad
          </button>
        </Link>
        <Link href="/chats">
          <div className="w-10 h-10 border border-[#ced1d1]  rounded pt-2 pl-2  ">
            <Send className="w-5 text-[#10676B]" />
          </div>
        </Link>
        <div className="w-10 h-10 border border-[#ced1d1]  rounded pt-2 pl-2 relative">
          <Bell
            className="w-5 text-[#10676B] cursor-pointer"
            onClick={() => {
              setOpenNotificationDropdown((prev) => !prev);
              markAsRead(undefined, {
                onSuccess: () => {
                  utils.notificaitonRouter.fetchNotifcations.invalidate();
                },
              });
            }}
          />
          {unreadCount > 0 && (
            <span className="absolute top-[1px] left-[1px] font-bold text-[10px] w-4 h-4 pt-[1px] bg-red-600 rounded-full justify-center items-center text-white flex">
              {unreadCount}
            </span>
          )}
          {openNotificationDropdown && (
            <div className="absolute bg-white w-[440px] z-50 right-0 top-11 border-gray-200 rounded border-solid border shadow-sm p-2 flex flex-col gap-2 max-h-96 overflow-y-auto">
              {data && data?.notifications.length > 0
                ? data?.notifications.map((notification) => (
                    <Link
                      href={getNotificationDestinationUrl(
                        notification.notification.type,
                        notification.notification.entityId
                      )}
                      key={notification.notification.id}
                    >
                      <div className="flex gap-4 mb-3 items-center  border-b border-[#00000033] p-3 w-full cursor-pointer hover:bg-slate-200 rounded-md">
                        {notification.notification.senderId === "system" ? (
                          <AlertCircle fill="red" className="w-12 h-12" />
                        ) : (
                          <img
                            src={notification.user?.imageUrl}
                            alt="user img"
                            className="object-cover rounded-full w-12"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-500">
                            {notification.notification.content}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatRelativeTime(
                              notification.notification.createdAt
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                : "No notifications"}
            </div>
          )}
        </div>

        <div className="mt-[6px]">
          <UserButtonComponent />
        </div>
      </div>

      {/* <div><BellDot/></div> */}
    </header>
  );
}

export default Header;
