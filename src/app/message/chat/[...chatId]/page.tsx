import Chat from "../../Component/Chat/Chat"
import { ChatList } from "../../Component/ChatList/ChatList"

interface PageProps {
  params: {
    chatId: string
  }
}

export default function ChatPage({ params: { chatId } }: PageProps) {

  console.log("ChatId: ", chatId)
  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden ">
        <ChatList/>
        <Chat chatId={chatId}/>
      </div>
    </>
  )
}
