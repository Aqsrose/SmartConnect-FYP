"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { trpc } from "@/server/trpc/client"
import { useUser } from "@clerk/nextjs"
import { StringDecoder } from "string_decoder"

interface Props {
  userId: string
}

function ProfileFriendsPage({ userId }: Props) {
  const utils = trpc.useUtils()
  const {user} = useUser()

  const { data, isLoading, isError } =
    trpc.profileRouter.fetchFriends.useQuery()

  const {
    data: requests,
    isLoading: loadingRequests,
    isError: errorLoadingRequests,
  } = trpc.profileRouter.fetchCompleteFriendRequests.useQuery()

  const {
    mutate: acceptFriendRequest,
    isLoading: acceptingFriendRequest,
    isError: errorAcceptingRequest,
  } = trpc.profileRouter.acceptFriendRequest.useMutation()

  const {
    mutate: rejectFriendRequest,
    isLoading: rejectingFriendRequest,
    isError: errorRejectingRequest,
  } = trpc.profileRouter.rejectRequest.useMutation()

  const {
    mutate: removeFriend,
    isLoading: removingFriend,
    isError: errorRemovingFriend,
  } = trpc.profileRouter.removeFriend.useMutation()

  return (
    <div className="absolute top-2 left-4 border border-gray-100  w-[260px] sb:w-[300px] sbb:w-[350px] tb:w-[330px] tbbb:w-[350px] tbb:w-[500px] md:w-[520px] lgg:w-[400px] lggg:w-[500px]">
      {/* No of Friends */}
      <div className="flex">
        <div>
          <p className="p-2 font-semibold text-gray-500 ml-2">Friends</p>
        </div>
        <div>
          <p className="p-2 text-gray-400">
            {data && data.friendsWithUserInfo.length}
          </p>
        </div>
      </div>

      {/*Friends*/}
      <div>
        <div className="grid gap-5 mt-3">
          {data &&
            data.friendsWithUserInfo.map((friend) => (
              <div className="flex items-center ml-5 relative" key={friend.id}>
                <div className="w-16 h-16 rounded-full overflow-hidden ">
                  <img
                    src={friend.imageUrl}
                    alt="Profile"
                    className=" w-16 h-16 object-cover bg-gray-200"
                  />
                </div>
                <div className="ml-5">
                  <p className=" text-xl  text-[#10676B]">{friend.fullname}</p>
                  <p className="text-gray-300 font-semibold text-sm">
                    @{friend.username}
                  </p>
                </div>
                <div className="sb:ml-3 sbb:absolute sbb:top-5 sbb:right-8">
                  {user && user.id === userId && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-sm px-3 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors">
                          Remove
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>

                          <DialogDescription>
                            <button
                              className="text-sm px-3 py-2 bg-red-500 text-white rounded hover:bg-green-700 transition-colors"
                              onClick={() => {
                                removeFriend(
                                  { friendId: friend.id },
                                  {
                                    onSuccess: () => {
                                      toast({
                                        variant: "default",
                                        title: "Success",
                                        description:
                                          "This user has been removed as a friend",
                                      })

                                      utils.profileRouter.fetchCompleteFriendRequests.invalidate()
                                      utils.profileRouter.fetchFriends.invalidate()
                                    },
                                    onError: () => {
                                      toast({
                                        variant: "destructive",
                                        title: "Error",
                                        description:
                                          "The request could not be processed at the moment. Please try again",
                                      })
                                    },
                                  }
                                )
                              }}
                            >
                              Yes
                            </button>
                            <DialogClose>
                              <button className="text-sm px-3 py-2 bg-red-500 text-white rounded hover:bg-green-700 transition-colors">
                                Cancel
                              </button>
                            </DialogClose>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="border-t bg-gray-500 mb-3 mt-3"></div>

      {/* No of requests */}
      <div className="flex">
        <div>
          <p className="p-2 font-semibold text-gray-500 ml-2">Requests</p>
        </div>
        <div>
          <p className="p-2 text-gray-400">
            {requests && requests.completeRequests.length}
          </p>
        </div>
      </div>

      {/*requests*/}
      <div>
        {requests &&
          requests.completeRequests.map((request) => (
            <div className="grid gap-4 mt-3" key={request.senderId}>
              <div className="flex items-center ml-5 relative ">
                <div className="w-16 h-16 rounded-full overflow-hidden ">
                  <img
                    src={request.otherUser.imageUrl}
                    alt="Profile"
                    className=" w-16 h-16 object-cover bg-gray-200"
                  />
                </div>
                <div className="ml-5">
                  <p className=" text-xl  text-[#10676B]">
                    {request.otherUser.fullname}
                  </p>
                  <p className="text-gray-300 font-semibold text-sm">
                    {request.otherUser.username}
                  </p>
                </div>
                {user && user.id === userId && (
                  <div className="sb:ml-3 sbb:absolute sbb:top-5 sbb:right-8">
                    <button
                      className="text-sm px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        acceptFriendRequest(
                          { senderId: request.otherUser.id },
                          {
                            onSuccess: () => {
                              toast({
                                variant: "default",
                                title: "Success",
                                description:
                                  "This user has been added as a friend",
                              })

                              utils.profileRouter.fetchCompleteFriendRequests.invalidate()
                              utils.profileRouter.fetchFriends.invalidate()
                            },
                            onError: () => {
                              toast({
                                variant: "destructive",
                                title: "Error",
                                description:
                                  "The request could not be accepted. Please try again",
                              })
                            },
                          }
                        )
                      }}
                    >
                      Accept
                    </button>

                    <button
                      className="text-sm px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        rejectFriendRequest(
                          { userId: request.otherUser.id },
                          {
                            onSuccess: () => {
                              toast({
                                variant: "default",
                                title: "Success",
                                description: "The friend request was rejected",
                              })

                              utils.profileRouter.fetchCompleteFriendRequests.invalidate()
                              utils.profileRouter.fetchFriends.invalidate()
                            },
                            onError: () => {
                              toast({
                                variant: "destructive",
                                title: "Error",
                                description:
                                  "Couldn't reject at this time. Please try again",
                              })
                            },
                          }
                        )
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
export default ProfileFriendsPage
