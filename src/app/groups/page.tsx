"use client"
import Layoutpage from "@/components/Navbar/Layout"
import CreateGroup from "@/components/Group/CreateGroup"
import { trpc } from "@/server/trpc/client"
import GroupPostsSection from "@/components/Group/GroupPostsSection"

function GroupPage() {
    const { data } = trpc.groupRouter.fetchGroups.useQuery()
    const {
      mutate: joinGroup,
      isLoading,
      isError,
    } = trpc.groupRouter.joinGroup.useMutation()

    const {
      mutate: leaveGroup,
      isLoading: leaving,
      isError: leavingError,
    } = trpc.groupRouter.leaveGroup.useMutation()

    console.log("Data: ", data)
  return (
    <Layoutpage>
      <CreateGroup />
      <GroupPostsSection/>
    </Layoutpage>
  )
}

export default GroupPage
