import ChatList from "./chatList/page";
import EmptyChatPage from "./emptyChat/page";
import Layoutpage from "@/components/Navbar/Layout";

function Chat() {
  return (
    <Layoutpage showRightBar={false}>
      <div className="flex flex-row min-h-screen ml-6 tb:ml-[100px] md:ml-[130px] md:mr-10 -mt-5 border border-gray-200 fixed ">
        <ChatList />

        <EmptyChatPage />
      </div>
    </Layoutpage>
  );
}
export default Chat;
