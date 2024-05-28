"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { trpc } from "@/server/trpc/client";

const bioSchema = z.object({
  university: z.string().optional(),
  location: z.string().optional(),
  status: z.string().optional(),
  account: z.string().optional(),
});

type BioSchema = z.infer<typeof bioSchema>;

interface BioModalProps {
  close: () => void;
}

const EditBioModal: React.FC<BioModalProps> = ({ close }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BioSchema>({
    resolver: zodResolver(bioSchema),
  });

  const { mutate, isLoading } = trpc.postRouter.createPost.useMutation();

  const handleAdPostModal: SubmitHandler<BioSchema> = async (data) => {
    setLoading(true);
   
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

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
            <label className="block text-sm font-medium mb-1" htmlFor="university">
              University
            </label>
            <input
              id="university"
              type="text"
              className="form-input w-full border border-gray-500"
              {...register("university")}
            />
            {errors.university && (
              <p className="text-red-500 text-sm mt-1">{errors.university.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              type="text"
              className="form-input w-full border border-gray-500"
              {...register("location")}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
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
              {...register("status")}
            />
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>
        
          <button
            type="submit"
            className="bg-[#6F8AE1] hover:bg-[#349E8D] px-4 py-2 text-white rounded transition duration-200"
          >
            {loading || isLoading ? (
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
