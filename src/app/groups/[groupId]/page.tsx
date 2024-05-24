"use client";
import Layoutpage from "@/components/Navbar/Layout";
import {  useUser } from "@clerk/nextjs";
import { trpc } from "@/server/trpc/client";
import {
  Camera,
  Info,
  Lock,
  MoreHorizontal,
  Plus,
  Repeat,
  Search,
  Share2,
} from "lucide-react";
import React, { useRef, useState } from "react";
import GroupLinks from "@/components/Group/GroupLinks";
import Link from "@/components/Group/GroupContainers";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  params: {
    groupId: string;
  };
}

const page = ({ params: { groupId } }: PageProps) => {
  const { data } = trpc.groupRouter.fetchGroupById.useQuery({ groupId });
  console.log("foo: ", data);
  const { user } = useUser();
  const [activeLink, setActiveLink] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const copyElement = useRef<HTMLInputElement | null>(null);
  // console.log("group posts: ", groupPosts)
  if (!user) {
    return (
      <Layoutpage>
        <div className="bg-white relative h-full -mt-6 pt-0 p-4 pl-2 tb:pl-32 pr-3  lggg:ml-[20px] md:w-[680px] mdc:w-[730px] mdd:w-[930px] lg:w-[950px] mddd:w-[730px] lgg:w-[900px] lggg:w-9/12">
          <Skeleton className="w-full h-72 rounded-md  relative bg-gray-200 dark:bg-gray-700 " />
          <Skeleton className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full ml-2 tb:ml-4 -mt-10 border-4 border-white relative" />
          <div className="-mt-20 -ml-6 tb:-ml-6 ">
            <Skeleton className=" ml-[170px] w-32 h-3 bg-gray-200 dark:bg-gray-700 " />
            <Skeleton className=" ml-[170px] w-32 h-3 bg-gray-200 dark:bg-gray-700 mt-2 " />
            <Skeleton className=" mt-2 ml-[10.6rem] w-32 h-3 bg-gray-200 dark:bg-gray-700 " />
          </div>
          <div className="mt-3  w-[340px] ">
            <div className="flex absolute right-0 bottom-40  ">
              <Skeleton className=" bg-gray-200 dark:bg-gray-700  mr-2 w-16 h-10 rounded " />
              <Skeleton className="bg-gray-200 dark:bg-gray-700  w-16 h-10 rounded " />
              <div className="ml-2">
                <Skeleton className="bg-gray-200 dark:bg-gray-700 w-16 h-10 rounded " />
              </div>
            </div>
          </div>
          <div className="flex justify-around w-full mt-40 space-x-7  p-3 left-7 top-3 border border-gray-100">
            <Skeleton className=" bg-gray-200 dark:bg-gray-700   w-20 h-10 rounded " />
            <Skeleton className=" bg-gray-200 dark:bg-gray-700   w-20 h-10 rounded " />
            <Skeleton className=" bg-gray-200 dark:bg-gray-700  w-20 h-10 rounded " />
            <Skeleton className=" bg-gray-200 dark:bg-gray-700   w-20 h-10 rounded " />
          </div>
        </div>
      </Layoutpage>
    );
  }
  return (
    <Layoutpage>
      <div className="bg-white relative h-full -mt-6 pt-0 p-4 pl-2 tb:pl-32 pr-3  lggg:ml-[20px] md:w-[680px] mdc:w-[730px] mdd:w-[930px] lg:w-[950px] mddd:w-[730px] lgg:w-[900px] lggg:w-9/12">
        <div className="w-full h-72 rounded-md  relative bg-gray-100">
          {data?.group?.coverImageUrl && (
            <img
              src={data.group.coverImageUrl}
              alt="Cover"
              className="w-full h-72 object-cover rounded-md"
            />
          )}
          <div className="absolute right-0 bottom-0 p-1 border-4 border-white rounded-full bg-gray-50">
            <Camera className="cursor-pointer" />
          </div>
          <input type="file" accept="image/*" className="hidden" />
        </div>

        <div className="-mt-14">
          <p className="text-xl text-gray-700 mt-16 ml-5 text-bold-xl ">
            {data?.group!.name}
          </p>
          <div className="">
            <Lock className="w-4 h-4 text-gray-400  ml-5 " />
            <p className="text-sm text-gray-400 -mt-4 ml-10">
              {data?.group?.isPublic ? "Public Group" : "Private Group"}
            </p>
            <p className="text-sm text-gray-400 -mt-5 ml-[135px]">
              {data?.group?._count.groupUsers} members
            </p>
          </div>
          <div className="flex">
            <div className="w-10 h-10 bg-gray-100 rounded-full ml-5  border-2 border-white relative ">
              <img
                src=""
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full -ml-2 border-2 border-white relative">
              <img
                src=""
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full -ml-2 border-2 border-white relative">
              <img
                src=""
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="flex absolute right-3 bottom-20 ">
          <MoreHorizontal size={20} />
        </div>
        <div className="mt-3  w-[340px] ">
          <div className="flex tbbb:absolute tbbb:right-0 tbbb:bottom-6 ">
            {" "}
            <button className="bg-gradient-to-r  bg-blue-500 hover:from-blue-600 hover:to-blue-500 px-4 py-2 mr-3 text-white rounded transition duration-200 ">
              + invite
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="bg-gradient-to-r bg-[#349E8D] hover:from-[#488f84] hover:to-[#349E8D]  text-white px-4 py-2 rounded transition duration-200">
                  Share
                </button>
              </DialogTrigger>
              <DialogContent>
                <div>
                  <div>
                    <Button className="text-sm leading-none" variant="ghost">
                      Share
                    </Button>
                  </div>
                  <div className="max-w-sm">
                    <div>
                      <div>Share Post</div>
                      <div>Share the post with others.</div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Label className="sr-only" htmlFor="link">
                          Link
                        </Label>
                        <Input
                          className="flex-1 text-sm"
                          id="link"
                          placeholder="Link"
                          readOnly
                          value={`${process.env.NEXT_PUBLIC_SERVER_URL}/groups/${groupId}`}
                          ref={copyElement}
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            if (copyElement.current) {
                              const link = copyElement.current.value;
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(link).then(() => {
                                  setIsCopied(true);
                                  setTimeout(() => setIsCopied(false), 3000);
                                  return;
                                });
                                copyElement.current.select();
                                document.execCommand("copy");
                                setIsCopied(true);
                                setTimeout(() => setIsCopied(false), 3000);
                              }
                            }
                          }}
                        >
                          {isCopied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
       
      </div>
      <GroupLinks setActiveLink={setActiveLink} />
      <Link activeLink={activeLink} groupId={groupId} />
    </Layoutpage>
  );
};

export default page;
