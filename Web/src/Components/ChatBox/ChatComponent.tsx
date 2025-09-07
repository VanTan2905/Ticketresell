import React, { useState, useEffect, useRef } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import "@/Css/Chatbox.css";
import { UserData } from "./UserRequest";

export interface ChatMessage {
  senderId: string;
  receiverId: string;
  message: string;
  chatId: string;
  date: string | null;
  chatBoxId: string;
}

export interface Chatbox {
  chatboxId: string;
  status: number;
  createDate: string;
  title: string;
  description: string;
}

interface ChatProps {
  user: UserData | undefined;
  chatMessages: any[];
  onSendMessage: (message: string, userId: string, chatboxId: string) => void;
  onCloseChat: () => void;
  chatbox: Chatbox | null;
  mode?: "popup" | "fullpage";
  disableInput: boolean;
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} : ${hours}:${minutes}`;
};

const Chat: React.FC<ChatProps> = ({
  user,
  chatMessages,
  onSendMessage,
  onCloseChat,
  chatbox,
  mode,
  disableInput,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [localChatMessages, setLocalChatMessages] =
    useState<ChatMessage[]>(chatMessages);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isRO3 = user?.roles.some((role) => role.roleId === "RO3");
  const isRO4 = user?.roles.some((role) => role.roleId === "RO4");
  const isInputDisabled =
    !(isRO3 || isRO4) && (chatbox?.status === 3 || chatbox?.status === 0);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    setLocalChatMessages(chatMessages);
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user?.userId && chatbox) {
      try {
        onSendMessage(newMessage, user.userId, chatbox.chatboxId);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const containerClassName =
    mode === "popup"
      ? "fixed bottom-0 right-0 w-full max-w-md h-[70vh] bg-white shadow-lg border-t border-l border-gray-200 z-[999]"
      : "fixed inset-0 w-full h-screen bg-white z-[9999]";

  useEffect(() => {
    if (mode === "fullpage") {
      document.body.style.overflow = "hidden";
      document.body.classList.add("chat-fullpage-mode");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("chat-fullpage-mode");
    };
  }, [mode]);

  return (
    <div className={`${containerClassName} flex flex-col`}>
      {/* Header */}
      <div className="h-12 flex justify-between items-center px-4 border-b bg-white shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-8 w-8">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
          </div>
          <div className="font-bold text-lg">
            {chatbox ? chatbox.title : "Chat"}
          </div>
        </div>
        <button
          onClick={onCloseChat}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-grow overflow-hidden bg-gray-50">
        <div ref={chatContainerRef} className="h-full overflow-y-auto ">
          <div className="grid grid-cols-12 ">
            {localChatMessages.map((msg, i) => (
              <div
                key={i}
                className={`${msg.senderId === user?.userId
                  ? "col-start-1 col-end-13 text-right"
                  : "col-start-1 col-end-13"
                  } px-2`}
              >
                <div
                  className={`flex flex-col ${msg.senderId === user?.userId
                    ? "items-stretch"
                    : "items-stretch"
                    }`}
                >
                  <div
                    className={`flex items-center ${msg.senderId === user?.userId
                      ? "flex-row-reverse "
                      : "flex-row"
                      }`}
                  >
                    <div
                      className={`relative text-sm
                        ${msg.senderId === user?.userId ? "   bg-indigo-100" : "  bg-white"}
                        py-2 px-4  w-full flex-wrap border-solid border-b-2 border-gray-300
                        break-all`}
                    >
                      <div
                        className={`flex items-center ${msg.senderId === user?.userId
                          ? "flex-row-reverse"
                          : "flex-row"
                          } gap-2`}
                      >
                        <div
                          className={`flex items-center justify-center h-8 w-8 rounded-full 
                            ${msg.senderId === user?.userId ? "bg-indigo-500" : "bg-gray-500"}
                            flex-shrink-0 text-white text-sm`}
                        >
                          {msg.senderId === user?.userId
                            ? user.fullname.charAt(0).toUpperCase()
                            : msg.senderId.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {msg.senderId === user?.userId
                            ? user.userId
                            : msg.senderId}
                        </div>
                      </div>
                      <div className="w-full text-md">{msg.message}</div>
                      {msg.date && (
                        <div className="text-xs text-gray-500 mt-1 w-full">
                          {formatDate(msg.date)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="h-16 bg-white border-t px-4 flex items-center shrink-0">
        <div className="flex-grow mx-1">
          <div className="relative w-full">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
              disabled={isInputDisabled || disableInput}
            />
          </div>
        </div>
        <Button
          onClick={handleSendMessage}
          className={`flex items-center justify-center ${isInputDisabled
            ? "bg-gray-300"
            : "bg-indigo-500 hover:bg-indigo-600"
            } rounded-xl text-white px-4 py-1 flex-shrink-0`}
          disabled={isInputDisabled || disableInput}
        >
          <span>Gửi</span>
          <Send className="ml-2 w-4 h-4 transform rotate-45 -mt-px" />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
