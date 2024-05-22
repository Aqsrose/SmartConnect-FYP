"use client"
import Navbar from "@/components/Navbar"
import { UserProfile, useClerk, useUser } from "@clerk/nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trpc } from "@/server/trpc/client"
import Post from "@/components/Post"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Camera, Loader2, Pencil, ChevronDown } from "lucide-react"
import useNFTMarketplace from "@/web3/useMarketplace"
import NFTCard from "@/components/marketpalce/NFTCard"
import { Button } from "@/components/ui/button"
import getSignedUrls from "@/app/actions/getSignedUrls"
import { toast } from "@/components/ui/use-toast"
import Layoutpage from "@/components/Navbar/Layout"
import React, { useState, useRef, ChangeEvent } from "react"
import ProfilePageLinks from "@/components/Profile/profilePageLinks"
import ProfileDetails from "@/components/Profile/profileDetails"

interface PageProps {
  params: {
    userId: string
  }
}

const OtherUserProfilePage = ({ params: { userId } }: PageProps) => {
  const { user } = useUser()
  const utils = trpc.useUtils()
  const [activeLink, setActiveLink] = useState<string>("")

  const coverImageElement = useRef<HTMLInputElement | null>(null)

  const { data: userFromBackend } = trpc.profileRouter.fetchUserInfo.useQuery({
    userId,
  })

  const {
    data: requests,
    isLoading: loadingRequests,
    isError: requestsError,
  } = trpc.profileRouter.fetchFriendRequests.useQuery()

  const { data: friends, isFetched: friendsFetched } =
    trpc.profileRouter.fetchFriends.useQuery({ userId })

  console.log("friends: ", friends)

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
    } else if (!isFriend) {
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
  

  if (!user) {
    return (
      <div className="flex flex-col w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-sm shadow-lg p-6 gap-6 animate-pulse">
        <header className="flex flex-col gap-6">
          <Skeleton className="w-full h-36 relative bg-gray-200 dark:bg-gray-700 rounded-md" />
          <div className="flex items-center gap-6">
            <Skeleton className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex flex-col">
              <Skeleton className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
              <Skeleton className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mt-4" />
              <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-4" />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-around items-center text-gray-800 dark:text-gray-200">
              <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </header>
        <main className="flex flex-col gap-6">
          <div>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <Skeleton className="h-64 bg-gray-200 dark:bg-gray-700 rounded-md" />
              <Skeleton className="h-64 bg-gray-200 dark:bg-gray-700 rounded-md" />
            </section>
          </div>
          <div>
            <section className="flex flex-col gap-6 mt-10">
              <Skeleton className="h-64 bg-gray-200 dark:bg-gray-700 rounded-md" />
            </section>
          </div>
        </main>
      </div>
    )
  }

  const showRequestButton = () => {
    if (requestButtonState.showCancel) {
      return (
        <button
        className=" hover:from-blue-600 hover:to-blue-500  px-0 py-2 sb:px-2 sbb:py-2 sbb:px-2 sb:py-2 tb:px-4 tb:py-2  text-white rounded transition duration-200 mr-2" style={{ backgroundImage: 'linear-gradient(to right, #086972, #44679F, #005691, #004A7C, #22577E)' }}
        onClick={() => {}}
      >
        Respond +
      </button>
    )
  } else if (requestButtonState.showRequest) {
    return (
      <button
        className=" hover:from-blue-600 hover:to-blue-500  px-0 py-2 sb:px-2 sbb:py-2 sbb:px-2 sb:py-2 tb:px-4 tb:py-2  text-white rounded transition duration-200 mr-2" style={{ backgroundImage: 'linear-gradient(to right, #086972, #44679F, #005691, #004A7C, #22577E)' }}
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
        <div className="bg-white relative h-[430px] -mt-6 pt-0 p-4 pl-2 tb:pl-32 pr-3 tb:ml-[130px] md:ml-[160px] md:w-[540px] mdc:w-[570px] mdd:w-[720px] lg:w-[750px] mddd:w-[600px] lgg:w-[750px] lggg:w-[1000px]">
      
        <div className="w-full h-72 rounded-md  bg-gray-100 absolute top-0 left-0">
            {coverImageResponse?.coverImage && (
            <img
              src={coverImageResponse?.coverImage.url}
              alt="Cover"
              className="w-full h-72 object-cover rounded-md"
            />
          )}
           </div>
        <div className="absolute left-2 bottom-8">
        <div className="w-32 h-32 bg-gray-100 rounded-full ml-2 tb:ml-4 -mt-10 border-4 border-white relative">
          <img
            src={userFromBackend?.user.imageUrl}
            alt="Profile"
            className="w-full h-full object-cover rounded-full border border-black"
          />
         
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
          <p> 0 friends </p>
        </div>
        </div>
        
        <div className="mt-3  w-[340px] ">
          <div className="flex  absolute   right-0 bottom-8  ">
            {showRequestButton()}
            <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 hidden tbbb:block text-white px-4 py-2 rounded transition duration-200"
          >
            Share
          </button>
            </div>
          </div>
          <div className="border-t bg-gradient-to-r from-blue-500 to-purple-500  my-4  "></div>
     </div>
      <ProfilePageLinks setActiveLink={setActiveLink} />
      <ProfileDetails activeLink={activeLink} />
    </Layoutpage>
  )
}

export default OtherUserProfilePage
