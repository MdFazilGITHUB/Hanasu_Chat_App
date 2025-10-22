import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { X } from "lucide-react";
import { useRef } from "react";
import { use } from "react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToNewMessages,
    unsubscribeFromMessages
  } = useChatStore();
  const { authUser } = useAuthStore();
  const [openImage, setOpenImage] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToNewMessages();
    }

    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToNewMessages,
    unsubscribeFromMessages
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatText = (text) =>
    text.split("\n").map((line, index) => <p key={index}>{line}</p>);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <ChatHeader />
        <div className="flex-1 overflow-auto">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative">
      <div className="sticky top-0 z-20 bg-base-100">
        <ChatHeader />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic
                      : selectedUser.profilePic
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div
              className={`chat-bubble flex flex-col ${
                message.senderId === authUser._id
                  ? "chat-bubble-primary"
                  : "bg-base"
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer hover:opacity-80 m-auto"
                  onClick={() => setOpenImage(message.image)}
                />
              )}
              {message.text && formatText(message.text)}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-base-100 p-2">
        <MessageInput />
      </div>

      {openImage && (
        <dialog id="image_modal" className="modal modal-open">
          <div
            className="modal-box w-[80vw] h-[90vh] max-w-none flex flex-col items-center justify-center bg-base-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-2 right-2">
              <X
                className="size-6 cursor-pointer hover:text-error transition"
                onClick={() => setOpenImage(null)}
              />
            </div>

            <div className="flex-1 flex items-center justify-center w-full h-full p-4">
              <img
                src={openImage}
                alt="full view"
                className="max-w-full max-h-full object-contain rounded-md"
              />
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ChatContainer;
