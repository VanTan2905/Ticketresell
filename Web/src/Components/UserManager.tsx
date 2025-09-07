import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FaSearch,
  FaTrash,
  FaEdit,
  FaSort,
  FaUserCog,
  FaUserSlash,
  FaKey,
} from "react-icons/fa";
import { Role, User } from "@/models/UserManagement";
import Cookies from "js-cookie";
import * as signalR from "@microsoft/signalr";
import UserRequest, { UserData } from "./ChatBox/UserRequest";
import { BlockStatus, ChatMessage } from "./staff/UsersManagement";
import { Mail, MessageCircle, Send, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "@/Components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  options: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    className?: string;
  }[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  options,
}) => {
  const [position, setPosition] = useState({ x, y });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [onClose]);

  // Adjust position to keep menu in viewport
  useEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = x;
      let adjustedY = y;

      // Adjust horizontal position if menu would overflow right side
      if (x + rect.width > viewportWidth) {
        adjustedX = x - rect.width;
      }

      // Adjust vertical position if menu would overflow bottom
      if (y + rect.height > viewportHeight) {
        adjustedY = y - rect.height;
      }

      setPosition({ x: adjustedX, y: adjustedY });
    }
  }, [x, y]);

  return (
    <motion.div
      ref={menuRef}
      className="fixed bg-white/80 backdrop-blur-sm shadow-lg rounded-lg py-2 z-50 min-w-[200px] border border-gray-200"
      style={{ 
        top: position.y,
        left: position.x,
        transformOrigin: 'top left'
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.5
      }}
    >
      {options.map((option, index) => (
        <motion.button
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            option.onClick();
            onClose();
          }}
          className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 ${
            option.className || "text-gray-700"
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.5,
            delay: option.delay
          }}
          whileHover={{
            scale: 1.02,
            x: 4,
            transition: { duration: 0.2 }
          }}
          whileTap={{
            scale: 0.98,
            transition: { duration: 0.1 }
          }}
        >
          <motion.span
            initial={{ rotate: -20, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              mass: 0.5,
              delay: option.delay + 0.1
            }}
          >
            {option.icon}
          </motion.span>
          {option.label}
        </motion.button>
      ))}
    </motion.div>
  );
};

interface UserManagerProps {
  users: User[];
  onEdit?: (userId: string) => void;
  onDisableAccount?: (userId: string) => void;
  onDisableSeller?: (userId: string) => void;
  onEnableAccount?: (userId: string) => void;
  onResetPassword?: (userId: string) => void;
  onEditRoles?: (userId: string, updatedRoles: Role[]) => void; // Add this line
}

