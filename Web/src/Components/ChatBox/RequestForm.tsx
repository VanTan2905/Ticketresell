import { MessageCircle } from "lucide-react";
import { FaCheck, FaClock, FaLock } from "react-icons/fa";
import React, { useEffect, useState, useRef } from "react";
import ChatComponent from "./ChatComponent";
// import ConfirmationModal from "@/Components/ChatBox/ConfirmModal";
import Cookies from "js-cookie";
import { IoMdClose } from "react-icons/io";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { UserData } from "./UserRequest";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export interface Chatbox {
  chatboxId: string;
  status: number;
  createDate: string;
  title: string;
  description: string;
}

interface ChatboxTableProps {
  userData: UserData | undefined;
  userCookie: UserData | undefined;
  chatboxData: Chatbox[];
  setChatboxData: React.Dispatch<React.SetStateAction<Chatbox[]>>;
}

interface ChatMessage {
  senderId: string | undefined;
  receiverId: string | undefined;
  message: string;
  chatId: string;
  date: string;
}

const ChatboxTable: React.FC<ChatboxTableProps> = ({
  userData,
  chatboxData,
  userCookie,
  setChatboxData,
}) => {
  console.log("userData", userData);
  console.log("chatboxData", chatboxData);
  console.log("userCookie", userCookie);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChatbox, setSelectedChatbox] = useState<Chatbox | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null
  );
  const selectedChatboxRef = useRef<Chatbox | null>(null);

  useEffect(() => {
    selectedChatboxRef.current = selectedChatbox;
  }, [selectedChatbox]);

  useEffect(() => {
    const createHubConnection = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chat-hub`, {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .build();

      try {
        await connection.start();
        console.log("SignalR Kết nối thành công!");

        const userId = Cookies.get("id");
        const accessKey = Cookies.get("accessKey");

        if (userId && accessKey) {
          await connection.invoke("LoginAsync", userId, accessKey);
        }

        // Thiết lập các trình xử lý sự kiện
        connection.on("Welcome", (message) => {
          console.log("Chào mừng:", message);
        });

        connection.on("Logged", (message) => {
          console.log("Đã xác thực:", message);
        });

        connection.on("LoginFail", (message) => {
          console.error("Xác thực thất bại:", message);
        });

        connection.on("ReceiveMessage", (senderId: string, message: string) => {
          const newMessage: ChatMessage = {
            senderId,
            receiverId: Cookies.get("id"),
            message,
            chatId: "",
            date: new Date().toISOString(),
          };

          console.log("Đối tượng tin nhắn mới:", newMessage);
          setChatMessages((prev) => {
            const updated = [...prev, newMessage];
            return updated;
          });
        });

        connection.on("BlockedChatEvent", (chatboxId: string) => {
          console.log(`Sự kiện chặn nhận được cho chatboxId`);

          setChatboxData((prevChatboxes) =>
            prevChatboxes.map((chatbox) =>
              chatbox.chatboxId === chatboxId
                ? { ...chatbox, status: 3 }
                : chatbox
            )
          );

          if (selectedChatboxRef.current?.chatboxId === chatboxId) {
            setSelectedChatbox((prev) =>
              prev ? { ...prev, status: 3 } : prev
            );
          }
        });

        connection.on("UnblockEvent", (chatboxId, message: string) => {
          console.log(`Bỏ chặn ${chatboxId}: ${message}`);

          setChatboxData((prevChatboxes) =>
            prevChatboxes.map((chatbox) =>
              chatbox.chatboxId === chatboxId
                ? { ...chatbox, status: 2 }
                : chatbox
            )
          );

          if (selectedChatboxRef.current?.chatboxId === chatboxId) {
            setSelectedChatbox((prev) =>
              prev ? { ...prev, status: 2 } : prev
            );
          }
        });

        connection.on("AcceptEvent", (chatboxId) => {
          console.log(`Chấp nhận ${chatboxId}`);

          setChatboxData((prevChatboxes) =>
            prevChatboxes.map((chatbox) =>
              chatbox.chatboxId === chatboxId
                ? { ...chatbox, status: 2 }
                : chatbox
            )
          );

          if (selectedChatboxRef.current?.chatboxId === chatboxId) {
            setSelectedChatbox((prev) =>
              prev ? { ...prev, status: 2 } : prev
            );
          }
        });

        connection.on("CompleteEvent", (chatboxId) => {
          console.log(`Hoàn thành ${chatboxId}`);

          setChatboxData((prevChatboxes) =>
            prevChatboxes.map((chatbox) =>
              chatbox.chatboxId === chatboxId
                ? { ...chatbox, status: 0 }
                : chatbox
            )
          );

          if (selectedChatboxRef.current?.chatboxId === chatboxId) {
            setSelectedChatbox((prev) =>
              prev ? { ...prev, status: 0 } : prev
            );
          }
        });

        connection.on("RejectEvent", (chatboxId) => {
          console.log(`Từ chối ${chatboxId}`);

          setChatboxData((prevChatboxes) =>
            prevChatboxes.map((chatbox) =>
              chatbox.chatboxId === chatboxId
                ? { ...chatbox, status: 8 }
                : chatbox
            )
          );

          if (selectedChatboxRef.current?.chatboxId === chatboxId) {
            setSelectedChatbox((prev) =>
              prev ? { ...prev, status: 8 } : prev
            );
          }
        });

        setHubConnection(connection);
      } catch (err) {
        console.error("Lỗi kết nối SignalR: ", err);
      }
    };

    // Chỉ tạo kết nối nếu chưa tồn tại
    if (!hubConnection) {
      createHubConnection();
    }

    return () => {
      if (hubConnection) {
        hubConnection.stop();
      }
    };
  }, []); // Mảng phụ thuộc rỗng vì chúng ta chỉ muốn tạo kết nối một lần

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (userData?.userId) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/Chat/getValidChats/${userData.userId}`,
            {
              method: "GET", // Chỉ định phương thức nếu cần
              credentials: "include", // Bao gồm thông tin xác thực
            }
          );
          const result = await response.json();

          if (result.statusCode === 200 && Array.isArray(result.data)) {
            setChatMessages(result.data);
          } else {
            console.error("Dữ liệu lấy về không phải là mảng:", result.data);
          }
        } catch (error) {
          console.error("Lỗi khi lấy tin nhắn chat:", error);
        }
      }
    };

    fetchChatMessages();
  }, [userData]);

  const handleSendMessage = async (
    message: string,
    userId: string | undefined
  ) => {
    if (!selectedChatbox || !userData || !hubConnection) return;

    try {
      const receiveId =
        userCookie?.userId == chatMessages[0].senderId
          ? chatMessages[0].receiverId
          : chatMessages[0].senderId;

      const newMessage: ChatMessage = {
        senderId: userId,
        receiverId: receiveId,
        message: message,
        chatId: selectedChatbox.chatboxId,
        date: new Date().toISOString(),
      };

      await hubConnection.invoke(
        "SendMessageAsync",
        receiveId,
        message,
        selectedChatbox.chatboxId
      );

      setChatMessages((prevMessages) => [...prevMessages, newMessage]);

      // Kiểm tra nếu người dùng KHÔNG có vai trò RO3 hoặc RO4
      // const hasRestrictedRole = userCookie?.roles.some(
      //   (role) => role.roleId === "RO3" || role.roleId === "RO4"
      // );

      // if (!hasRestrictedRole) {
      //   // Cập nhật trạng thái của chatbox được chọn thành 3
      //   const updatedChatbox: Chatbox = {
      //     ...selectedChatbox,
      //     status: 3,
      //   };
      //   setSelectedChatbox(updatedChatbox);

      //   // Cập nhật mảng chatboxes với chatbox đã cập nhật
      //   setChatboxes((prevChatboxes) =>
      //     prevChatboxes.map((chatbox) =>
      //       chatbox.chatboxId === updatedChatbox.chatboxId
      //         ? updatedChatbox
      //         : chatbox
      //     )
      //   );
      // }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  const openChat = async (chatbox: Chatbox) => {
    // Lấy tin nhắn chat cho chatbox cụ thể này
    if (userCookie?.userId) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Chat/getChatsByBoxchatId/${chatbox.chatboxId}`,
          { credentials: "include" }
        );
        const result = await response.json();

        if (result.statusCode === 200) {
          setChatMessages(result.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy tin nhắn chat:", error);
      }
    }

    // Xác định xem có nên hiển thị modal hay không
    setSelectedChatbox(chatbox);
    setIsChatOpen(true);
  };

  // const confirmChatOpen = () => {
  //   Cookies.set("confirm", "true");
  //   setIsChatOpen(true);
  //   setIsModalOpen(false);
  // };

  const handleProcessingUpdate = async (chatboxId: string) => {
    try {
      // Gọi API map request
      const mapResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Chat/maprequest/${userData?.userId}/${chatboxId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!mapResponse.ok) {
        throw new Error("Không thể ánh xạ yêu cầu");
      }

      const receiverID = userData?.userId;
      console.log("receiverID", receiverID);
      if (hubConnection) {
        await hubConnection.invoke("AcceptRequest", chatboxId, receiverID);
      } else {
        console.error("Kết nối Hub chưa được thiết lập.");
      }

      setChatboxData((prevChatboxes) =>
        prevChatboxes.map((chatbox) =>
          chatbox.chatboxId === chatboxId ? { ...chatbox, status: 2 } : chatbox
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái chatbox:", error);
    }
  };

  const handleRejectsUpdate = async (chatboxId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Chatbox/rejectchat/${chatboxId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const receiverID = userData?.userId;
        console.log("receiverID", receiverID);
        if (hubConnection) {
          await hubConnection.invoke("RejectRequest", chatboxId, receiverID);
        } else {
          console.error("Kết nối Hub chưa được thiết lập.");
        }

        setChatboxData((prevChatboxes) =>
          prevChatboxes.map((chatbox) =>
            chatbox.chatboxId === chatboxId
              ? { ...chatbox, status: 8 }
              : chatbox
          )
        );
      } else {
        console.error("Không thể từ chối chatbox");
      }
    } catch (error) {
      console.error("Lỗi khi từ chối chatbox:", error);
    }
  };

  const handleCompletesUpdate = async (chatboxId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Chatbox/closeboxchat/${chatboxId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const receiverID = userData?.userId;
        console.log("receiverID", receiverID);
        if (hubConnection) {
          await hubConnection.invoke("CompleteRequest", chatboxId, receiverID);
        } else {
          console.error("Kết nối Hub chưa được thiết lập.");
        }

        setChatboxData((prevChatboxes) =>
          prevChatboxes.map((chatbox) =>
            chatbox.chatboxId === chatboxId
              ? { ...chatbox, status: 0 }
              : chatbox
          )
        );
      } else {
        console.error("Không thể cập nhật trạng thái chatbox");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái chatbox:", error);
    }
  };

  const handleLockUpdate = async (chatboxId: string) => {
    try {
      const receiverID = userData?.userId;
      console.log("receiverID", receiverID);
      if (hubConnection) {
        await hubConnection.invoke("BlockChatbox", chatboxId, receiverID);
      } else {
        console.error("Kết nối Hub chưa được thiết lập.");
      }

      setChatboxData((prevChatboxes) =>
        prevChatboxes.map((chatbox) =>
          chatbox.chatboxId === chatboxId ? { ...chatbox, status: 3 } : chatbox
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái chatbox:", error);
    }
  };

  const handleUnlockUpdate = async (chatboxId: string) => {
    try {
      const receiverID = userData?.userId;
      console.log("receiverID", receiverID);
      if (hubConnection) {
        await hubConnection.invoke("UnblockChatbox", chatboxId, receiverID);
      } else {
        console.error("Kết nối Hub chưa được thiết lập.");
      }

      // Cập nhật trạng thái cục bộ
      setChatboxData((prevChatboxes) =>
        prevChatboxes.map((chatbox) =>
          chatbox.chatboxId === chatboxId ? { ...chatbox, status: 2 } : chatbox
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái chatbox:", error);
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return { text: "Đang chờ", color: "bg-yellow-100 text-yellow-800" };
      case 2:
        return { text: "Đang xử lý", color: "bg-blue-100 text-blue-800" };
      case 0:
        return { text: "Đã hoàn thành", color: "bg-green-100 text-green-800" };
      case 3:
        return {
          text: "Đang chặn",
          color: "bg-gray-300 text-gray-500 font-bold",
        };
      case 8:
        return { text: "Đã từ chối", color: "bg-red-100 text-red-800" };
      default:
        return { text: "Báo cáo", color: "bg-red-500 text-white font-bold" };
    }
  };

  // Thêm hàm này để lấy dữ liệu chatbox cho các người dùng cụ thể
  const fetchChatboxData = async () => {
    if (!userCookie?.userId || !userData?.userId) {
      console.log("Thiếu ID người dùng để lấy dữ liệu");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Chat/get/${userCookie.userId}/${userData.userId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const latestData = await response.json();
        if (Array.isArray(latestData)) {
          setChatboxData(latestData);
        } else {
          console.error(
            "Dữ liệu chatbox lấy về không phải là mảng:",
            latestData
          );
        }
      } else {
        console.error("Không thể lấy dữ liệu chatbox:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu chatbox:", error);
    }
  };

  // Thêm hiệu ứng polling để kiểm tra cập nhật
  useEffect(() => {
    // Lấy dữ liệu ban đầu
    fetchChatboxData();

    // Thiết lập khoảng thời gian polling
    const pollInterval = setInterval(() => {
      fetchChatboxData();
    }, 5000); // Kiểm tra mỗi 5 giây

    // Cleanup khi component bị hủy
    return () => clearInterval(pollInterval);
  }, [userCookie?.userId, userData?.userId]); // Phụ thuộc vào cả hai ID người dùng

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-100 rounded-t-lg">
            <th className="py-3 px-4 font-semibold text-left text-gray-700 border-b">
              Tiêu đề
            </th>
            <th className="py-3 px-4 font-semibold text-left text-gray-700 border-b">
              Mô tả
            </th>
            <th className="py-3 px-4 font-semibold text-center text-gray-700 border-b">
              Trạng thái
            </th>
            <th className="py-3 px-4 font-semibold text-center text-gray-700 border-b">
              Ngày tạo
            </th>
            <th className="py-3 px-4 font-semibold text-gray-700 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {chatboxData.map((chatbox) => {
            const { text, color } = getStatusLabel(chatbox.status);
            return (
              <tr
                key={chatbox.chatboxId}
                className="border-b hover:bg-gray-50 transition-colors duration-300"
              >
                <td className="py-3 px-4 text-gray-700">{chatbox.title}</td>
                <td className="py-3 px-4 text-gray-700">
                  {chatbox.description}
                </td>
                <td className="py-3 px-4 text-center">
                  <div
                    className={`rounded-full ${color} py-1 px-4 inline-block`}
                  >
                    {text}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700 text-center">
                  {new Date(chatbox.createDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="items-center py-3 px-4 text-gray-700 text-center">
                  {chatbox.status === 2 ? (
                    <div className="flex justify-center gap-2">
                      {userCookie?.roles.some(
                        (role) => role.roleId === "RO2"
                      ) ||
                      userCookie?.roles.some(
                        (role) => role.roleId === "RO1"
                      ) ? (
                        <button
                          onClick={() => openChat(chatbox)}
                          className="group relative flex items-center gap-2 px-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                          <MessageCircle className="h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
                          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openChat(chatbox)}
                            className="group relative flex items-center gap-2 px-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <MessageCircle className="h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                          </button>

                          <button
                            onClick={() =>
                              handleCompletesUpdate(chatbox.chatboxId)
                            }
                            className="group relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <FaCheck className="text-gray-500 hover:text-green-500" />
                          </button>
                          <button
                            onClick={() => handleLockUpdate(chatbox.chatboxId)}
                            className="flex justify-center items-center"
                          >
                            <FaLock className=" text-yellow-500 " />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : chatbox.status === 1 ? (
                    <div className="flex items-center justify-center gap-2">
                      {userCookie?.roles.some(
                        (role) => role.roleId === "RO2"
                      ) ||
                      userCookie?.roles.some(
                        (role) => role.roleId === "RO1"
                      ) ? (
                        <div className="flex justify-center">
                          <FaClock className=" text-yellow-500 " />
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleProcessingUpdate(chatbox.chatboxId)
                            }
                            className="group relative flex items-center gap-2 pr-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <FaCheck className="text-gray-500 hover:text-green-500" />
                          </button>
                          <button
                            onClick={() =>
                              handleRejectsUpdate(chatbox.chatboxId)
                            }
                            className="group relative flex items-center gap-2 pl-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <IoMdClose className="fa-solid fa-x text-gray-600 hover:text-red-500 text-xl" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : chatbox.status === 8 ? (
                    <div className="flex justify-center">
                      <IoMdClose className="fa-solid fa-x text-red-600 text-xl" />
                    </div>
                  ) : chatbox.status === 0 ? (
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => openChat(chatbox)}
                        className="group relative flex items-center gap-2 pr-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                      >
                        <MessageCircle className="h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
                      </button>
                      <div className="pl-4">
                        <FaCheck className="text-green-500" />
                      </div>
                    </div>
                  ) : chatbox.status === 3 ? (
                    <div className="flex justify-center items-center gap-2">
                      {userCookie?.roles.some(
                        (role) => role.roleId === "RO2"
                      ) ||
                      userCookie?.roles.some(
                        (role) => role.roleId === "RO1"
                      ) ? (
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => openChat(chatbox)}
                            className="group relative flex items-center gap-2 pr-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <MessageCircle className="h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
                          </button>
                          <div className="pl-4">
                            <FaLock className="text-gray-500 hover: text-blue-500" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => openChat(chatbox)}
                            className="group relative flex items-center gap-2 pr-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <MessageCircle className="h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
                          </button>
                          <button
                            onClick={() =>
                              handleUnlockUpdate(chatbox.chatboxId)
                            }
                            className="group relative flex items-center gap-2  py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <FaUnlockKeyhole className="text-gray-500 hover:text-blue-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {userCookie?.roles.some(
                        (role) => role.roleId === "RO2"
                      ) ||
                      userCookie?.roles.some(
                        (role) => role.roleId === "RO1"
                      ) ? (
                        <FaClock className=" text-yellow-500" />
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleProcessingUpdate(chatbox.chatboxId)
                            }
                            className="group relative flex items-center gap-2 pr-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <FaCheck className="text-gray-500 hover:text-green-500" />
                          </button>
                          <button
                            onClick={() =>
                              handleRejectsUpdate(chatbox.chatboxId)
                            }
                            className="group relative flex items-center gap-2 pl-4 py-2 text-white rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                          >
                            <IoMdClose className="fa-solid fa-x text-gray-600 hover:text-red-500 text-xl" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {isChatOpen && (
        <ChatComponent
          onCloseChat={() => {
            setIsChatOpen(false);
          }}
          user={userCookie}
          chatMessages={chatMessages}
          chatbox={selectedChatbox}
          onSendMessage={handleSendMessage}
          mode={
            userCookie?.roles.some(
              (roles) => roles.roleId === "RO3" || roles.roleId === "RO4"
            )
              ? "popup"
              : "fullpage"
          }
          disableInput={
            selectedChatbox?.status === 3 &&
            !userCookie?.roles.some(
              (role) => role.roleId === "RO3" || role.roleId === "RO4"
            )
          }
        />
      )}
    </div>
  );
};

export default ChatboxTable;
