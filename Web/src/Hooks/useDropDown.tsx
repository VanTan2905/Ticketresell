import { useEffect, useState } from "react";

const useDropdown = (dropdownClassName: string) => {
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    setDropdownVisible((prev) => !prev);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const dropdown = document.querySelector(`.${dropdownClassName}`);
    if (dropdown && !dropdown.contains(e.target as Node)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (isDropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownVisible]);

  return { isDropdownVisible, toggleDropdown };
};

export default useDropdown;
