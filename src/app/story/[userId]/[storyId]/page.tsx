"use client";
import React, { useEffect, useState } from "react";
import Logo from "@/components/landingpage/Logo";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { trpc } from "@/server/trpc/client";
import { useParams, useRouter } from "next/navigation";
import { formatRelativeTime } from "@/lib/utils";

interface PageProps {
  params: {
    storyId: string;
    userId: string;
  };
}

function ViewStory() {
  const router = useRouter();

  const ids = useParams();
  const { userId, storyId } = ids;
  // console.log({storyId, userId})
  // fetchin all the user stories again
  // skip to the story that the user had clicked
  // display that story in the center of the screen
  // dispaly the previous on the left
  // display the next one on the right

  // and when the next/previous button is clicked, we point to this same page

  // const stories = [1, 2, 3, 4, 5]

  const { data, isLoading, isError } =
    trpc.storyRouter.fetchUserStories.useInfiniteQuery(
      { limit: 50 },
      {
        getNextPageParam: (lastPageResponse) => lastPageResponse.nextCursor,
      }
    );

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    if (data) {
      const allStories = data.pages.flatMap((page) =>
        page.stories.flatMap((userStories) =>
          userStories.stories.map((story) => ({
            ...story,
            userId: userStories.userId,
            user: story.user,
          }))
        )
      );

      const index = allStories.findIndex((story) => story.story.id === storyId);
      setCurrentStoryIndex(index);
    }
  }, [data, storyId]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (!data) return <div>No stories found.</div>;

  const allStories = data?.pages.flatMap((page) =>
    page.stories.flatMap((userStories) =>
      userStories.stories.map((story) => ({
        ...story,
        userId: userStories.userId,
        user: story.user,
      }))
    )
  );

  const currentStory = allStories[currentStoryIndex];
  const previousStory = allStories[currentStoryIndex - 1];
  const nextStory = allStories[currentStoryIndex + 1];

  const navigateToStory = (storyId: string, userId: string) => {
    router.push(`/story/${userId}/${storyId}`);
  };

  console.log("lets see: ", document.referrer);

  return (
    <section className="relative w-full h-full flex">
      {/* Logo */}
      <div className="absolute  left-6">
        <Logo />
      </div>

      {/* Cross Button */}
      <Link href="/home">
        <button className="absolute  right-8 text-[40px] text-green-800">
          x
        </button>
      </Link>

      {/*left Story*/}
      {previousStory && (
        <div className="bg-[#BED7DC] w-[200px] h-[250px]  blur-sm mt-60 ml-5 mdc:ml-4  mdc:-mr-44 mdd:-mr-80 mddd:ml-52 mddd:-mr-[350px] lgg:ml-56 lgg:-mr-[390px]  lggg:ml-72 lggg:-mr-[470px]  rounded hidden mdc:block ">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-red absolute top-8 left-12">
              <img
                src={previousStory.user.imageUrl}
                alt="Profile"
                className="object-cover"
              />
            </div>
            <div className="text-black absolute top-36 left-[60px]">
              <p>{previousStory.user.username}</p>
            </div>
          </div>
        </div>
      )}

      {/*Current Story*/}
      <div className=" w-[330px] sbb:w-[390px] tb:w-[450px] tbb:w-[510px] h-[670px] bg-[#BFF6C3] rounded mt-10 ml-4 tbbb:ml-16 tbb:ml-32 md:ml-48 mdc:ml-[200px] mdd:ml-[350px] mddd:ml-[370px] lgg:ml-[400px] lggg:ml-[500px] ">
        <div className="relative h-full">
          <div className="flex">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-red absolute top-4 left-4">
              <img
                src={currentStory.user.imageUrl}
                alt="Profile"
                className="object-cover"
              />
            </div>
            <div className="text-white absolute top-4 left-[70px]">
              <p>{currentStory.user.username}</p>
              <p className="text-sm">
                {formatRelativeTime(currentStory.story.createdAt)}
              </p>
            </div>
            <Trash2
              aria-label="hidden"
              className="h-5 w-5 text-red-500 absolute top-5 right-12"
            />
            <div className="absolute top-5 right-4">
              <MoreHorizontal />
            </div>
          </div>

          {/*main story image*/}
          <div className="w-[460px] h-[550px] absolute top-20 -ml-14 sbb:ml-0 tbb:ml-5">
            <div className="w-full h-full">
              <img
                src={currentStory.story.mediaUrl}
                alt="Story"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/*ChevronLeft*/}
          {previousStory && (
            <div
              className="absolute top-[350px] left-2 w-8 h-8  bg-white border border-gray-700 rounded-full cursor-pointer flex items-center justify-center "
              onClick={() =>
                navigateToStory(previousStory.story.id, previousStory.userId)
              }
            >
              <ChevronLeft />
            </div>
          )}

          {/*ChevronRight*/}
          {nextStory && (
            <div
              className="absolute top-[350px] right-5 w-8 h-8  bg-white border border-gray-700 rounded-full cursor-pointer flex items-center justify-center"
              onClick={() =>
                navigateToStory(nextStory.story.id, nextStory.userId)
              }
            >
              <ChevronRight />
            </div>
          )}
          <div className="flex absolute bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="mr-2">
              <Eye />
            </div>
            <div>
              <p>{currentStory.story.views}</p>
            </div>
          </div>
        </div>
      </div>

      {/*right Story*/}
      {nextStory && (
        <div className="bg-[#FFD0D0] w-[200px] h-[250px] blur-sm  mt-60 ml-4 rounded hidden mdc:block">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-red absolute top-8 left-12">
              <img
                src={nextStory.user.imageUrl}
                alt="Profile"
                className="object-cover"
              />
            </div>
            <div className="text-black absolute top-36 left-[60px]">
              <p>{nextStory.user.username}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ViewStory;
