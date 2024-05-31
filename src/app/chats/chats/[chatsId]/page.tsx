import UserChatPage from "../../userChat/page";
import ChatList from "../../chatList/page";
import Layoutpage from "@/components/Navbar/Layout";

function ChatPage() {
  return (
    <Layoutpage showRightBar={false}>
      <div className="flex  min-h-screen ml-6 tb:ml-[130px] tbb:ml-[100px] md:ml-[130px] md:mr-10 -mt-5 border border-gray-200 fixed ">
        <ChatList />
        <UserChatPage />
      </div>
    </Layoutpage>
  );
}
export default ChatPage;
