"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/server/trpc/client";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

const boostSchema = z.object({
  postId: z.string(),
  description: z.string().nonempty("Description is required"),
  date: z.string().nonempty("Date is required"),
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
    try {
      // Handle the form data
      console.log(data);
    } catch (error) {
      console.error("Error boosting post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-sm tbbb:max-w-lg relative max-h-[500px] overflow-y-auto">
        <button
          className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
          onClick={close}
        >
          <X className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Boost Your Post
        </h2>
        <form onSubmit={handleSubmit(handleAdPostModal)}>
          <div className="flex flex-col items-center p-6 ">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full flex flex-col tbbb:flex-row mb-5">
              <div className="flex-grow mb-4 md:mb-0 md:w-2/3">
                <p className="text-gray-600 mb-2">Published on 2024-05-28</p>
                <div className="border-t bg-gray-500 mb-3 mt-3"></div>
                <p className="text-gray-800 mb-2">Description</p>

                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ">
                  {loading || isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Boost Post"
                  )}
                </button>
              </div>

              <div className="relative w-32 h-32">
                <Image
                  src="/Images/Ai.jpg"
                  alt="Post Image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoostModal;
