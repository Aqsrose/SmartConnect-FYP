'use client'
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { trpc } from '@/server/trpc/client';
import { useState, useRef } from 'react';

const storySchema = z.object({
  image: z.instanceof(FileList).refine((files) => files.length === 1, 'Upload an image.'),
});

type StorySchemaType = z.infer<typeof storySchema>;

interface StoryModalProps {
  close: () => void;
}

const StoryModal: React.FC<StoryModalProps> = ({ close }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<StorySchemaType>({
    resolver: zodResolver(storySchema),
  });
  const utils = trpc.useUtils();
  const { mutate, isLoading } = trpc.postRouter.createPost.useMutation();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit: SubmitHandler<StorySchemaType> = async (data) => {
    console.log(data);
    reset();
    setSelectedFiles([]);
    close();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <div className="mb-4">
        <input
          type="file"
          id="image"
          {...register('image')}
          className="mt-1 block w-full text-green-500"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        {errors.image && <span className="text-red-600 text-sm">{errors.image.message}</span>}
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
                      onClick={() => removeFile(index)}
                      disabled={isLoading}
                      title="remove media"
                      aria-label="remove media"
                      className="absolute z-50 bottom-2 left-2 bg-black opacity-50 rounded-md p-1 hover:opacity-95"
                    >
                      <Trash2 aria-label="hidden" className="h-4 w-4 text-white" />
                    </button>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-3">
        <button type="button" className="px-4 py-2 bg-gradient-to-r bg-blue-500 hover:from-purple-500 hover:to-blue-500 rounded text-white" onClick={close}>Cancel</button>
        <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#003C43] to-[#1B3C73] text-white rounded hover:bg-[#344955]">Upload</button>
      </div>
    </form>
  );
};

export default StoryModal;
