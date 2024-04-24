"use client"
import Navbar from "@/components/Navbar"
import { UserProfile, useClerk, useUser } from "@clerk/nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trpc } from "@/server/trpc/client"
import Post from "@/components/Post"
import { useInView } from "react-intersection-observer"
import { useEffect} from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Camera, Loader2, Pencil,ChevronDown } from "lucide-react"
import useNFTMarketplace from "@/web3/useMarketplace"
import NFTCard from "@/components/marketpalce/NFTCard"
import { Button } from "@/components/ui/button"
import getSignedUrls from "@/app/actions/getSignedUrls"
import { toast } from "@/components/ui/use-toast"
import Layoutpage from "@/components/Navbar/Layout"
import React, { useState, useRef, ChangeEvent } from "react";
import ProfilePageLinks from '@/components/Profile/profilePageLinks';
import ProfileDetails from "@/components/Profile/profileDetails"

interface PageProps {
  params: {
    userId: string
  }
}

const UserProfilePage = ({ params: { userId } }: PageProps) => {
  const { user } = useUser()
  const [activeLink, setActiveLink] = useState<string>('');

  const coverImageElement = useRef<HTMLInputElement | null>(null)

  const { data: userFromBackend } = trpc.profileRouter.fetchUserInfo.useQuery({
    userId,
  })
  
  const { data: friends } = trpc.profileRouter.fetchFriends.useQuery({ userId })

  console.log("friends: ", friends)

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
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);

  const handleCoverPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverPhoto(URL.createObjectURL(file));
    }
  };

  const handleProfilePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setProfilePhoto(fileURL);
      localStorage.setItem('profilePhoto', fileURL);
    }
  };

  const triggerFileInput = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.click();
  };


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

  console.log("user: ", userFromBackend)

  return (
    <Layoutpage>

      <div className="bg-white -mt-6 pt-0 p-4 pl-2 tb:pl-32 pr-3 md:pl-64 md:pr-20">
        <div className="w-full h-72 rounded-md  relative bg-gray-100">
          {coverImageResponse?.coverImage && (
            <img
              src={coverImageResponse?.coverImage.url}
              alt="Cover"
              className="w-full h-72 object-cover rounded-md"
            />
          )}
          <div className="absolute right-0 bottom-0 p-1 border-4 border-white rounded-full bg-gray-50">
            <Camera
              className="cursor-pointer"
              onClick={() => triggerFileInput(coverPhotoInputRef)}
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverPhotoChange}
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
          <div className="absolute right-0 bottom-0 p-1 border-4 border-white rounded-full bg-gray-50">
            <Pencil
              className="cursor-pointer"
              onClick={() => triggerFileInput(profilePhotoInputRef)}
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            ref={profilePhotoInputRef}
            className="hidden"
          />
        </div>
        <div className="-mt-20 -ml-6 tb:-ml-6">
          <h2 className="text-xl font-bold ml-[170px]">
            {userFromBackend?.user.fullname}
          </h2>
          <p className="text-gray-500 ml-[170px]">
            {`@${userFromBackend?.user.username}`}
          </p>
          <p className="text-sm text-gray-700 mt-2 ml-32">
            {userFromBackend?.user.bio + ""}
          </p>
        </div>
        <div className="text-sm text-gray-700 mt-7 tb:ml-[65px] ml-12">
          <p> 0 friends </p>
        </div>
        <div className="mt-3 ml-[45px]">
        <div className="absolute right-0 mr-2 sbb:-mt-1 -mt-1  tb:mt-1 tbb:-mt-9 mdd:-mt-10 md:-mt-1 md:mr-20 tbb:mr-4 xd:-mt-20 xd:mr-20 flex ">
          <button
            className="bg-gradient-to-r  bg-blue-500 hover:from-blue-600 hover:to-blue-500  px-0 py-2 sb:px-2 sbb:py-2 sbb:px-2 sb:py-2 tb:px-4 tb:py-2  text-white rounded transition duration-200 mr-2"
          >
           Request +
          </button>
          <button
            className="bg-gradient-to-r bg-gray-500 hover:from-gray-600 hover:to-gray-600  text-white px-4 py-2 rounded transition duration-200"
          >
            Edit profile
          </button>
          <div className="ml-2">
          <button
            className="bg-gradient-to-r bg-gray-400 hover:from-gray-500 hover:to-gray-500  text-white px-4 py-2 rounded transition duration-200 "
          >
            <ChevronDown />
          </button></div>
        </div>
        </div>
        <div className="border-t border-gray-400  my-4 mt-16 tbb:mt-12 md:mt-16 mdd:mt-10"></div>
      </div>
      <ProfilePageLinks setActiveLink={setActiveLink}/>
      <ProfileDetails activeLink={activeLink} />
    </Layoutpage>
  )
}

export default UserProfilePage
