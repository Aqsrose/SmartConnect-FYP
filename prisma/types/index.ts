import { Prisma } from "@prisma/client"
import { EmailAddress } from "@clerk/clerk-sdk-node"

export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    _count: { select: { comments: true; postLikes: true } }
    postLikes: true
    media: true
  }
}> & {
  isLikedByUser?: boolean
}

export type StoryWithRelations = Prisma.UserStoryGetPayload<{
  include: { storyViews: true }
}>

export type ParentCommentsWithReplyCount = Prisma.CommentGetPayload<{
  include: { _count: { select: { replies: true } }; commentLikes: true }
}> & {
  isLikedByUser?: boolean
}

export type ReplyComments = Prisma.CommentGetPayload<{
  include: { commentLikes: true }
}> & {
  isLikedByUser?: boolean
}

export type User = {
  id: string
  username: string
  imageUrl: string
  emailAddresses: EmailAddress[]
  fullname: string
  bio: {}
  info: {
    university: string
    from: string
    relationshipStatus: string
    isPublic: boolean
  }
}

// I will probably do something this, maybe I won't I really don't know REALLY
//wait a minute, I haven't restarted my server yet, I am so stupid
export type CommentWithUser = {
  user: User
  id: string
  text: string
  createdAt: string
  updatedAt: string
  likes: number
  userId: string
  postId: string
  parentId: string | null
}

export type NFT = {
  id: string
  owner: string
  price: string
  tokenURI: string
}

//add more fields here like category, type (img|video), etc...
export type NFTMetadata = {
  name: string
  description: string
  imageUrl: string
}
