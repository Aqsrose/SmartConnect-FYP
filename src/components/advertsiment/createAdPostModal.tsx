"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { trpc } from "@/server/trpc/client";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

const eventSchema = z.object({
  text: z.string(),
  image: z.string().optional(),
  link: z.string().optional(),
});

type AdSchema = z.infer<typeof eventSchema>;

interface AdModalProps {
  close: () => void;
}

const CreateAdPostModal: React.FC<AdModalProps> = ({ close }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdSchema>({
    resolver: zodResolver(eventSchema),
  });

  const { mutate, isLoading } = trpc.postRouter.createPost.useMutation();

  const handleAdPostModal: SubmitHandler<AdSchema> = async (data) => {
    setLoading(true);
    try {
      // Handle the form data, including file uploads
      // For now, let's just log the form data
      console.log(data);
      console.log(selectedFiles);

      // Reset form and file input
      setSelectedFiles([]);
      close();
    } catch (error) {
      console.error("Error creating ad:", error);
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-xl font-semibold mb-4">Create Ad</h2>
        <form onSubmit={handleSubmit(handleAdPostModal)}>
          <div className="mb-4">
            <Textarea
              placeholder="Enter text"
              {...register("text")}
              rows={1}
              className="mt-2 "
            />
            <Textarea
              placeholder="Link"
              {...register("link")}
              rows={1}
              className="mt-2 "
            />
          </div>
          <div className="mt-3">
            <div className="h-full w-full">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-2 rounded-md border w-full">
                  {selectedFiles.map((file, index) => {
                    const url = URL.createObjectURL(file);
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
                          onClick={() => {
                            const updatedFiles = selectedFiles.filter(
                              (_, i) => i !== index
                            );
                            setSelectedFiles(updatedFiles);
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
                    );
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
                onChange={handleFileChange}
              />
            </label>
            <button
              type="submit"
              className="bg-[#6F8AE1] hover:bg-[#349E8D] px-4 py-2 text-white rounded transition duration-200 mr-2"
            >
              {loading || isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create Ad"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdPostModal;