const UserManager: React.FC<UserManagerProps> = ({
  users,
  onEdit,
  onDisableAccount,
  onEnableAccount,
  onDisableSeller,
  onResetPassword,
  onEditRoles
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [sortField, setSortField] = useState<
    "fullname" | "userId" | "gmail" | "createDate"
  >("fullname");
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const [chatMessages, setChatMessages] = useState<
    Record<string, ChatMessage[]>
  >({});
  const popupRef = useRef<any>(null);
  const [showRequestPopup, setShowRequestPopup] = useState(false);

  const [cookieUser, setCookieUser] = useState<UserData | undefined>(undefined);
  const userId = Cookies?.get("id");

  const handleRequestClick = (user: UserData) => {
    setSelectedUser(user);
    setShowRequestPopup(true);
  };

  const [newMessages, setNewMessages] = useState<Record<string, string>>({});
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const hubConnectionRef = useRef<signalR.HubConnection | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [blockStatus, setBlockStatus] = useState<BlockStatus>({});

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Inside UserManager component

  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [selectedUserForRoleEdit, setSelectedUserForRoleEdit] = useState<User | null>(null);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  // Fetch available roles when the component mounts
  useEffect(() => {
    const fetchAvailableRoles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Role/read`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch available roles.");
        }
        const data = await response.json();
        setAvailableRoles(data.data); // Assuming the roles are in data.data
      } catch (error) {
        console.error("Error fetching available roles:", error);
        alert("Error fetching available roles.");
      }
    };

    fetchAvailableRoles();
  }, []);

  const handleSort = (
    field: "fullname" | "userId" | "gmail" | "createDate"
  ) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const fetchSpecificUser = async () => {
    if (!userId) return;

    try {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/User/read/${userId}`
      );
      const userCookie = await userResponse.json();
      console.log("API Response:", userCookie);
      if (userCookie.statusCode === 200 && userCookie.data) {
        const userData: UserData = userCookie.data;
        setCookieUser(userData);
        console.log("Setting cookieUser:", userData);
      }
    } catch (error) {
      console.error("Error fetching specific user:", error);
    }
  };
  useEffect(() => {
    fetchSpecificUser();

    // Setup SignalR
    setupSignalRConnection();

    return () => {
      if (hubConnectionRef.current) {
        hubConnectionRef.current.stop();
      }
    };
  }, []); // Empty dependency array for initial load only

  const setupSignalRConnection = async () => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chat-hub`, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    hubConnectionRef.current = connection;

    connection.on("Welcome", (message: any) => {
      console.log(message);
      setConnectionStatus("Connected");
    });

    connection.on("Logged", (message: any) => {
      console.log(message);
      setConnectionStatus("Authenticated");
    });

    connection.on("LoginFail", (message: any) => {
      console.error(message);
      setConnectionStatus("Authentication Failed");
    });

    connection.on("ReceiveMessage", (senderId: string, message: string) => {
      const newMessage: ChatMessage = {
        senderId,
        receiverId: Cookies.get("id") || "",
        message,
        chatId: Date.now().toString(),
        date: new Date().toISOString(),
      };
      setChatMessages((prev) => ({
        ...prev,
        [senderId]: [...(prev[senderId] || []), newMessage],
      }));
    });

    connection.on("Block", (senderId: string, message: string) => {
      console.log(`Block event received for ${senderId}: ${message}`);
      setBlockStatus((prev) => ({
        ...prev,
        [senderId]: true,
      }));
    });

    connection.on("Unblock", (senderId: string, message: string) => {
      console.log(`Unblock event received for ${senderId}: ${message}`);
      setBlockStatus((prev) => ({
        ...prev,
        [senderId]: false,
      }));
    });

    connection.on("UnblockEvent", (senderId: string, message: string) => {
      console.log(
        `moi lan staff bam unlock, ham nay se hoat dong ${senderId}: ${message}`
      );

      setBlockStatus((prev) => ({
        ...prev,
        [senderId]: false,
      }));
    });

    try {
      await connection.start();
      const accessKey = Cookies.get("accessKey");

      if (userId && accessKey) {
        await connection.invoke("LoginAsync", userId, accessKey);
      }
    } catch (err) {
      console.error("Error establishing connection:", err);
      setConnectionStatus("Connection Failed");
    }
  };

  const handleChat = (user: User) => {
    setSelectedUser(user);
    setIsChatOpen((prev) => ({ ...prev, [user.userId]: true }));
    fetchChatMessages(user.userId);
    // Initialize new message for this user
    setNewMessages((prev) => ({ ...prev, [user.userId]: "" }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e.currentTarget.value);
    }
  };

  const handleSendMessage = async (receiverId: string) => {
    if (!newMessages[receiverId].trim() || !hubConnectionRef.current) return;

    try {
      await hubConnectionRef.current.invoke(
        "SendMessageAsync",
        receiverId,
        newMessages[receiverId],
        "CB318b7ea9-ac94-46a9-a40c-807085f384ed" // Nút này chỉnh boxchatId tương ứng
      );
      await hubConnectionRef.current.invoke(
        "UnblockChatbox",
        "CB318b7ea9-ac94-46a9-a40c-807085f384ed",
        receiverId // Nút unblock của staff sẽ xài hàm này
      );

      const newChatMessage: ChatMessage = {
        senderId: Cookies.get("id") || "",
        receiverId,
        message: newMessages[receiverId],
        chatId: Date.now().toString(),
        date: new Date().toISOString(),
      };

      setChatMessages((prev) => ({
        ...prev,
        [receiverId]: [...(prev[receiverId] || []), newChatMessage],
      }));

      // Clear the input for this user after sending the message
      setNewMessages((prev) => ({ ...prev, [receiverId]: "" }));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatMessageDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchChatMessages = async (receiverId: string) => {
    try {
      const senderID = Cookies.get("id");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Chat/get/${senderID}/${receiverId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.statusCode === 200 && data.data) {
        setChatMessages((prev) => ({
          ...prev,
          [receiverId]: data.data,
        }));
      } else {
        console.error("Failed to fetch chat messages:", data.message);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowRequestPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const filterAndSortUsers = () => {
      let filtered = users;

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.fullname.toLowerCase().includes(searchLower) ||
            user.userId.toLowerCase().includes(searchLower) ||
            user.gmail.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === "createDate") {
          return sortDirection === "asc"
            ? new Date(aValue).getTime() - new Date(bValue).getTime()
            : new Date(bValue).getTime() - new Date(aValue).getTime();
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });

      setFilteredUsers(filtered);
      setCurrentPage(1);
    };

    filterAndSortUsers();
  }, [searchTerm, users, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const maxVisiblePages = 5;
    const pageButtons = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageButtons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="w-10 h-10 mx-1 rounded-full transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageButtons.push(
          <span key="ellipsis1" className="mx-1">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 mx-1 rounded-full transition-colors duration-200 ${currentPage === i
            ? "bg-blue-500 text-white"
            : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
            }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <span key="ellipsis2" className="mx-1">
            ...
          </span>
        );
      }
      pageButtons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className="w-10 h-10 mx-1 rounded-full transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field)
      return <FaSort className="w-3 h-3 ms-1.5 text-gray-400" />;
    return (
      <FaSort
        className={`w-3 h-3 ms-1.5 ${sortDirection === "asc" ? "text-blue-500" : "text-blue-700"
          }`}
      />
    );
  };

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    userId: string;
    isActive: boolean;
    isSeller: boolean;
  } | null>(null);

  const handleContextMenu = useCallback(
    (
      e: React.MouseEvent,
      userId: string,
      isActive: boolean,
      isSeller: boolean
    ) => {
      e.preventDefault();
      const { pageX, pageY } = e;
      setContextMenu({ x: pageX, y: pageY, userId, isActive, isSeller });
    },
    []
  );

  return (
    <div className="flex-1 flex flex-col px-4 lg:px-16 ">
      {isEditRoleModalOpen && selectedUserForRoleEdit && (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1
              }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md"
            >
              <div className="px-8 pt-8 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                      Chỉnh Sửa Vai Trò
                    </h3>
                    <p className="text-sm text-gray-500">
                      Chọn vai trò cho {selectedUserForRoleEdit.fullname}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditRoleModalOpen(false)}
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const selectedRoleIds = formData.getAll("roles") as string[];
                  const updatedRoles = availableRoles.filter((role) =>
                    selectedRoleIds.includes(role.roleId)
                  );
                  onEditRoles?.(selectedUserForRoleEdit.userId, updatedRoles);
                  setIsEditRoleModalOpen(false);
                }}>
                  <div className="space-y-6">
                    {/* Current Roles Section */}
                    <div className="bg-gray-50/50 rounded-2xl p-4">
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Vai trò hiện tại
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedUserForRoleEdit.roles.map((role) => (
                          <span
                            key={role.roleId}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                          >
                            {role.rolename}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Role Selection Section */}
                    <div className="bg-gray-50/50 rounded-2xl p-4">
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Chọn vai trò mới
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {availableRoles
                          // Filter out admin role from selection
                          .filter(role => role.roleId !== "RO4")
                          .map((role) => (
                          <label
                            key={role.roleId}
                            className="relative flex items-center p-3 rounded-xl hover:bg-white transition-colors duration-200 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              name="roles"
                              value={role.roleId}
                              defaultChecked={selectedUserForRoleEdit.roles.some(
                                (userRole) => userRole.roleId === role.roleId
                              )}
                              className="peer h-5 w-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                              {role.rolename}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditRoleModalOpen(false)}
                      className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email tài khoản hoặc email thanh toán"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("fullname")}
                >
                  Tên
                  {getSortIcon("fullname")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("userId")}
                >
                  Email Tài Khoản
                  {getSortIcon("userId")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("gmail")}
                >
                  Email Thanh Toán
                  {getSortIcon("gmail")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Vai Trò
              </th>
              <th scope="col" className="px-6 py-3">
                Trạng Thái
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("createDate")}
                >
                  Ngày Tham Gia
                  {getSortIcon("createDate")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user.userId}
                onContextMenu={(e) =>
                  handleContextMenu(
                    e,
                    user.userId,
                    user.status === 1,
                    user.roles.some((role) => role.roleId === "RO2")
                  )
                }
                className="border-b hover:bg-gray-50 transition-colors duration-150 cursor-context-menu"
              >
                <td className="px-6 py-4 font-medium text-gray-900 truncate text-nowrap">
                  {user.fullname || user.username}
                </td>
                <td className="px-6 py-4 text-blue-600">{user.userId}</td>
                <td className="px-6 py-4">{user.gmail}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {role.rolename}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 text-nowrap py-4">
                  {user.status === 1 ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Hoạt Động
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Không Hoạt Động
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {new Date(user.createDate).toLocaleDateString()}
                </td>
                <td className="px-3 px-4">
                  <button
                    onClick={() => {
                      user.roles.some(
                        (role) => role.roleId === "RO1" || role.roleId === "RO2"
                      )
                        ? handleRequestClick(user)
                        : handleChat(user);
                    }}
                    className="group relative flex items-center gap-2 pr-4 py-2  text-white rounded-full  transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    {user.roles.some(
                      (role) => role.roleId === "RO1" || role.roleId === "RO2"
                    ) ? (
                      <>
                        <Mail className="h-5 w-5 text-green-500 transition-transform group-hover:scale-110" />
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-5 w-5 text-green-500 transition-transform group-hover:scale-110" />
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          options={[
            {
              label: "Chỉnh Sửa Người Dùng",
              icon: <FaEdit className="w-4 h-4" />,
              onClick: () => onEdit?.(contextMenu.userId),
            },
            {
              label: contextMenu.isSeller ? "Vô Hiệu Hóa Người Bán" : "",
              icon: <FaUserSlash className="w-4 h-4" />,
              onClick: () => {
                if (contextMenu.isSeller) {
                  onDisableSeller?.(contextMenu.userId);
                }
              },
              className: contextMenu.isSeller ? "text-orange-600" : "hidden",
            },
            {
              label: contextMenu.isActive
                ? "Vô Hiệu Hóa Tài Khoản"
                : "Kích Hoạt Tài Khoản",
              icon: <FaUserSlash className="w-4 h-4" />,
              onClick: () =>
                contextMenu.isActive
                  ? onDisableAccount?.(contextMenu.userId)
                  : onEnableAccount?.(contextMenu.userId),
              className: `${
                contextMenu.userId === Cookies.get("id")
                  ? "hidden"
                  : contextMenu.isActive
                  ? "text-orange-600"
                  : "text-green-600"
              }`,
            },
            {
              label: "Chỉnh Sửa Vai Trò",
              icon: <FaUserCog className="w-4 h-4" />,
              onClick: () => {
                const user = users.find((u) => u.userId === contextMenu.userId);
                if (user) {
                  // Check if user has admin role
                  const hasAdminRole = user.roles.some(role => role.roleId === "RO4"); // Assuming "RO1" is admin role ID
                  if (hasAdminRole) {
                    alert("Không thể chỉnh sửa vai trò của Admin");
                    return;
                  }
                  setSelectedUserForRoleEdit(user);
                  setIsEditRoleModalOpen(true);
                }
              },
              // Hide the edit role option if the user has admin role
              className: users.find(u => u.userId === contextMenu.userId)?.roles.some(role => role.roleId === "RO4") 
                ? "hidden" 
                : "",
            },
          ]}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 mx-1 rounded-full bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50"
          >
            &lt;
          </button>
          {renderPaginationButtons()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 mx-1 rounded-full bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
      {Object.keys(isChatOpen)
        .filter((userId) => isChatOpen[userId])
        .map((userId, index) => {
          const user = users.find((u) => u.userId === userId);
          if (!user) return null;

          return (
            <div
              key={userId}
              className={`fixed bottom-4 h-[70vh] bg-white w-full max-w-md shadow-xl rounded-lg overflow-hidden transition-all duration-200 ease-in-out`}
              style={{
                right: `${index * 330 + 30}px`,
              }}
            >
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
                  <div className="font-bold text-lg">{user.fullname}</div>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() =>
                    setIsChatOpen((prev) => ({ ...prev, [userId]: false }))
                  }
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div
                ref={chatContainerRef}
                className="flex-grow overflow-hidden bg-gray-50"
              >
                <div className="h-96 overflow-y-auto p-4">
                  {" "}
                  {/* Adjusted height to match ChatComponent */}
                  <div className="grid grid-cols-12">
                    {chatMessages[userId]?.map((msg, i) => (
                      <div
                        key={i}
                        className={`${msg.senderId === Cookies.get("id")
                          ? "col-start-1 col-end-13 text-right"
                          : "col-start-1 col-end-13"
                          } px-2`}
                      >
                        <div
                          className={`flex flex-col ${msg.senderId === Cookies.get("id")
                            ? "items-stretch"
                            : "items-stretch"
                            }`}
                        >
                          <div
                            className={`flex items-center ${msg.senderId === Cookies.get("id")
                              ? "flex-row-reverse"
                              : "flex-row"
                              }`}
                          >
                            <div
                              className={`relative text-sm ${msg.senderId === Cookies.get("id")
                                ? "bg-indigo-100"
                                : "bg-white"
                                } py-2 px-4 w-full flex-wrap border-solid border-b-2 border-gray-300 break-all`}
                            >
                              <div
                                className={`flex items-center ${msg.senderId === Cookies.get("id")
                                  ? "flex-row-reverse"
                                  : "flex-row"
                                  } gap-2`}
                              >
                                <div
                                  className={`flex items-center justify-center h-8 w-8 rounded-full ${msg.senderId === Cookies.get("id")
                                    ? "bg-indigo-500"
                                    : "bg-gray-500"
                                    } flex-shrink-0 text-white text-sm`}
                                >
                                  {msg.senderId === Cookies.get("id")
                                    ? user.fullname.charAt(0).toUpperCase()
                                    : msg.senderId.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {msg.senderId === Cookies.get("id")
                                    ? msg.senderId
                                    : user.userId}
                                </div>
                              </div>
                              <div className="w-full text-md">
                                {msg.message}
                              </div>
                              {msg.date && (
                                <div className="text-xs text-gray-500 mt-1 w-full">
                                  {formatMessageDate(msg.date)}
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
              <div className="h-16 bg-white border-t px-4 flex items-center shrink-0">
                <Input
                  value={newMessages[userId] || ""}
                  onKeyDown={handleKeyDown}
                  onChange={(e) =>
                    setNewMessages((prev) => ({
                      ...prev,
                      [userId]: e.target.value,
                    }))
                  }
                  placeholder="Type a message..."
                  className="flex-grow border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                />
                <Button
                  onClick={() => handleSendMessage(userId)}
                  className={`flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0`}
                >
                  <span>Send</span>
                  <Send className="ml-2 w-4 h-4 transform rotate-45 -mt-px" />
                </Button>
              </div>
            </div>
          );
        })}
      {showRequestPopup && selectedUser && (
        <div className="z-50 fixed inset-0 bg-black/50 flex items-center justify-center">
          <div ref={popupRef}>
            <UserRequest userData={selectedUser} userCookie={cookieUser} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
