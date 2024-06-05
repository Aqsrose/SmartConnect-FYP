"use client";
import Layoutpage from "@/components/Navbar/Layout";
import MessagesPage from "../messages/page";
import { MoreHorizontal, Search, SmilePlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchBar from "../SearchBar";
import { trpc } from "@/server/trpc/client";
import { formatRelativeTime } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

interface PageProps {
  params: {
    chatId: string;
  };
}

function ChatPage({ params: { chatId } }: PageProps) {
  const router = useRouter();

  const {
    data: chats,
    isLoading,
    isError,
  } = trpc.chatRouter.getChats.useQuery();

  const { data } = trpc.chatRouter.getMessages.useQuery({ chatId });

  interface EmojiData {
    emoji: string;
  }

  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutSideClick = (event: MouseEvent) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.id !== "emoji-open"
      ) {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target as Node)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };
    document.addEventListener("click", handleOutSideClick);
    return () => {
      document.removeEventListener("click", handleOutSideClick);
    };
  }, []);

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji: EmojiData) => {
    setMessage((prevMessage) => (prevMessage += emoji.emoji));
  };

  const {
    data: chat,
    isLoading: loadingChat,
    isError: errorFetchingChat,
  } = trpc.chatRouter.getChat.useQuery({ chatId });

  const {
    mutate,
    isLoading: sendingMessage,
    isError: messageError,
  } = trpc.chatRouter.sendMessage.useMutation();
  const utils = trpc.useUtils();

  const handleSendMessage = () => {
    if (message.length === 0) return;
    setMessage("");
    mutate(
      { chatId, text: message },
      {
        onSuccess: () => {
          utils.chatRouter.getMessages.invalidate({ chatId });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Something went wrong",
            variant: "destructive",
          });
          console.log("error: ", error);
        },
      }
    );
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Layoutpage showRightBar={false}>
      <div className="flex min-h-screen ml-6 tb:ml-[100px] md:ml-[130px] md:mr-10 -mt-5 border border-gray-200 tb:fixed">
        <div className="w-[300px] hidden tbb:block sbb:w-[340px] tb:w-[300px] tbbb:w-[400px] tbb:w-[250px] md:w-[260px] lg:w-[300px] xl:w-[350px] border-r border-gray-200">
          <div className="flex items-center justify-between px-3 py-4">
            <SearchBar />
          </div>
          <div className="border-t bg-gray-500"></div>

          <div className="flex items-center justify-between px-3 py-2">
            <div className="font-semibold text-blue-500">Messages</div>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {chats?.chats.map((chat) => {
              return (
                <div
                  onClick={() => router.push(`/chats/${chat.id}`)}
                  className="flex items-center p-1 tbb:p-3 hover:bg-gray-50 bg-white border-none tbb:bg-gray-50 cursor-pointer tbb:border tbb:border-gray-200"
                >
                  <div className="flex-shrink-0 w-14 h-14 tbb:w-16 tbb:h-16 bg-white rounded-full overflow-hidden border-2 border-[#003C43]">
                    <Image
                      src={chat.userB?.imageUrl ?? chat.userA?.imageUrl ?? ""}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="text-sm font-semibold">
                      {chat.userB?.username ?? chat.userA?.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {chat.message[chat.message.length - 1]?.text}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 ml-1">
                    {formatRelativeTime(
                      chat.message[chat.message.length - 1]?.createdAt
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <main className="flex-grow flex flex-col  w-[300px] sbb:w-[350px] tbbb:w-[410px] tbb:w-[370px] mdc:w-[450px] mdd:w-[500px] mddd:w-[600px] lgg:w-[700px] lggg:w-[950px] ">
          <header className="flex items-center justify-between bg-white border-b border-gray-200">
            <div className="flex flex-grow items-center border border-gray-100 p-4 relative">
              <div className="flex-shrink-0 w-10 h-10 md:w-16 md:h-16 bg-white rounded-full overflow-hidden border-2 border-[#003C43]">
                <Image
                  src={
                    chat?.chat.userA?.imageUrl ??
                    chat?.chat.userB?.imageUrl ??
                    ""
                  }
                  alt="Profile"
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </div>
              <div className="ml-4">
                <div className="text-sm font-semibold">
                  {chat?.chat.userA?.username ??
                    chat?.chat.userB?.username ??
                    ""}
                </div>`
                <div className="text-xs text-green-500">Active now</div>
              </div>
              <div className="flex absolute right-3">
                <MoreHorizontal size={20} />
              </div>
            </div>
          </header>

          <div className="flex-grow max-h-[420px] tb:max-h-[450px] overflow-y-auto">
            <MessagesPage messages={data?.messages} />
          </div>

          <footer className="p-4 bg-white border-t border-gray-200 flex items-center sticky bottom-0">
            <BsEmojiSmile
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Emoji"
              id="emoji-open"
              onClick={handleEmojiModal}
            />

            {showEmojiPicker && (
              <div className="bottom-24 left-128 tb:fixed" ref={emojiPickerRef}>
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  className="z-[9999999] flex-shrink-0 w-7 h-7"
                />
              </div>
            )}
            <input
              type="text"
              id="message"
              placeholder="Type a message"
              className="flex-grow p-2 border ml-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={handleKeyPress}
            />
            <button
              className="ml-4 bg-gradient-to-r from-[#349E8D] to-[#2EC7AB] hover:from-[#2EC7AB] hover:to-[#349E8D] text-white px-4 py-2 rounded-lg"
              onClick={handleSendMessage}
              disabled={message.length === 0}
            >
              Send
            </button>
          </footer>
        </main>
      </div>
    </Layoutpage>
  );
}

export default ChatPage;
