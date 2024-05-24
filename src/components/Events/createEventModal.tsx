"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { FieldValues, useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import Modal from "@/components/Modal"
import getSignedUrls from "@/app/actions/getSignedUrls"
import { useUser } from "@clerk/nextjs"
import { trpc } from "@/server/trpc/client"
import { toast } from "../ui/use-toast"
import { Loader2 } from "lucide-react"

const eventSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string(),
  location: z.string(),
  time: z.string(),
  image: z.any(),
})

type EventSchemaType = z.infer<typeof eventSchema>

const CreateEventModal = ({ close }: { close: () => void }) => {
  const { user } = useUser()

  const [showModal, setShowModal] = useState(false)

  const [uploadingImage, setUploadingImage] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<EventSchemaType>({
    resolver: zodResolver(eventSchema),
  })

  const {
    mutate: createEvent,
    isLoading: creatingEvent,
    isError: erroCreatingEvent,
  } = trpc.eventRouter.createEvent.useMutation()

  const handleCreateEvent: SubmitHandler<EventSchemaType> = async (data) => {
    const url = await handleEventCoverImageUpload(data.image[0])

    if (url) {
      createEvent(
        {
          ...data,
          imageUrl: url,
        },
        {
          onError: () => {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong",
              description: `An internal server error occurred. Please try again later.`,
            })
          },
          onSuccess: () => {
            close()
            toast({
              title: "Success.",
              description: "Event created successfully.",
            })
          },
        }
      )
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

  const handleEventCoverImageUpload = async (image: File) => {
    setUploadingImage(true)
    if (user) {
      if (!image) {
        return
      }
      const selectedFile = image

      const checksum = await computeSHA256(selectedFile)

      const response = await getSignedUrls(
        [selectedFile.type],
        [selectedFile.size],
        [checksum],
        user.id
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
        setUploadingImage(false)
        return url
      }
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md tb:ml-24">
          <h2 className="text-xl font-semibold mb-4">Create a New Event</h2>
          <form onSubmit={handleSubmit(handleCreateEvent)}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="EventDate"
              >
                Event Date
              </label>
              <input
                id="EventDate"
                type="text"
                className="form-input w-full border border-gray-500"
                required
                {...register("date")}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="EventTime"
              >
                Event Time
              </label>
              <input
                id="EventTime"
                type="text"
                className="form-input w-full border border-gray-500"
                required
                {...register("time")}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="EventName"
              >
                Event Name
              </label>
              <input
                id="EventName"
                type="text"
                className="form-input w-full border border-gray-500"
                required
                {...register("name")}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="EventLocation"
              >
                Event Location
              </label>
              <input
                id="Location"
                type="text"
                className="form-input w-full border border-gray-500"
                required
                {...register("location")}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="EventDescription"
              >
                Description
              </label>
              <textarea
                id="EventDescription"
                className="form-textarea w-full border border-gray-500"
                rows={3}
                required
                {...register("description")}
              ></textarea>
            </div>
            <Input
              className="mt-2"
              type="file"
              accept="image/*"
              multiple={false}
              {...register("image")}
            />
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => close()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {creatingEvent || uploadingImage ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateEventModal
