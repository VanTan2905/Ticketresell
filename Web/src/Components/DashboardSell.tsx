"use client";
import React, { useState, useRef, useEffect } from "react";
import { LayoutDashboard } from "lucide-react";
import { GrTransaction } from "react-icons/gr";
import { IoTicketOutline } from "react-icons/io5";
import TicketsPage from "./TicketSeller";
import TransactionTable from "./TransactionPage";
import RevenueCard from "./RevenuePage";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("Trang Chủ"); // Đặt mặc định là "Trang Chủ"
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const menuItems = [
    {
      id: "dashboard",
      label: "Trang Chủ",
      icon: LayoutDashboard,
    },
    { id: "ticket", label: "Vé", icon: IoTicketOutline },
    { id: "transactions", label: "Giao Dịch", icon: GrTransaction },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderContent = () => {
    switch (selectedTab) {
      case "Trang Chủ":
        return <RevenueCard />;
      case "Vé":
        return <TicketsPage />;
      case "Giao Dịch":
        return <TransactionTable />;
      default:
        return <RevenueCard />;
    }
  };

  return (
    <div className="flex bg-white pt-10">
      {/* Thanh bên */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 transform bg-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 w-64 z-10 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full lg:p-4 md:mt-12">
          <div className="space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedTab(item.label)}
                  className={`flex items-center w-full px-4 py-3 text-sm rounded-lg transition-colors ${
                    selectedTab === item.label
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 pt-16">
        <div className="md:p-1">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
