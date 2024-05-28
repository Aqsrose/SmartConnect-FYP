"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/server/trpc/client";
import { Loader2, X } from "lucide-react";

const boostSchema = z.object({
  // Define the schema according to your form requirements
  postId: z.string(),
});

type BoostSchema = z.infer<typeof boostSchema>;

interface BoostModalProps {
  close: () => void;
}

const BoostModal: React.FC<BoostModalProps> = ({ close }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoostSchema>({
    resolver: zodResolver(boostSchema),
  });

  const { mutate, isLoading } = trpc.postRouter.createPost.useMutation();

  const handleAdPostModal: SubmitHandler<BoostSchema> = async (data) => {
    setLoading(true);
   
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
        <h2 className="text-xl font-semibold mb-4">Boost Your Post</h2>
        <form onSubmit={handleSubmit(handleAdPostModal)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="postId">
              Post ID
            </label>
            <input
              id="postId"
              type="text"
              className="form-input w-full border border-gray-500"
              {...register("postId")}
            />
            {errors.postId && (
              <p className="text-red-500 text-sm mt-1">{errors.postId.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#6F8AE1] hover:bg-[#349E8D] px-4 py-2 text-white rounded transition duration-200"
            >
              {loading || isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Boost"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoostModal;
