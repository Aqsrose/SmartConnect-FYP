import type { User } from "@clerk/clerk-sdk-node"
import { info } from "console"

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username!,
    imageUrl: user.imageUrl,
    emailAddresses: user.emailAddresses,
    fullname: user.firstName + " " + user.lastName,
    bio: user.publicMetadata.bio ?? "",
    info: user.privateMetadata,
  }
}

export const filterUsersForClient = (users: User[]) => {
  return users.map((user) => ({
    id: user.id,
    username: user.username!,
    imageUrl: user.imageUrl,
    emailAddresses: user.emailAddresses,
    fullname: user.firstName + " " + user.lastName,
    bio: user.publicMetadata.bio ?? "",
    info: user.privateMetadata,
  }))
}
