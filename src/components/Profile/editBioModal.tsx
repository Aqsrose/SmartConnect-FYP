"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { trpc } from "@/server/trpc/client";
import { toast } from "../ui/use-toast";

const bioSchema = z.object({
  university: z.string(),
  from: z.string(),
  relationshipStatus: z.string(),
  isPublic: z.string(),
});

type BioSchema = z.infer<typeof bioSchema>;

interface BioModalProps {
  close: () => void;
}

const EditBioModal: React.FC<BioModalProps> = ({ close }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BioSchema>({
    resolver: zodResolver(bioSchema),
  });

  const handleAdPostModal: SubmitHandler<BioSchema> = async (data) => {
    editProfile(data, {
      onSuccess: () => {
        utils.profileRouter.fetchUserInfo.invalidate();
        toast({
          variant: "default",
          title: "Success",
          description: "Profile updated successfully",
        });
        close();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while updating profile",
        });
      },
    });
  };

  const {
    mutate: editProfile,
    isLoading: editingProfile,
    isError: errorEditingProfile,
  } = trpc.profileRouter.editProfile.useMutation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
          onClick={close}
        >
          <X className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Bio</h2>
        <form onSubmit={handleSubmit(handleAdPostModal)}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="university"
            >
              University
            </label>
            <input
              id="university"
              type="text"
              className="form-input w-full border border-gray-500"
              {...register("university")}
            />
            {errors.university && (
              <p className="text-red-500 text-sm mt-1">
                {errors.university.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="from">
              Location
            </label>
            <input
              id="location"
              type="text"
              className="form-input w-full border border-gray-500"
              {...register("from")}
            />
            {errors.from && (
              <p className="text-red-500 text-sm mt-1">{errors.from.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="status">
              Status
            </label>
            <input
              id="status"
              type="text"
              className="form-input w-full border border-gray-500"
              {...register("relationshipStatus")}
            />
            {errors.relationshipStatus && (
              <p className="text-red-500 text-sm mt-1">
                {errors.relationshipStatus.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="isPublic"
            >
              Account Visibility
            </label>
            <label htmlFor=""> Public</label>
            <input
              id="isPublic"
              type="radio"
              value="public"
              className="form-input w-fit border border-gray-500 ml-3 mr-2"
              {...register("isPublic")}
            />
            <label htmlFor=""> Private</label>
            <input
              id="isPublic"
              type="radio"
              value="private"
              className="form-input w-fit border border-gray-500 ml-3"
              {...register("isPublic")}
            />
            {errors.isPublic && (
              <p className="text-red-500 text-sm mt-1">
                {errors.isPublic.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#6F8AE1] hover:bg-[#349E8D] px-4 py-2 text-white rounded transition duration-200"
          >
            {editingProfile ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBioModal;
