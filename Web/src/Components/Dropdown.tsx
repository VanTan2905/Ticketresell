"use client";

import DOMPurify from "dompurify";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import useDropdown from "@/Hooks/useDropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";

interface ChildComponentProps {
  title: string; // `title` must be a string
  content: string; // `description` must be an object with a text property
  dropdownStatus: boolean; // Add a new prop for controlling dropdown visibility. Default to false.
  iconDropdown: string;
}

const Dropdown: React.FC<ChildComponentProps> = ({
  title,
  content,
  dropdownStatus,
  iconDropdown,
}) => {
  const { isDropdownVisible, toggleDropdown } = useDropdown("dropdown-menu");
  const checkDropDown = dropdownStatus;
  const icon = SolidIcons[iconDropdown as keyof typeof SolidIcons];

  return (
    <div className="dropdown-container">
      <button className="dropdown-button" onClick={toggleDropdown}>
        <span className="button-content">
          <span className="icon">
            {icon ? (
              <FontAwesomeIcon icon={icon as any} /> // Pass the icon directly after asserting the type
            ) : (
              <span></span> // Handle invalid icon names
            )}
          </span>
          <span className="text">{title}</span>
        </span>
        {checkDropDown && (
          <>
            {isDropdownVisible ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </>
        )}
      </button>

      {checkDropDown ? (
        isDropdownVisible && (
          <div className="dropdown-content max-h-60 whitespace-normal break-all">
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />
          </div>
        )
      ) : (
        <div className="dropdown-content max-h-60 whitespace-normal break-all">
          <div
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
          />
        </div>
      )}
      <style jsx>{`
        .dropdown-container {
          font-family: Arial, sans-serif;
          width: 100%;
        }
        .dropdown-button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 10px 15px;
          color: #000;
          border: 1px solid #e0e0e0;
          border-radius: 5px 5px 0 0;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .button-content {
          display: flex;
          align-items: center;
        }
        .icon {
          margin-right: 10px;
        }
        .text {
          font-weight: bold;
        }
        .dropdown-content {
          padding: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 0 0 5px 5px;
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default Dropdown;
