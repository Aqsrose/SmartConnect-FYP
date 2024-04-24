import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { MdSend } from "react-icons/md";

import dynamic from "next/dynamic";

const CaptureAudio = dynamic(() => import("../CaptureAudio"), {
  ssr: false,
});

interface MessageBarProps {
  addMessage: (message: string) => void;
}

const MessageBar: React.FC<MessageBarProps> = ({ addMessage }) => {
  interface EmojiData {
    emoji: string;
    // other properties...
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

  const sendMessage = async () => {
    addMessage(message);
    setMessage("");
    // alert(message);
  };

  return (
    <div className="bg-white  h-20  px-4 flex items-center gap-6 relative ">
      {!showAudioRecorder && (
        <>
          <div className="flex gap-6">
            <BsEmojiSmile
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Emoji"
              id="emoji-open"
              onClick={handleEmojiModal}
            />

            {showEmojiPicker && (
              <div
                className="bottom-24 left-128 z-40 fixed "
                ref={emojiPickerRef}
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          <div className="w-full  rounded-lg h-10 flex  items-center">
            <input
              type="text"
              id="message"
              placeholder="Type a message"
              required
              className="bg-white border  text-sm focus:outline-none text-black h-10 rounded-lg px-5 py-4 w-full
                                "
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </div>
          <div className=" flex w-10 items-center  justify-center ">
            <button>
              {message.length ? (
                <MdSend
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Send Message"
                  onClick={sendMessage}
                />
              ) : (
                <FaMicrophone
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Record"
                  onClick={() => setShowAudioRecorder(true)}
                />
              )}
            </button>
          </div>
        </>
      )}

      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
    </div>
  );
};

export default MessageBar;
