"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import StoryModal from "./storyModal";
import Modal from "../Modal";
import Link from "next/link";
import { trpc } from "@/server/trpc/client";

const CreateStory: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const { data } = trpc.storyRouter.fetchUserStories.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPageResponse) => lastPageResponse.nextCursor,
    }
  );

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
      }
    };

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener('scroll', checkScroll);
      checkScroll(); // Check on mount
    }

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="pl-2 pt-4 pr-3 md:pt-3">
      <div className="w-[220px] relative sbb:w-[280px] tb:w-[260px] tbbb:w-[330px] tbb:w-[490px] ml-[7px] sb:ml-[10px] sbb:ml-[10px] tb:ml-[10px] tbbb:ml-[10px] tbb:ml-[10px] h-24 pl-3 pt-2 pb-3 rounded-md mb-4 border border-gray-200">
        {canScrollLeft && (
          <div className="absolute top-1/2 -translate-y-1/2 left-2 w-7 h-7 bg-white border border-gray-700 rounded-full cursor-pointer flex items-center justify-center" onClick={scrollLeft}>
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </div>
        )}
        <div ref={scrollContainerRef} className="flex gap-2 overflow-x-auto no-scrollbar">
          <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full overflow-hidden border-2 border-[#003C43]">
            <Link href="/story">
              <img
                src="/Images/Ai.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
          <div
            className="flex-shrink-0 w-5 h-5 mt-12 -ml-5 bg-[#003C43] rounded-full cursor-pointer"
            onClick={handleOpenModal}
          >
            <Plus className="w-5 h-5 p-1 text-white font-bold" />
          </div>

          {data?.pages.map((response) =>
            response.stories.map((story) => {
              return (
                <div key={story.userId} className="flex flex-col items-center flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#003C43]">
                    <Link
                      href={`/story/${story.userId}/${story.stories[0].story.id}`}
                    >
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
              );
            })
          )}
        </div>
        {canScrollRight && (
          <div className="absolute top-1/2 -translate-y-1/2 right-2 w-7 h-7 bg-white border border-gray-700 rounded-full cursor-pointer flex items-center justify-center" onClick={scrollRight}>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </div>
        )}
        <p className="text-gray-500 text-[10px] pl-3 w-16 -mt-4">Your Story</p>
      </div>
      <Modal isOpen={showModal} close={handleCloseModal}>
        <StoryModal close={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default CreateStory;
