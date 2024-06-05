"use client"
import { useUser } from "@clerk/nextjs"
import { trpc } from "@/server/trpc/client"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import StoryModal from "@/components/story/storyModal"
import Modal from "@/components/Modal"
import { Camera, Pencil, MoreHorizontal, Trash2 } from "lucide-react"
import useNFTMarketplace from "@/web3/useMarketplace"
import getSignedUrls from "@/app/actions/getSignedUrls"
import { toast } from "@/components/ui/use-toast"
import Layoutpage from "@/components/Navbar/Layout"
import React, { useState, useRef, ChangeEvent } from "react"
import ProfilePageLinks from "@/components/Profile/profilePageLinks"
import ProfileDetails from "@/components/Profile/profileDetails"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import EditProfileModal from "@/components/Profile/EditProfileModal"

interface PageProps {
  params: {
    userId: string
  }
}

const UserProfilePage = ({ params: { userId } }: PageProps) => {
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleOpenEditModal = () => {
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
  }

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }
  const { user } = useUser()
  const utils = trpc.useUtils()
  const [activeLink, setActiveLink] = useState<string>("")

  const coverImageElement = useRef<HTMLInputElement | null>(null)

  const {
    data: userFromBackend,
    isLoading: loadingUser,
    isError: errorLoadingUser,
  } = trpc.profileRouter.fetchUserInfo.useQuery({
    userId,
  })

  console.log("userFromBackend: ", userFromBackend)

  const {
    data: requests,
    isLoading: loadingRequests,
    isError: requestsError,
  } = trpc.profileRouter.fetchFriendRequests.useQuery()

  const { data: friends, isFetched: friendsFetched } =
    trpc.profileRouter.fetchFriendsForRequest.useQuery({ userId })

  const [requestButtonState, setRequestButtonState] = useState({
    showCancel: false,
    showRequest: false,
    showRespond: false,
  })

  useEffect(() => {
    if (!friendsFetched || loadingRequests) return

    const isFriend =
      user &&
      user.id !== userId &&
      friends &&
      friends?.friends.some((friend) => {
        return (
          (friend.userId === user.id && friend.friendId === userId) ||
          (friend.userId === userId && friend.friendId === user.id)
        )
      })
    const friendRequest = requests?.requests.find((request) => {
      return (
        (request.senderId === user?.id && request.receiverId === userId) ||
        (request.senderId === userId && request.receiverId === user?.id)
      )
    })
    let showCancel = false
    let showRespond = false
    let showRequest = false

    if (friendRequest) {
      if (friendRequest.senderId === user?.id) {
        showCancel = true
      } else if (friendRequest.receiverId === user?.id) {
        showRespond = true
      }
    } else if (!isFriend && userId !== user?.id) {
      showRequest = true
    }

    setRequestButtonState({ showCancel, showRespond, showRequest })
  }, [user, userId, friendsFetched, loadingRequests, friends, requests])

  const {
    data: coverImageResponse,
    isLoading: loadingCoverImage,
    isError: coverImageError,
  } = trpc.profileRouter.fetchCoverImage.useQuery({
    userId,
  })

  const { mutate: updateCoverImage, isLoading: updatingCoverImage } =
    trpc.profileRouter.updateCoverImage.useMutation()

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = trpc.postRouter.fetchUserPosts.useInfiniteQuery(
    { userId, limit: 2 },
    {
      getNextPageParam: (lastPageResponse) => lastPageResponse.nextCursor,
      enabled: userId ? true : false,
    }
  )

  const {
    data: savedPosts,
    isLoading: loadingSavedPosts,
    isError: errorLoadingSavedPosts,
  } = trpc.postRouter.fetchSavedPosts.useInfiniteQuery(
    {
      limit: 2,
    },
    {
      getNextPageParam: (lastPageResponse) => lastPageResponse.nextCursor,
      enabled: userId ? true : false,
    }
  )

  const {
    mutate: sendFriendRequest,
    isLoading: sendingRequest,
    isError: errorSendingRequest,
  } = trpc.profileRouter.sendFriendRequest.useMutation()

  const {
    mutate: cancelRequest,
    isLoading: cancellingRequest,
    isError: errorCancelling,
  } = trpc.profileRouter.cancelRequest.useMutation()

  const { ownedNfts } = useNFTMarketplace()

  const { ref, inView, entry } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  const handleCoverImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || !event.target.files[0]) {
      return
    }
    const selectedFile = event.target.files[0]

    const checksum = await computeSHA256(selectedFile)

    const response = await getSignedUrls(
      [selectedFile.type],
      [selectedFile.size],
      [checksum],
      userId
    )

    if (response) {
      const [first] = response.signedUrls

      const res = await fetch(first, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      })
      const url = first.split("?")[0]
      updateCoverImage(
        { imageUrl: url },
        {
          onError: () => {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong",
              description: `An internal server error occurred. Please try again later.`,
            })
          },
          onSuccess: () => {
            toast({
              title: "Success.",
              description: "Cover image updated successfully.",
            })
          },
        }
      )
    }
  }

  //MOVE THIS TO A SEPARATE FILE LATER AND IMPORT FROM THERE "helpers.ts"
  const computeSHA256 = async (file: File) => {
    //do this for media array
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
    return hashHex
  }
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const coverPhotoInputRef = useRef<HTMLInputElement>(null)
  const profilePhotoInputRef = useRef<HTMLInputElement>(null)

  const handleProfilePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileURL = URL.createObjectURL(file)
      setProfilePhoto(fileURL)
      localStorage.setItem("profilePhoto", fileURL)
    }
  }

  const {
    mutate: acceptFriendRequest,
    isLoading: accpetingFriendRequest,
    isError: errorAcceptingFriendRequest,
  } = trpc.profileRouter.acceptFriendRequest.useMutation()

  const {
    mutate: rejectRequest,
    isLoading: rejectingRequest,
    isError: errorRejectingRequest,
  } = trpc.profileRouter.rejectRequest.useMutation()

  const triggerFileInput = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.click()
  }

  const {
    data: otherUserFriends,
    isLoading: loadingOtherUserFriends,
    isError: errorLoadingOtherUserFriends,
  } = trpc.profileRouter.fetchFriendsForProfile.useQuery({ userId })

  if (!user) {
    return (
      <Layoutpage>
        <div className="bg-white relative h-full -mt-6 pt-0 p-4 pl-2 tb:pl-32 pr-3  lggg:ml-[20px] md:w-[680px] mdc:w-[730px] mdd:w-[930px] lg:w-[950px] mddd:w-[730px] lgg:w-[900px] lggg:w-9/12">
          <Skeleton className="w-full h-72 rounded-md  relative bg-gray-200 dark:bg-gray-700 " />
          <Skeleton className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full ml-2 tb:ml-4 -mt-10 border-4 border-white relative" />
          <div className="-mt-20 -ml-6 tb:-ml-6 ">
            <Skeleton className=" ml-[170px] w-32 h-3 bg-gray-200 dark:bg-gray-700 " />
            <Skeleton className=" ml-[170px] w-32 h-3 bg-gray-200 dark:bg-gray-700 mt-2" />
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
    )
  }
  const showRequestButton = () => {
    if (requestButtonState.showCancel) {
      return (
        <button
          className="bg-gradient-to-r  bg-blue-500 hover:from-blue-600 hover:to-blue-500  px-0 py-2 sb:px-2 sbb:py-2 sbb:px-2 sb:py-2 tb:px-4 tb:py-2  text-white rounded transition duration-200 mr-2"
          onClick={() => {
            cancelRequest(
              { userId },
              {
                onSuccess: () => {
                  utils.profileRouter.fetchFriendRequests.invalidate()
                  utils.profileRouter.fetchFriends.invalidate()
                },
              }
            )
          }}
        >
          {!cancellingRequest ? "Cancel Request" : "loading..."}
        </button>
      )
    } else if (requestButtonState.showRespond) {
      return (
        <Dialog>
          <DialogTrigger>
            <button className="bg-gradient-to-r  bg-blue-500 hover:from-blue-600 hover:to-blue-500  px-0 py-2 sb:px-2 sbb:py-2 sbb:px-2 sb:py-2 tb:px-4 tb:py-2  text-white rounded transition duration-200 mr-2">
              Respond +
            </button>
            <DialogContent className="max-w-xs">
              <DialogHeader>
                <DialogTitle>How do you want to respond?</DialogTitle>
                <DialogDescription className="mt-2">
                  <button
                    className="bg-gradient-to-r  bg-blue-500 hover:from-blue-600 hover:to-blue-500  px-0 py-2 sb:px-2 sbb:py-2 sbb:px-2 sb:py-2 tb:px-4 tb:py-2  text-white rounded transition duration-200 mr-2"
                    onClick={() => {
                      acceptFriendRequest(
                        { senderId: userId },
                        {
                          onSuccess: () => {
                            toast({
                              variant: "default",
                              title: "Request Accepted",
                              description:
                                "The friend request has been accepted",
                            })
                            utils.profileRouter.fetchFriendRequests.invalidate()
                            utils.profileRouter.fetchFriends.invalidate()
                          },
                          onError: () => {
                            toast({
                              variant: "destructive",
                              title: "Error Accepting Request",
                              description:
                                "The friend request was not accepted due to a server error",
                            })
                          },
                        }
                      )
                    }}
                  >
                    {accpetingFriendRequest ? "loading..." : "Accept"}
                  </button>
                  <button
                    className="bg-gradient-to-r  bg-red-500 hover:from-red-600 hover:to-red-500  px-0 py-2 sb:px-2 sbb:py-2 sbb:px-2 sb:py-2 tb:px-4 tb:py-2  text-white rounded transition duration-200 mr-2"
                    onClick={() => {
                      rejectRequest(
                        { userId },
                        {
                          onSuccess: () => {
                            toast({
                              variant: "default",
                              title: "Request Rejected",
                              description:
                                "The friend request has been rejected",
                            })
                            utils.profileRouter.fetchFriendRequests.invalidate()
                            utils.profileRouter.fetchFriends.invalidate()
                          },
                          onError: () => {
                            toast({
                              variant: "destructive",
                              title: "Error Rejecting Request",
                              description:
                                "The friend request was not rejecting due to a server error",
                            })
                          },
                        }
                      )
                    }}
                  >
                    {rejectingRequest ? "loading..." : "Reject"}
                  </button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </DialogTrigger>
        </Dialog>
      )
    } else if (requestButtonState.showRequest) {
      return (
        <button
          className="bg-gradient-to-r  bg-blue-500 hover:from-blue-600 hover:to-blue-500  px-0 py-2 sb:px-2 sbb:py-2 sbb:px-2 sb:py-2 tb:px-4 tb:py-2  text-white rounded transition duration-200 mr-2"
          onClick={() => {
            sendFriendRequest(
              { receiverId: userId },
              {
                onSuccess: () => {
                  utils.profileRouter.fetchFriendRequests.invalidate()
                  utils.profileRouter.fetchFriends.invalidate()
                },
                onError: () => {
                  toast({
                    variant: "destructive",
                    title: "Server Error",
                    description: "An error occurred sending request",
                  })
                },
              }
            )
          }}
        >
          {!sendingRequest ? "Request +" : "loading..."}
        </button>
      )
    }

    return null
  }

  return (
    <Layoutpage>
      <div className="bg-white relative  -mt-6 pt-0 p-4 pl-2 tb:pl-32 pr-3  lggg:ml-[20px] md:w-[680px] mdc:w-[800px] mdd:w-[930px] lg:w-[950px] mddd:w-[730px] lgg:w-[900px] lggg:w-9/12">
        <div className="w-full h-72 rounded-md  relative bg-gray-100">
          {coverImageResponse?.coverImage && (
            <img
              src={coverImageResponse?.coverImage.url}
              alt="Cover"
              className="w-full h-72 object-cover rounded-md"
            />
          )}
          {userId === user?.id && (
            <div className="absolute right-0 bottom-0 p-1 border-4 border-white rounded-full bg-gray-50">
              <Camera
                className="cursor-pointer"
                onClick={() => triggerFileInput(coverPhotoInputRef)}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageUpload}
            ref={coverPhotoInputRef}
            className="hidden"
          />
        </div>

        <div className="w-32 h-32 bg-gray-100 rounded-full ml-2 tb:ml-4 -mt-10 border-4 border-white relative">
          <img
            src={userFromBackend?.user.imageUrl}
            alt="Profile"
            className="w-full h-full object-cover rounded-full border border-black"
          />
          {userId === user?.id && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                ref={profilePhotoInputRef}
                className="hidden"
              />
            </>
          )}
        </div>
        <div className="-mt-20 -ml-6 tb:-ml-6">
          <h2 className="text-xl font-bold ml-[170px]">
            {userFromBackend?.user.fullname}
          </h2>
          <p className="text-gray-500 ml-[170px]">
            {`@${userFromBackend?.user.username}`}
          </p>
          <p className="text-sm text-gray-700 mt-2 ml-[10.6rem]">
            {userFromBackend?.user.bio + ""}
          </p>
        </div>
        <div className="text-sm text-gray-700 mt-7 tb:ml-[65px] ml-12">
          {userId === user?.id ? (
            <p> {userFromBackend?.friendCount ?? 0} friends</p>
          ) : (
            <p>
              {(otherUserFriends?.friendsWithUserInfo &&
                otherUserFriends?.friendsWithUserInfo.length) ??
                0}{" "}
              friends
            </p>
          )}
        </div>
        <div className="flex absolute right-3 bottom-32 ">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 shadow-lg mr-32">
              <DropdownMenuItem className="flex gap-2 items-center cursor-pointer p-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <button className="text-sm font-medium">Delete Account</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-3  w-[340px] ">
          <div className="flex absolute right-0 bottom-10  ">
            {showRequestButton()}
            {userId === user?.id && (
              <button
                className=" hover:from-purple-500 hover:to-blue-500 text-[11px] sbb:text-sm text-white mr-2 px-3 py-1 sb:px-2 sbb:px-4 sbb:py-2 rounded transition duration-200"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #086972, #44679F, #005691, #004A7C, #22577E)",
                }}
                onClick={handleOpenModal}
              >
                + Story
              </button>
            )}
            {userId === user?.id && (
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-[11px] sbb:text-sm text-white px-3 py-1 sb:px-2 sbb:px-4 sbb:py-2 rounded transition duration-200"
                onClick={handleOpenEditModal}
              >
                Edit profile
              </button>
            )}
          </div>
        </div>
        <div className="border-t bg-gradient-to-r from-blue-500 to-purple-500  my-4 mt-16 tbb:mt-12 md:mt-16 mdd:mt-10"></div>
      </div>
      <Modal isOpen={showEditModal} close={handleCloseEditModal}>
        <EditProfileModal close={handleCloseEditModal} />
      </Modal>
      <Modal isOpen={showModal} close={handleCloseModal}>
        <StoryModal close={handleCloseModal} />
      </Modal>
      <ProfilePageLinks
        setActiveLink={setActiveLink}
        profilePageUserId={userId}
        loggedInUserId={user.id}
      />
      <ProfileDetails
        activeLink={activeLink}
        userId={userId}
        userFromBackend={userFromBackend}
        isLoading={loadingUser}
        errorLoadingUser={errorLoadingUser}
      />
    </Layoutpage>
  )
}

export default UserProfilePage
