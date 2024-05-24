"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import Modal from "@/components/Modal";

const eventSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string(),
  location: z.string(),
  time: z.string(),
  image: z.string(),
});

type EventSchemaType = z.infer<typeof eventSchema>;

const CreateEventModal = ({ close }: { close: () => void }) => {
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<EventSchemaType>({
    resolver: zodResolver(eventSchema),
  });

  const handleCreateEvent: SubmitHandler<EventSchemaType> = async (data) => {
    console.log("event data: ", data);
  };

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
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateEventModal;
