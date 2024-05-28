"use client"
import { cn, formatRelativeTime } from "@/lib/utils"
import { Bookmark, Heart, Repeat, Trash2, Users,MoreVertical,MessageCircle} from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { trpc } from "@/server/trpc/client"
import { toast } from "./ui/use-toast"
import { useUser } from "@clerk/nextjs"
import { Comment as CommentType, Media, PostLikes } from "@prisma/client"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { ScrollArea } from "./ui/scroll-area"
import CommentList from "./CommentList"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"

type MediaWithStringDate = Omit<Media, "createdAt"> & {
  createdAt: string // Modified type
}

interface PostProps {
  id: string
  userImageUrl: string
  userDisplayName: string | undefined
  createdAt: string
  caption: string
  likes: number
  media?: MediaWithStringDate[]
  commentCount: number
  postLikes?: PostLikes[]
  userId: string
  isLikedByUser: boolean
  groupId: string
}

const Post = ({
  id,
  userImageUrl,
  caption,
  createdAt,
  likes,
  userDisplayName,
  media,
  commentCount,
  postLikes,
  userId,
  isLikedByUser,
  groupId,
}: PostProps) => {
  const { user } = useUser()

  const [isCopied, setIsCopied] = useState(false)
  const copyElement = useRef<HTMLInputElement | null>(null)

  const [api, setApi] = React.useState<CarouselApi>()
  const [mediaLoaded, setMediaLoaded] = useState<boolean>(false)
  const [optimisticLikeCount, setOptimisticLikeCount] = useState<number>(likes)
  const [optimisticLikeStatus, setOptimisticLikeStatus] =
    useState<boolean>(isLikedByUser)
  const [invalidatingQuery, setInvalidatingQuery] = useState<boolean>(false)
  const utils = trpc.useUtils()

  const { mutate: likePost, isLoading: isLikingPost } =
    trpc.postRouter.likePost.useMutation()

  const { mutate: unlikePost, isLoading: isUnlikingPost } =
    trpc.postRouter.unlikePost.useMutation()

  const {
    mutate: savePost,
    isLoading: savingPost,
    isError: errorSavingPost,
  } = trpc.postRouter.savePost.useMutation()

  const {
    mutate: deletePost,
    isLoading: deletingPost,
    isError: errorDeletingPost,
  } = trpc.postRouter.deletePost.useMutation()

  useEffect(() => {
    if (!api) {
      return
    }

    const setCarouselHeight = () => {
      const currentSlide = api.selectedScrollSnap()
      const slideList: HTMLElement[] = api.slideNodes()

      if (slideList.length > 1) {
        const slide: ChildNode | null = slideList[currentSlide].firstChild

        const rootCarouselDiv: HTMLElement = api.containerNode()
        if ((slide as HTMLElement).offsetHeight !== 0 && mediaLoaded) {
          const height = (slide as HTMLElement).offsetHeight
          rootCarouselDiv.style.height = `${height}px`
        }
      }
    }
    setCarouselHeight()
    api.on("slidesInView", setCarouselHeight)
    api.on("select", setCarouselHeight)
  }, [api, mediaLoaded])

  const updateLikeStatus = () => {
    setInvalidatingQuery((prev) => !prev)
    setOptimisticLikeStatus((prev) => !prev)
    if (isLikedByUser) {
      setOptimisticLikeCount((prev) => prev - 1)
      unlikePost(
        { postId: id },
        {
          onError: () => {
            setOptimisticLikeCount((prev) => prev + 1)
            setOptimisticLikeStatus((prev) => !prev)
            setInvalidatingQuery((prev) => !prev)
            toast({
              variant: "destructive",
              title: "Couldn't unlike post.",
              description: "Something went wrong. Please try again later.",
            })
          },
          onSuccess: async () => {
            utils.postRouter.fetchAllPosts
              .invalidate()
              .then(() => setInvalidatingQuery((prev) => !prev))
            toast({
              title: "Success",
              description: "Post unliked successfully",
            })
          },
        }
      )
    } else {
      setOptimisticLikeCount((prev) => prev + 1)
      likePost(
        { postId: id },
        {
          onError: () => {
            setOptimisticLikeCount((prev) => prev - 1)
            setOptimisticLikeStatus((prev) => !prev)
            setInvalidatingQuery((prev) => !prev)
            toast({
              variant: "destructive",
              title: "Couldn't like post.",
              description: "Something went wrong. Please try again later.",
            })
          },
          onSuccess: async () => {
            utils.postRouter.fetchAllPosts
              .invalidate()
              .then(() => setInvalidatingQuery((prev) => !prev))
            toast({
              title: "Success",
              description: "Post liked successfully",
            })
          },
        }
      )
    }
  }

  const parseCaption = (caption: string) => {
    const regex = /(\#[a-zA-Z0-9_]+)/g
    return caption
      .split(regex)
      .filter(Boolean)
      .map((segment, index) => {
        if (segment.match(regex)) {
          // Using the index as part of the key for simplicity; consider more unique keys for complex scenarios
          return (
            <strong key={`hashtag-${index}`}>
              <Link href={`/posts/hashtags?q=${segment}`} className="hover:underline">{segment}</Link>
            </strong>
          )
        } else {
          // Similarly, ensure the key is unique
          return <span key={`text-${index}`}>{segment}</span>
        }
      })
  }
  return (
   
    <div className="bg-white p-3 m-3 rounded-lg shadow-md max-w-lg  mt-2 sbb:p-5 md:ml-[20px]   mddd:ml-[20px]  lgg:ml-[20px] ">
      <div className="">
     
        {/* <!-- User Info with Three-Dot Menu --> */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Link
              href={`/profile/${userId}`}
              className="hover:no-underline relative"
            >
              <img
                src={userImageUrl}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="absolute bg-transparent hover:bg-gray-200 inset-0 rounded-full opacity-20" />
            </Link>
            <div>
              <Link
                href={`/profile/${userId}`}
                className="hover:underline underline-offset-2 text-left"
              >
                <p className="text-gray-800 font-semibold">{userDisplayName}</p>
              </Link>
              <div className="flex gap-1">
                <p className="text-gray-500 text-sm hover:underline-none">
                  {formatRelativeTime(createdAt)}
                </p>
                {!!groupId && (
                  <>
                    <span className="-mt-[5px]">.</span>
                    <Link
                      href={`/groups/${groupId}`}
                      className="text-gray-600"
                      title="group post"
                    >
                      <Users className="h-4 w-4 inline -mt-[7px]" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-gray-500 cursor-pointer">
            {/* <!-- Three-dot menu icon --> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:bg-gray-50 rounded-full p-1">
                <MoreVertical />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 shadow-lg">
                <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                  <Bookmark className="w-4 h-4" />
                  <button
                    className="text-base font-medium"
                    onClick={() => {
                      if (user) {
                        savePost(
                          { postId: id, userId: user.id },
                          {
                            onSuccess: () => {
                              toast({
                                title: "Success",
                                description: "Post saved successfully",
                              })
                            },
                            onError: () => {
                              toast({
                                variant: "destructive",
                                title: "Couldn't save post",
                                description:
                                  "Something went wrong. Please try again later.",
                              })
                            },
                          }
                        )
                      }
                    }}
                  >
                    Save Post
                  </button>
                </DropdownMenuItem>
                {user?.id === userId && (
                  <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                    <Trash2 className="w-4 h-4 " />
                    <button
                      className="text-base font-medium"
                      onClick={() => {
                        deletePost(
                          { postId: id },
                          {
                            onSuccess: () => {
                              utils.postRouter.fetchAllPosts.invalidate()
                              toast({
                                title: "Success",
                                description: "Post deleted successfully",
                              })
                            },
                            onError: () => {
                              toast({
                                variant: "destructive",
                                title: "Couldn't delete post",
                                description:
                                  "Something went wrong. Please try again later.",
                              })
                            },
                          }
                        )
                      }}
                    >
                      Delete Post
                    </button>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* <!-- Message --> */}
        <div className="mb-4">
          <p className="text-gray-800 text-left">{parseCaption(caption)}</p>
        </div>
        {media && (
          <div className="mb-4">
            <Carousel setApi={setApi} orientation="horizontal">
              <CarouselContent>
                {" "}
                {/* this should adjust height based on CaroselItem */}
                {media.map((media, index: number) => {
                  return (
                    <CarouselItem key={index} className="align-middle">
                      {media.type === "image" ? (
                        <img
                          onLoad={() =>
                            setMediaLoaded((prev) => (prev ? prev : !prev))
                          }
                          src={media.url}
                          alt="post image"
                          className="w-full h-auto rounded-md align-middle"
                        />
                      ) : (
                        <video
                          onLoadedData={() =>
                            setMediaLoaded((prev) => (prev ? prev : !prev))
                          }
                          src={media.url}
                          controls
                          className="w-full rounded-md align-middle"
                        />
                      )}
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious
                className={cn("ml-14", {
                  hidden: media.length < 2,
                })}
              />
              <CarouselNext
                className={cn("mr-14", {
                  hidden: media.length < 2,
                })}
              />
            </Carousel>
          </div>
        )}
        {/* <!-- Like and Comment Section --> */}
        <div className="flex items-center justify-between text-green-700">
          <div className="flex items-center space-x-2">
        
            <button
              className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1"
              onClick={updateLikeStatus}
              disabled={isLikingPost || isUnlikingPost || invalidatingQuery}
            >
              <Heart
                className={` transition-all duration-300 ease-in-out  ${
                  optimisticLikeStatus ? "filled" : ""
                }`}
                fill={optimisticLikeStatus ? "#DC143C" : "none"}
                strokeWidth={optimisticLikeStatus ? "0" : "1"}
              />

              <span className="text-lg">{optimisticLikeCount}</span>
            </button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1 text-green-800 ml-2">
             < MessageCircle/>
                <span className="flex" >
                  <div>{commentCount} </div><div className="hidden  tbb:block  md:block lg:block ml-2 mr-2">Comment(s)</div></span>
              </button>
            </DialogTrigger>
            <DialogContent className="w-[270px] sbb:w-[330px] tb:ml-14 tb:w-[270px] tbbb:ml-8 tbb:w-[400px] mddd:-ml-12  lgg:-ml-14  md:ml-32 mdd:-ml-8  ">
              <ScrollArea className="max-h-[90vh] ">
                <DialogHeader>
                  <DialogTitle className="text-center mr-60">{`${userDisplayName}'s post's comments`}</DialogTitle>
                  <hr className="mt-2 mb-2" />
                </DialogHeader>
                <CommentList postId={id} />
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="flex">
                  <div className="hidden  tbb:block  md:block lg:block mr-2">Share Post</div>
                   <Repeat className="h-4 w-4 ml-1.5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div>
                  <div>
                    <Button className="text-sm leading-none" variant="ghost">
                      Share
                    </Button>
                  </div>
                  <div className="max-w-sm">
                    <div>
                      <div>Share Post</div>
                      <div>Share the post with others.</div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Label className="sr-only" htmlFor="link">
                          Link
                        </Label>
                        <Input
                          className="flex-1 text-sm"
                          id="link"
                          placeholder="Link"
                          readOnly
                          value={`${process.env.NEXT_PUBLIC_SERVER_URL}/post/${id}`}
                          ref={copyElement}
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            if (copyElement.current) {
                              const link = copyElement.current.value
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(link).then(() => {
                                  setIsCopied(true)
                                  setTimeout(() => setIsCopied(false), 3000)
                                  return
                                })
                                copyElement.current.select()
                                document.execCommand("copy")
                                setIsCopied(true)
                                setTimeout(() => setIsCopied(false), 3000)
                              }
                            }
                          }}
                        >
                          {isCopied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <hr className="mt-2 mb-2" />
      </div>
    </div>
  )
}

export default Post
