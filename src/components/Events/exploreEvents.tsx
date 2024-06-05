"use client"
import { trpc } from "@/server/trpc/client"
import { Edit2, ArrowUpRight, MapPin } from "lucide-react"
import { toast } from "../ui/use-toast"

function ExploreEventsPage() {
  const {
    data: events,
    isLoading: loadingEvents,
    isError: errorLoadingEvents,
  } = trpc.eventRouter.fetchRecommendedEvents.useQuery()

  const { mutate: markInterested, isLoading: markingInterested } =
    trpc.eventRouter.markInterested.useMutation()

  const utils = trpc.useUtils()
  return (
    <section className="bg-white  p-4 rounded-lg shadow mb-6 tb:ml-[100px] tb:w-[370px] tbbb:ml-[120px] tbbb:w-[470px] tbb:ml-[150px] tbb:w-[500px] md:ml-[170px] mdc:ml-[120px] mdc:w-[580px] mdd:ml-[240px] mddd:ml-[120px] lgg:ml-[200px] md:w-[500px]  mdd:w-[650px] mddd:w-[610px] lgg:w-[650px] lggg:w-[900px]">
      <h2 className="text-1xl font-semibold text-[#EC74A2] mb-4">Explore</h2>
      <div className="grid grid-cols-1 mdc:grid-cols-2 lggg:grid-cols-3 gap-4 ">
        {loadingEvents && (
          <div className="p-4 bg-white rounded-lg shadow-lg relative w-[260px] sbb:w-[320px] mdc:w-[280px] tbbb:ml-12 mdc:ml-0">
            <div className="flex items-center justify-center">
              <div className="animate-spin">
                <div className="h-5 w-5 rounded-full border-t-2 border-white border-opacity-50"></div>
              </div>
            </div>
          </div>
        )}

        {events &&
          events.recommendedEvents.map((event) => (
            <div className="p-4 bg-white rounded-lg shadow-lg relative w-[260px] sbb:w-[320px] mdc:w-[280px] tbbb:ml-12 mdc:ml-0">
              <img
                src={event.EventMedia?.url}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <div className="flex flex-wrap">
                  <div>
                    <p className="text-sm font-bold text-gray-200 mr-2">
                      {event.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-200">
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
                  <button
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded flex items-center transition duration-200"
                    onClick={() =>
                      markInterested(
                        { eventId: event.id },
                        {
                          onSuccess: () => {
                            toast({
                              title: "Event marked as Interested",
                              description:
                                "You will be notified when the event starts",
                              variant: "default",
                            })
                            utils.eventRouter.fetchEvents.invalidate()
                            utils.eventRouter.fetchRecommendedEvents.invalidate()
                          },
                          onError: () => {},
                        }
                      )
                    }
                  >
                    {markingInterested ? "loading..." : "Mark Interested"}
                  </button>
                  {/* <div className="flex items-center space-x-2">
                    <button className="bg-green-500 text-white p-2 rounded-full">
                      <ArrowUpRight className="h-5 w-5" />
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
export default ExploreEventsPage
