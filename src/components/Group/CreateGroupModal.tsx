import { trpc } from "@/server/trpc/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "../ui/use-toast"
import { z } from "zod"

const groupSchema = z.object({
  name: z.string(),
  description: z.string(),
  privacy: z.string()
})

function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const {
    mutate: createGroup,
    isLoading,
    isError,
  } = trpc.groupRouter.createGroup.useMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(groupSchema),
  })

  const handleCreateGroup = (data: any) => {
    console.log("data: ", data)
    createGroup(data, {
      onError: () => {
        toast({
          title: "An error occurred",
          description: "Something went wrong dawg",
          variant: "destructive",
        })
      },
      onSuccess: () => {
        toast({
          title: "Group successfully created",
          description: "Group has been created successfully",
          variant: "default",
        })
        onClose()
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md tb:ml-24">
        <h2 className="text-xl font-semibold mb-4">Create a New Group</h2>
        <form onSubmit={handleSubmit(handleCreateGroup)}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="groupName"
            >
              Group Name
            </label>
            <input
              id="groupName"
              type="text"
              className="form-input w-full border border-gray-100"
              required
              {...register("name")}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1 "
              htmlFor="groupDescription"
            >
              Description
            </label>
            <textarea
              id="groupDescription"
              className="form-textarea w-full border border-gray-100"
              rows={3}
              required
              {...register("description")}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Privacy</label>
            <div className="flex gap-4">
              <div>
                <input
                  {...register("privacy")}
                  id="public"
                  type="radio"
                  value="public"
                  defaultChecked
                />
                <label htmlFor="public" className="ml-2">
                  Public
                </label>
              </div>
              <div>
                <input
                  {...register("privacy")}
                  id="private"
                  type="radio"
                  value="private"
                />
                <label htmlFor="private" className="ml-2">
                  Private
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default CreateGroupModal
