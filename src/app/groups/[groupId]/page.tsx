"use client";
import Layoutpage from "@/components/Navbar/Layout";
import { useUser } from "@clerk/nextjs";
import { trpc } from "@/server/trpc/client";
import {
  Camera,
  Info,
  Loader2,
  Lock,
  MoreHorizontal,
  Plus,
  Repeat,
  Search,
  Share2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import GroupLinks from "@/components/Group/GroupLinks";
import Link from "@/components/Group/GroupContainers";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

interface PageProps {
  params: {
    groupId: string;
  };
}

const Page = ({ params: { groupId } }: PageProps) => {
  const { data } = trpc.groupRouter.fetchGroupById.useQuery({ groupId });
  console.log("Group data: ", data);
  const utils = trpc.useUtils();

  const { user } = useUser();
  const [activeLink, setActiveLink] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const copyElement = useRef<HTMLInputElement | null>(null);

  const {
    data: groupMembers,
    isLoading,
    isError,
  } = trpc.groupRouter.fetchGroupMembers.useQuery({ groupId });

  console.log("Group members: ", groupMembers);

  const isUserAMember =
    groupMembers &&
    groupMembers.groupMembersWithUserData.some((member) => {
      return member.user.id === user?.id;
    });

  const {
    data: friends,
    isLoading: fetchingFriends,
    isError: errorFetchingFriends,
  } = trpc.profileRouter.fetchFriends.useQuery();

  const {
    mutate: inviteToGroup,
    isLoading: invitingToGroup,
    isError: inviteError,
  } = trpc.groupRouter.inviteToGroup.useMutation();

  const {
    data: groupJoinRequests,
    isLoading: loadingRequests,
    isError: errorLoadingRequests,
  } = trpc.groupRouter.fetchGroupJoinRequests.useQuery({ groupId });

  console.log("Group join requests: ", groupJoinRequests);

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
            {data?.group?.name}
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
            {isUserAMember && (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-gradient-to-r  bg-blue-500 hover:from-blue-600 hover:to-blue-500 px-4 py-2 mr-3 text-white rounded transition duration-200 ">
                    + invite
                  </button>
                </DialogTrigger>
                <DialogContent>
                  {isLoading ? (
                    <Loader2 className="animate-spin m-auto" />
                  ) : friends?.friendsWithUserInfo.length === 0 ? (
                    <div>you have no friends</div>
                  ) : (
                    friends?.friendsWithUserInfo.map((friend) => (
                      <div
                        className="flex gap-4 items-center border-b border-[#00000033] p-2 w-full cursor-pointer hover:bg-slate-200 rounded-md"
                        key={friend.id}
                      >
                        <img
                          src={friend.imageUrl}
                          alt="user img"
                          className="object-cover rounded-full w-12 h-12"
                        />
                        <p>{friend.username}</p>
                        {groupJoinRequests &&
                        groupJoinRequests.joinRequests.some((request) => {
                          return request.userId === friend.id;
                        }) ? (
                          <button
                            className="ml-auto bg-gradient-to-r  bg-blue-500 hover:from-blue-600 hover:to-blue-500 px-4 py-2 mr-3 text-white rounded transition duration-200"
                            disabled={true}
                          >
                            invited
                          </button>
                        ) : (
                          <button
                            className="ml-auto bg-gradient-to-r  bg-blue-500 hover:from-blue-600 hover:to-blue-500 px-4 py-2 mr-3 text-white rounded transition duration-200"
                            onClick={() =>
                              inviteToGroup(
                                { groupId, userId: friend.id },
                                {
                                  onSuccess: () => {
                                    toast({
                                      variant: "default",
                                      title: "Invitation Sent",
                                      description:
                                        "Your invite has been sent.",
                                    });
                                    utils.groupRouter.fetchGroupJoinRequests.invalidate();
                                  },
                                  onError: () => {
                                    toast({
                                      variant: "destructive",
                                      title: "Invitation Failed",
                                      description:
                                        "Your invite could not be sent.",
                                    });
                                  }
                                }
                              )
                            }
                          >
                            {invitingToGroup ? "loading..." : "+ invite"}
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </DialogContent>
              </Dialog>
            )}
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
                      <div>Share Group</div>
                      <div>Share the group with others.</div>
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
                                navigator.clipboard
                                  .writeText(link)
                                  .then(() => {
                                    setIsCopied(true);
                                    setTimeout(() => setIsCopied(false), 3000);
                                  })
                                  .catch((error) => {
                                    console.error("Copy failed:", error);
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

      {groupMembers && (data?.group?.isPublic || isUserAMember) ? (
        <>
          <GroupLinks setActiveLink={setActiveLink} />
          <Link activeLink={activeLink} groupId={groupId} />
        </>
      ) : isLoading ? (
        <div className="flex justify-around w-full mt-40 space-x-7  p-3 left-7 top-3 border border-gray-100">
          <Skeleton className=" bg-gray-200 dark:bg-gray-700   w-20 h-10 rounded " />
          <Skeleton className=" bg-gray-200 dark:bg-gray-700   w-20 h-10 rounded " />
          <Skeleton className=" bg-gray-200 dark:bg-gray-700  w-20 h-10 rounded " />
          <Skeleton className=" bg-gray-200 dark:bg-gray-700   w-20 h-10 rounded " />
        </div>
      ) : (
        <div>Request to join the group to see its posts and discussions</div>
      )}
    </Layoutpage>
  );
};

export default Page;
