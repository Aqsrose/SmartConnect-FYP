import Chat from "./Component/Chat/Chat";
import { ChatList } from "./Component/ChatList/ChatList";
import Empty from "./Component/Empty";


export default function Home() {
  return (
    <>
    
   <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden ">
    <ChatList />
    {/* <Empty/> */}
    <Chat/>
   </div>
   </>
  );
}
