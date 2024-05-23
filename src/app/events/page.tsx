import React from "react"
import Layoutpage from "@/components/Navbar/Layout"
import CreateEventpage from "@/components/Events/createEvent"
import MyEventsPage from "@/components/Events/myEvents"
import ExploreEventsPage from "@/components/Events/exploreEvents"
function Events() {
  return (
    <Layoutpage>
     <CreateEventpage/>
     <MyEventsPage/>
     <ExploreEventsPage/>
    </Layoutpage>
  )
}

export default Events
