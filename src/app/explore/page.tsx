import React from "react"
import Layoutpage from "@/components/Navbar/Layout"
import PostReel from "@/components/PostReel"
function Explore() {
  return (
    <Layoutpage>
      <section id="Explore" className="h-full flex -mt-8 flex-col max-w-full mx-auto w-[240px] sbb:w-[300px] tb:w-[280px] tbbb:w-[350px] tbb:w-[512px] items-center ml-5 sb:ml-8 tb:ml-28 md:ml-[170px] mdd:ml-[150px] mddd:ml-[200px]  lgg:ml-[380px] border border-gray-200">
              <PostReel />
      </section>
    </Layoutpage>
  )
}

export default Explore
