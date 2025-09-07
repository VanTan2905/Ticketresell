import React, { useState } from "react";

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const tabs = [
    { id: "upcoming", label: "Active & upcoming" },
    { id: "past", label: "Past" },
  ];

  const handleTabClick = (tabId: any) => {
    setActiveTab(tabId);
  };

  return (
    <ul className="flex m-0 -ml-2 gap-2">
      {tabs.map((tab) => (
        <li key={tab.id} className="list-none">
          <button
            onClick={() => handleTabClick(tab.id)}
            className={`no-underline cursor-pointer text-nowrap text-green-600 hover:text-green-800 disabled:pointer-events-none disabled:opacity-40 px-3 py-2 h-12 rounded-md transition-colors ${
              activeTab === tab.id ? "bg-gray-100 font-semibold" : "font-normal"
            }`}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <span className="text-md leading-6 font-semibold">{tab.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TabNavigation;
