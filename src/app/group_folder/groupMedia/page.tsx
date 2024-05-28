"use client"

import { trpc } from "@/server/trpc/client"

interface Props {
  groupId: string
}
const GroupMedia = ({ groupId }: Props) => {
  const { data, isLoading, isError } =
    trpc.groupRouter.fetchGroupMedia.useQuery({ groupId })

  console.log("data: ", data)

  return (
    <div className="absolute top-2 left-4 mb-6 border border-gray-100  w-[260px] sb:w-[300px] sbb:w-[350px] tb:w-[300px] tbbb:w-[400px] tbb:w-[500px] md:w-[470px] mdc:w-[550px] mddd:w-[550px] lg:w-[470px] lgg:w-[450px] lggg:w-[520px]">
      <div className="grid grid-cols-2 gap-1 mdc:ml-7 mdd:ml-0">
        {data &&
          data.media.map((media) =>
            media.media.map((mediaItem) => (
              <div
                className="flex-shrink-0  bg-white rounded  border-2 border-[#003C43]"
                key={mediaItem.id}
              >
                {mediaItem.type === "image" ? (
                  <img
                    src={mediaItem.url}
                    alt="Media"
                  />
                ) : (
                  <video src={mediaItem.url} />
                )}
              </div>
            ))
          )}
        {isLoading && <h1>Loading...</h1>}
      </div>
    </div>
  )
}
export default GroupMedia
