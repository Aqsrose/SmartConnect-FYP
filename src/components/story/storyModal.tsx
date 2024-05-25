"use client"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Trash2 } from "lucide-react"
import Image from "next/image"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { trpc } from "@/server/trpc/client"
import { useState, useRef } from "react"
import { Input } from "../ui/input"
import { toast } from "../ui/use-toast"
import getSignedUrls from "@/app/actions/getSignedUrls"
import { useUser } from "@clerk/nextjs"

const storySchema = z.object({
  image: z.any(),
  // image: z.any()
})

type StorySchemaType = z.infer<typeof storySchema>

interface StoryModalProps {
  close: () => void
}

const StoryModal: React.FC<StoryModalProps> = ({ close }) => {
  const { user } = useUser()

  const utils = trpc.useUtils()

  const {
    mutate: createStory,
    isLoading: creatingStory,
    isError: errorCreatingStory,
  } = trpc.storyRouter.createStory.useMutation()

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files))
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updatedFiles)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

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

  const handleStoryUpload = async () => {
    if (selectedFiles.length === 0) {
      console.log("Cannot post bro...")
      setLoading(false)
      return
    }
    if (user) {
      let error = false
      setLoading(true)
      const checksum = await computeSHA256(selectedFiles[0])

      let response
      try {
        response = await getSignedUrls(
          [selectedFiles[0].type],
          [selectedFiles[0].size],
          [checksum],
          user?.id
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
            return //--> this should return from main uploadPost function
            //show error toast and delete files from s3 (maybe make another server action to do that!)
            //send the media urls array other than the index that errored out
          }
        }
      }
      console.log("file: ", selectedFiles)

      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      createStory(
        { mediaType: selectedFiles[0].type, mediaUrl: mediaUrls[0], expiresAt },
        {
          onSuccess: () => {
            toast({
              color: "green",
              title: "Post created.",
              description: "Your post was created successfully.",
            })
            utils.storyRouter.fetchUserStories.invalidate()

            setSelectedFiles([])
            setLoading(false)
            close()
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
  }

  return (
    <>
      <div className="mb-4">
        <Input
          className="mt-1 block w-full text-green-500"
          type="file"
          accept="image/*,video/mp4,video/webm"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </div>
      <div className="mt-3">
        <div className="h-full w-full">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 rounded-md border w-full">
              {selectedFiles.map((file, index) => {
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
                        src={url}
                        width={130}
                        height={130}
                        controls
                        onLoad={() => URL.revokeObjectURL(url)}
                        className="relative aspect-square object-cover rounded-md shadow-md"
                      />
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      disabled={creatingStory}
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
      <div className="flex justify-end gap-4 mt-3">
        <button
          type="button"
          className="px-4 py-2 bg-gradient-to-r bg-blue-500 hover:from-purple-500 hover:to-blue-500 rounded text-white"
          onClick={close}
        >
          Cancel
        </button>
        <button
          onClick={handleStoryUpload}
          className="px-4 py-2 bg-gradient-to-r from-[#003C43] to-[#1B3C73] text-white rounded hover:bg-[#344955]"
          disabled={selectedFiles.length === 0}
        >
          {loading || creatingStory ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Upload"
          )}
        </button>
      </div>
    </>
  )
}

export default StoryModal
