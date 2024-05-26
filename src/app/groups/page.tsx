"use client"
import Layoutpage from "@/components/Navbar/Layout"
import CreateGroup from "@/components/Group/CreateGroup"
import GroupPostsSection from "@/components/Group/GroupPostsSection"

function GroupPage() {
  return (
    <Layoutpage>
      <CreateGroup />
      <GroupPostsSection />
    </Layoutpage>
  )
}

export default GroupPage
