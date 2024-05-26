"use client"
import { trpc } from "@/server/trpc/client"
import Link from "next/link"
import { toast } from "../ui/use-toast"
import { useUser } from "@clerk/nextjs"

type GroupProps = {
  id: string
  name: string
  description: string
  isPublic: boolean
}

function JoinGroup({ id, name, description, isPublic }: GroupProps) {
  const utils = trpc.useUtils()
  const { user } = useUser()

  const {
    mutate: requestToJoin,
    isLoading: requesting,
    isError: errorRequesting,
  } = trpc.groupRouter.requestToJoin.useMutation()

  const {
    data: userRequestData,
    isLoading: loadingUserRequestData,
    isError: errorFetchingUserRequest,
  } = trpc.groupRouter.fetchUserJoinRequest.useQuery({ groupId: id })

  const {
    mutate: joinGroup,
    isLoading: joining,
    isError: errorJoining,
  } = trpc.groupRouter.joinGroup.useMutation()

  const {
    mutate: acceptInvitation,
    isLoading: acceptingInvitation,
    isError: errorAcceptingInvitation,
  } = trpc.groupRouter.acceptGroupInvitation.useMutation()

  // const {
  //   mutate: cancelRequest,
  //   isLoading: canceling,
  //   isError: errorCanceling,
  // } = trpc.groupRouter.cancelJoinRequest.useMutation()

  const handleAcceptInvitation = () => {
    acceptInvitation(
      { groupId: id },
      {
        onSuccess: () => {
          toast({
            variant: "default",
            title: "Invitation accepted",
            description:
              "Group Invitation has been accepted. Please wait for the admin to accept the request.",
          })
          utils.groupRouter.fetchUserJoinRequest.invalidate()
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Invitation Acceptance Failed",
            description: "The group invitation could not be accepted.",
          })
        },
      }
    )
  }

  const handleJoinGroup = () => {
    joinGroup(
      { groupId: id },
      {
        onSuccess: () => {
          toast({
            variant: "default",
            title: "Invitation Sent",
            description: "Your invite has been sent.",
          })
          utils.groupRouter.fetchUserJoinRequest.invalidate()
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Invitation Failed",
            description: "Your invite could not be sent.",
          })
        },
      }
    )
  }

  const handleRequestToJoin = () => {
    requestToJoin(
      { groupId: id },
      {
        onSuccess: () => {
          toast({
            variant: "default",
            title: "Request sent successfully",
            description:
              "Your request has been sent. Please wait for the admin to accept.",
          })
          utils.groupRouter.fetchUserJoinRequest.invalidate()
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error sending request",
            description:
              "Your request could not be sent. Please try again later.",
          })
        },
      }
    )
  }

  const handleCancelRequest = () => {
    // cancelRequest(
    //   { groupId: id },
    //   {
    //     onSuccess: () => {
    //       toast({
    //         variant: "default",
    //         title: "Request cancelled",
    //         description: "Your join request has been cancelled.",
    //       })
    //       utils.groupRouter.fetchUserJoinRequest.invalidate()
    //     },
    //     onError: () => {
    //       toast({
    //         variant: "destructive",
    //         title: "Error cancelling request",
    //         description:
    //           "Your request could not be cancelled. Please try again later.",
    //       })
    //     },
    //   }
    // )
  }

  const userRequest = userRequestData?.joinRequest

  return (
    <div className="relative space-x-4 border border-gray-100 rounded-sm h-[120px] tbb:h-[80px] tbbb:w-[350px] tbb:w-[500px] md:w-[520px] lggg:w-[870px] mb-3 bg-white">
      <div className="w-9 h-9 rounded-full overflow-hidden absolute top-2 left-2">
        <img
          src="/images/Ai.jpg"
          alt="Profile"
          className="object-cover bg-gray-200"
        />
      </div>

      <p className="text-lg text-[#10676B] absolute top-3 left-12">{name}</p>
      <p className="text-gray-300 absolute top-10 left-12">{description}</p>

      <div className="flex space-x-36 mt-[70px]">
        <div>
          {isPublic ? (
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white h-10 w-32 rounded transition duration-200 absolute tbb:right-6 tbb:top-7"
              onClick={handleJoinGroup}
              disabled={joining}
            >
              Join Group
            </button>
          ) : userRequest ? (
            userRequest.isInvite ? (
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white h-10 w-32 rounded transition duration-200 absolute tbb:right-6 tbb:top-7"
                onClick={handleJoinGroup}
                disabled={joining}
              >
                Accept Invitation
              </button>
            ) : (
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white h-10 w-32 rounded transition duration-200 absolute tbb:right-6 tbb:top-7"
                onClick={handleCancelRequest}
                // disabled={canceling}
              >
                Cancel Request
              </button>
            )
          ) : (
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white h-10 w-32 rounded transition duration-200 absolute tbb:right-6 tbb:top-7"
              onClick={handleRequestToJoin}
              disabled={requesting}
            >
              Request to Join
            </button>
          )}
        </div>
        <div>
          <Link href={`/groups/${id}`}>
            <button className="text-white rounded bg-gradient-to-r bg-[#2EC7AB] hover:from-[#2EC7AB] hover:to-[#3dd3ba] h-10 w-20 transition duration-200 absolute tbb:right-[180px] tbb:top-7">
              View
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JoinGroup
