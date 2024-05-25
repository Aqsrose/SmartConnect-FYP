"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import StoryModal from "./storyModal"
import Modal from "../Modal"
import Link from "next/link"
import { trpc } from "@/server/trpc/client"

const CreateStory: React.FC = () => {
  const [showModal, setShowModal] = useState(false)

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const { data } = trpc.storyRouter.fetchUserStories.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPageResponse) => lastPageResponse.nextCursor,
    }
  )

  console.log("stories: ", data)

  return (
    <div className="pl-2 pt-4 pr-3 md:pt-3">
      <div className="w-[220px] sbb:w-[280px] tb:w-[260px] tbbb:w-[330px] tbb:w-[490px] ml-[7px] sb:ml-[10px] sbb:ml-[10px] tb:ml-[10px] tbbb:ml-[10px] tbb:ml-[10px] h-24 pl-3 pt-2 pb-3 rounded-md mb-4 border border-gray-200">
        <div className="flex flex-wrap gap-2">
          <div className="w-16 h-16 bg-white rounded-full overflow-hidden border-2 border-[#003C43]">
            <Link href="/story">
              <img
                src="/Images/Ai.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
          <div
            className="w-5 h-5 mt-12 -ml-5 bg-[#003C43] rounded-full cursor-pointer"
            onClick={handleOpenModal}
          >
            <Plus className="w-5 h-5 p-1 text-white font-bold" />
          </div>

          {data?.pages.map((response) =>
            response.stories.map((story) => {
              return (
                <div key={story.userId}>
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#003C43]">
                    <Link href={`/story/${story.userId}/${story.stories[0].story.id}`}>
                      <img
                        src={story.stories[0].story.mediaUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  </div>
                  <p className="text-gray-500 text-[10px] min-w-16 text-center mt-2">
                    {story.stories[0].user.username}
                  </p>
                </div>
              )
            })
          )}
        </div>
        <p className="text-gray-500 text-[10px] pl-3 w-16 -mt-4">Your Story</p>
      </div>
      <Modal isOpen={showModal} close={handleCloseModal}>
        <StoryModal close={handleCloseModal} />
      </Modal>
    </div>
  )
}

export default CreateStory
