"use client"
import { trpc } from "@/server/trpc/client"
import { useUser } from "@clerk/nextjs"
import { Edit2, ArrowUpRight, MapPin } from "lucide-react"
import { toast } from "../ui/use-toast"

function MyEventsPage() {
  const { user } = useUser()
  const { data, isLoading, isError } = trpc.eventRouter.fetchEvents.useQuery()

  const { mutate: deleteEvent, isLoading: isDeleting } =
    trpc.eventRouter.deleteEvent.useMutation()

  const utils = trpc.useUtils()

  return (
    <section className="bg-white p-4 rounded-lg shadow tb:ml-[100px] tb:w-[370px] tbbb:ml-[120px] tbbb:w-[470px] tbb:ml-[150px] tbb:w-[500px] md:ml-[170px] mdc:ml-[120px] mdc:w-[580px] mdd:ml-[240px] mddd:ml-[120px] lgg:ml-[200px] md:w-[500px]  mdd:w-[650px] mddd:w-[610px] lgg:w-[650px] lggg:w-[900px] mb-10">
      <h2 className="text-1xl font-semibold text-[#EC74A2] mb-4">My Events</h2>
      <div className="grid grid-cols-1 mdc:grid-cols-2 lggg:grid-cols-3 gap-4 ">
        {user &&
          data &&
          data.events.map((event) => (
            <div
              key={event.id}
              className="p-4 bg-white rounded-lg shadow-lg relative w-[260px] sbb:w-[320px] mdc:w-[280px] tbbb:ml-12 mdc:ml-0"
            >
              <img
                src={event.EventMedia?.url}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <div className="flex flex-wrap">
                  <div>
                    <p className="text-sm font-bold text-gray-500 mr-2">
                      {event.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500">
                      {event.time}
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-bold p-1">{event.name}</h3>
                <p className="text-gray-600 p-1">{event.description}</p>
                <div className="flex flex-wrap">
                  <div>
                    <MapPin className="w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 p-1">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {event.organizerId === user.id && (
                    <button
                      className="bg-gradient-to-r from-red-500 to-purple-500 hover:from-purple-500 hover:to-red-500 text-white px-4 py-2 rounded flex items-center transition duration-200"
                      onClick={() =>
                        deleteEvent(
                          { eventId: event.id },
                          {
                            onSuccess: () => {
                              toast({
                                title: "Event deleted",
                                description: "Your event has been deleted",
                                variant: "default",
                              })
                              utils.eventRouter.fetchEvents.invalidate()
                            },

                            onError: () => {
                              toast({
                                title: "Error",
                                description: "Something went wrong",
                                variant: "destructive",
                              })
                            },
                          }
                        )
                      }
                    >
                      {!isDeleting ? "Delete" : "Deleting..."}
                    </button>
                  )}
                  {/* <div className="flex items-center space-x-2">
                    <button className="bg-green-500 text-white p-2 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="w-6 h-6"
                        fill="white"
                      >
                        <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
                      </svg>
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
export default MyEventsPage
