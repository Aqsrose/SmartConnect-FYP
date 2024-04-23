import { chatRouter } from "./routers/chat-router"
import { commentRouter } from "./routers/comment-router"
import { groupRouter } from "./routers/group-router"
import { postRouter } from "./routers/post-router"
import { profileRouter } from "./routers/profile-router"
import { router } from "./trpc"

//pass sub routes into this main router
export const appRouter = router({
  postRouter,
  commentRouter,
  profileRouter,
  groupRouter,
  chatRouter
})

//to get typesafety on front end
export type AppRouter = typeof appRouter
