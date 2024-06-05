"use client"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ImagePlus, Loader2, Trash2 } from "lucide-react"
import Image from "next/image"
import { ChangeEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import getSignedUrls from "../../actions/getSignedUrls"
import { useUser } from "@clerk/nextjs"
import { trpc } from "@/server/trpc/client"
import { useToast } from "@/components/ui/use-toast"
import Layoutpage from "@/components/Navbar/Layout"
import GroupPostReel from "@/components/Group/GroupPostReel"
import { Skeleton } from "@/components/ui/skeleton"

interface GroupDiscussionProps {
  groupId: string
  isUserAMember: boolean | undefined
}

const GroupDiscussion = ({ groupId, isUserAMember }: GroupDiscussionProps) => {
  console.log("groupId: ", groupId)
  const { toast } = useToast()
  const utils = trpc.useUtils()
  const { mutate, isLoading } = trpc.postRouter.createPost.useMutation()

  const [loading, setLoading] = useState<boolean>(false)

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileTypes, setFileType] = useState<string[]>([])
  const [fileSizes, setFileSize] = useState<number[]>([])
  const [fileChecksums, setFileChecksum] = useState<string[]>([])

  const [caption, setCaption] = useState<string>("")

  const user = useUser()

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

  const handleCaption = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(event.target.value)
  }
  const extractHashtags = (caption: string) => {
    const regex = /(\#[a-zA-Z0-9_]+)/g
    return caption.match(regex) || []
  }

  const handleImageUploads = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files)

      if (fileArray.length > 0) {
        setSelectedFiles((prev) => [...prev, ...fileArray])
        setFileType((prev) => [...prev, ...fileArray.map((file) => file.type)])
        setFileSize((prev) => [...prev, ...fileArray.map((file) => file.size)])
        const checksums = await Promise.all(
          fileArray.map(async (file) => await computeSHA256(file))
        )

        setFileChecksum((prev) => [...prev, ...checksums])
      }
    }
  }
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
              <Skeleton className="bg-gray-200 dark:bg-gray-700 w-16 h-10 rounded " />
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

  const uploadPost = async (e: any) => {
    let error = false
    setLoading(true)
    e.preventDefault()
    if (!caption && selectedFiles.length === 0) {
      console.log("Cannot post bro...")
      setLoading(false)
      return
    }
    let response
    try {
      response = await getSignedUrls(
        fileTypes,
        fileSizes,
        fileChecksums,
        user?.user!.id
      )
    } catch (error: any) {
      if (error.cause.fileType) {
        toast({
          variant: "destructive",
          title: "Invalid file type.",
          description: `Invalid file type ${error.cause.fileType} at position ${error.cause.index}`,
        })
      } else if (error.cause.fileSize) {
        toast({
          variant: "destructive",
          title: "File size exceeded 50MB.",
          description: `Too large file size ${error.cause.fileSize} at position ${error.cause.index}`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong",
          description: `An internal server error occurred. Please try again later.`,
        })
      }
    }

    let mediaUrls: string[] = []
    if (response) {
      for (const [index, url] of response.signedUrls.entries()) {
        mediaUrls.push(url.split("?")[0])
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": selectedFiles[index].type,
          },
          body: selectedFiles[index],
        })
        if (!res.ok) {
          console.log("Res: ", res)
          toast({
            variant: "destructive",
            title: "Error uploading media.",
            description: `An internal server error occurred. Please try again later.`,
          })
          setLoading(false)
          error = true
          return //--> this should return from main uploadPost function
          //show error toast and delete files from s3 (maybe make another server action to do that!)
          //send the media urls array other than the index that errored out
        }
      }
    }
    console.log("Media urls: ", mediaUrls)

    //finally insert in database

    const hashTags = extractHashtags(caption)
    mutate(
      { caption, mediaUrls, fileTypes, hashTags, groupId },
      {
        onSuccess: () => {
          toast({
            color: "green",
            title: "Post created.",
            description: "Your post was created successfully.",
          })
          utils.postRouter.fetchAllPosts.invalidate()

          setSelectedFiles([])
          setFileType([])
          setFileSize([])
          setFileChecksum([])
          setCaption("")
          setLoading(false)
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong",
            description: `An internal server error occurred. Please try again later.`,
          })
          setLoading(false)
        },
      }
    )
  }

  return (
    <div className="flex flex-col items-center justify-center -ml-2 absolute top-2 left-4   mb-[900px]  lggg:w-[550px]">
      {isUserAMember && (
        <div className="relative w-[270px] sb:w-[310px] sbb:w-[350px] tb:w-[300px] tbbb:w-[380px] tbb:w-[550px] md:w-[550px]  lg:w-[600px] mddd:w-[560px] lgg:lg:w-[460px] lggg:w-[490px] max-w-2xl bg-white rounded-lg shadow p-2 ">
          <div className="flex">
            <div className=" w-8 h-8 rounded-full overflow-hidden bg-red mt-6 ml-3 mr-3 ">
              <img
                src={"/Images/Ai.jpg"}
                alt="Profile"
                className="object-cover"
              />
            </div>
            <div>
              <Textarea
                className="w-full border rounded-lg p-4 h-16 resize-none mt-3 tbb:w-[310px] md:w-[370px]"
                placeholder="Share your thoughts..."
                value={caption}
                onChange={handleCaption}
              />
            </div>
          </div>
          <div className="mt-3">
            <div className=" h-full w-full">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-2 rounded-md border w-full">
                  {selectedFiles?.map((file, index) => {
                    const url = URL.createObjectURL(file)
                    return (
                      <div key={index} className="shrink-0 relative">
                        {file.type.startsWith("image") ? (
                          <Image
                            width={130}
                            height={130}
                            src={url}
                            alt="post"
                            className="relative aspect-square object-cover rounded-md shadow-md"
                            onLoad={() => URL.revokeObjectURL(url)}
                          />
                        ) : (
                          <video
                            src={URL.createObjectURL(file)}
                            width={130}
                            height={130}
                            controls
                            onLoad={() => URL.revokeObjectURL(url)}
                            className="relative aspect-square object-cover rounded-md shadow-md"
                          />
                        )}
                        <button
                          onClick={() => {
                            const updatedFiles = selectedFiles.filter(
                              (_, i) => i !== index
                            )
                            setSelectedFiles(updatedFiles)
                          }}
                          disabled={loading === true}
                          title="remove media"
                          aria-label="remove media"
                          className="absolute z-50 bottom-2 left-2 bg-black opacity-50 rounded-md p-1 hover:opacity-95"
                        >
                          <Trash2
                            aria-label="hidden"
                            className="h-4 w-4 text-white"
                          />
                        </button>
                      </div>
                    )
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
          <div className="mt-2 flex w-full justify-between">
            <label
              htmlFor="mediaInput"
              title="Add media"
              className="cursor-pointer hover:cursor-pointer"
            >
              <div className="flex justify-between items-center mt-4">
                <ImagePlus className="text-green-500 cursor-pointer" />
              </div>
              <input
                id="mediaInput"
                type="file"
                className="hidden"
                multiple
                accept="image/*,video/mp4,video/webm"
                onChange={handleImageUploads}
                value=""
              />
            </label>
            <button
              onClick={uploadPost}
              disabled={
                loading || isLoading || (!caption && selectedFiles.length === 0)
              }
              className="bg-gradient-to-r  bg-[#349E8D] hover:from-[#2EC7AB] hover:to-[#349E8D] px-4 py-2  text-white rounded transition duration-200 mr-2"
            >
              {loading || isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>
      )}
      <div className=" w-full">
        <GroupPostReel groupId={groupId} />
      </div>
    </div>
  )
}

export default GroupDiscussion
