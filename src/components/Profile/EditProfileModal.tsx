"use client"

import React, { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Modal from "@/components/Modal"
import { Loader2 } from "lucide-react"
import { trpc } from "@/server/trpc/client"

const eventSchema = z.object({
  // accountname: z.string(),
  // username: z.string(),
  bio: z.string(),
})

type EventSchema = z.infer<typeof eventSchema>

interface EditModalProps {
  close: () => void
}

const EditProfileModal: React.FC<EditModalProps> = ({ close }) => {
  const [loading, setLoading] = useState(false)

  const utils = trpc.useUtils()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
  })

  const {
    mutate: updateUserBio,
    isLoading: updatingUserBio,
    isError: errorUpdatingUserBio,
  } = trpc.profileRouter.updateUserBio.useMutation()

  //this is exactly what I wanted
  const handleEditProfile: SubmitHandler<EventSchema> = async (data) => {
    console.log("data: ", data)
    const { bio } = data
    updateUserBio(
      { bio },
      {
        onSuccess: () => {
          utils.profileRouter.fetchUserInfo.invalidate()
          close()
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit(handleEditProfile)}>
          {/* <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="AccountName">
              Account Name
            </label>
            <input
              id="AccountName"
              type="text"
              className="form-input w-full border border-gray-500"
              {...register("accountname")}
            />
            {errors.accountname && (
              <p className="text-red-500 text-sm mt-1">{errors.accountname.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="Username">
              Username
            </label>
            <input
              id="Username"
              type="text"
              className="form-input w-full border border-gray-500"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div> */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="Bio">
              Bio
            </label>
            <input
              id="Bio"
              type="text"
              className="form-input w-full border border-gray-500"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={close}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
            >
              {updatingUserBio ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal
