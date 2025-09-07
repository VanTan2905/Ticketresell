"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import RequestDialog from "./RequestDialog";
import ChatboxTable from "./RequestForm";
import { Chatbox } from "./ChatComponent";

interface Role {
  roleId: string;
  rolename: string;
  description: string;
}
export interface UserData {
  userId: string;
  username: string;
  fullname: string;
  gmail: string;
  phone: string;
  address: string;
  sex: string;
  status: number;
  birthday: string;
  bio: string;
  roles: Role[];
}
interface UserRequestProps {
  userData: UserData | undefined;
  userCookie: UserData | undefined;
}

const UserRequest: React.FC<UserRequestProps> = ({ userData, userCookie }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [chatboxData, setChatboxData] = useState<Chatbox[]>([]);
  const [filteredChatboxData, setFilteredChatboxData] = useState<Chatbox[]>([]);

  console.log("Fetching data for ID:", userCookie);

  const fetchChatboxData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Chatbox/getall/${userData?.userId}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chatbox data");
      }
      const data = await response.json();

      if (Array.isArray(data.data)) {
        setChatboxData(data.data);
      } else {
        console.warn("Received data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching chatbox data:", error);
    }
  };

  useEffect(() => {
    fetchChatboxData();
  }, [userData]);

  useEffect(() => {
    const filtered = chatboxData.filter((chatbox) =>
      chatbox.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChatboxData(filtered);
  }, [searchTerm, chatboxData]);

  const hasRO3Role = userCookie?.roles?.some((role) => role.roleId === "RO3");
  const hasRO4Role = userCookie?.roles?.some((role) => role.roleId === "RO4");
  return (
    <div className="bg-white py-12 px-10 rounded-xl ">
      <p
        className={`text-2xl pb-10 text-center font-bold`}
      >
        Bảng yêu cầu
      </p>
      <div
        className={`container mx-auto px-28 flex flex-col sm:flex-row lg:flex-row xl:flex-row 2xl:flex-row justify-between gap-4`}
      >
        {!(hasRO3Role || hasRO4Role) && (
          <div className="relative flex items-center bg-gray-100 mb-5 rounded-full px-4 h-12 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Tìm kiếm yêu cầu"
              className="border-none outline-none items-center bg-transparent w-96 text-gray-700 placeholder-gray-400 focus:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon
              className="text-gray-500 cursor-pointer"
              icon={faMagnifyingGlass}
            />
          </div>
        )}
        
        <div></div>
        {!(hasRO3Role || hasRO4Role) && (
          <RequestDialog setChatboxData={setChatboxData} chatboxData={chatboxData} />
        )}
      </div>
      <div className="flex justify-center w-full ">
        <div className="w-full max-w-7xl">
          {filteredChatboxData.length > 0 ? (
            <ChatboxTable
              userData={userData}
              chatboxData={filteredChatboxData}
              userCookie={userCookie}
              setChatboxData={setChatboxData}
            />
          ) : (
            <div className="text-center text-gray-500 py-8">
              Không có yêu cầu nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRequest;
