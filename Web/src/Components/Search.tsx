"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { MdFilterList, MdKeyboardArrowDown, MdClose } from "react-icons/md";
import { fetchTickets, getCategoryNames } from "../models/TicketFetch";
import TicketGrid from "./TicketGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortAmountDown,
  faSortAmountUp,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Search: React.FC = () => {
  const searchParams = useSearchParams();
  const cateName = searchParams?.get("cateName") || "";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(23000000);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [tickets, setTickets] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [uniqueCities, setUniqueCities] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("Giá thấp đến cao");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const sortOptions = [
    { text: "Giá thấp đến cao", icon: faSortAmountUp },
    { text: "Giá cao đến thấp", icon: faSortAmountDown },
    { text: "Mới nhất", icon: faClock },
  ];
  const extractCity = (location: string): string => {
    const parts = location.split(",");
    return parts[parts.length - 1].trim();
  };

  useEffect(() => {
    setSelectedGenres([cateName]);
    const loadTickets = async () => {
      const fetchedTickets = await fetchTickets();
      setTickets(fetchedTickets);
      setFilteredTickets(fetchedTickets);

      const allCategories = fetchedTickets.flatMap((ticket) =>
        ticket.categories.map((category) => category.name)
      );
      const uniqueCategories = Array.from(new Set(allCategories));
      setCategories(uniqueCategories);

      const cities = fetchedTickets.map((ticket) =>
        extractCity(ticket.location)
      );
      const uniqueCitiesList = Array.from(new Set(cities));
      setUniqueCities(uniqueCitiesList);
    };

    const searchData = localStorage.getItem("searchData");
    if (searchData) setSearchTerm(searchData);
    loadTickets();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSortOptionClick = (option: string) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  const sortTickets = (tickets: any[]) => {
    switch (sortOption) {
      case "Giá thấp đến cao":
        return tickets.sort((a, b) => a.cost - b.cost);
      case "Giá cao đến thấp":
        return tickets.sort((a, b) => b.cost - a.cost);
      case "Mới nhất":
        return tickets.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      default:
        return tickets;
    }
  };

  const getMonthName = (monthIndex: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthIndex];
  };

  const getCurrentMonthName = () => {
    const currentDate = new Date();
    return getMonthName(currentDate.getMonth());
  };

  const getNextMonthName = () => {
    const currentDate = new Date();
    const nextMonth = (currentDate.getMonth() + 1) % 12;
    return getMonthName(nextMonth);
  };

  const getTwoMonthsAheadName = () => {
    const currentDate = new Date();
    const twoMonthsAhead = (currentDate.getMonth() + 2) % 12;
    return getMonthName(twoMonthsAhead);
  };

  useEffect(() => {
    localStorage.setItem("searchData", searchTerm);
    filterTickets();
    setCurrentPage(1);
  }, [
    searchTerm,
    priceRange,
    selectedGenres,
    selectedLocation,
    tickets,
    sortOption,
    startDate,
    endDate,
    startTime,
    endTime,
  ]);
  const clearTimeFilter = () => {
    setStartTime("");
    setEndTime("");
  };
  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange(23000000);
    setSelectedGenres([]);
    setSelectedLocation("");
    clearTimeFilter();
    setDateRange([null, null]);
    // Reset the date picker inputs
    const startInput = document.getElementById(
      "datepicker-range-start"
    ) as HTMLInputElement;
    const endInput = document.getElementById(
      "datepicker-range-end"
    ) as HTMLInputElement;
    if (startInput) startInput.value = "";
    if (endInput) endInput.value = "";
  };

  const handleDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
  };

  const filterTickets = () => {
    let filtered = tickets;

    // Search Filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.name.toLowerCase().includes(searchLower) ||
          getCategoryNames(ticket).toLowerCase().includes(searchLower) ||
          ticket.location.toLowerCase().includes(searchLower)
      );
    }

    // Price Filter
    filtered = filtered.filter((ticket) => ticket.cost <= priceRange);

    // Genre Filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((ticket) =>
        selectedGenres.every((genre) =>
          getCategoryNames(ticket).toLowerCase().includes(genre.toLowerCase())
        )
      );
    }

    // Date Range Filter
    if (startDate && endDate) {
      filtered = filtered.filter((ticket) => {
        const ticketDate = new Date(ticket.startDate);
        return ticketDate >= startDate && ticketDate <= endDate;
      });
    }

    // Time Range Filter
    if (startTime && endTime) {
      filtered = filtered.filter((ticket) => {
        const ticketDate = new Date(ticket.startDate);
        const ticketTime = ticketDate.getHours() * 60 + ticketDate.getMinutes();
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);
        const filterStartTime = startHour * 60 + startMinute;
        const filterEndTime = endHour * 60 + endMinute;
        return ticketTime >= filterStartTime && ticketTime <= filterEndTime;
      });
    }

    // Location Filter
    if (selectedLocation) {
      filtered = filtered.filter(
        (ticket) =>
          extractCity(ticket.location).toLowerCase() ===
          selectedLocation.toLowerCase()
      );
    }

    setFilteredTickets(sortTickets(filtered));
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          className={`w-10 h-10 mx-1 rounded-full transition-colors duration-200 ${
            currentPage === i
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
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };
  return (
    <div className="flex flex-col lg:flex-row min-h-screen mt-24">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div
          ref={sidebarRef}
          className={`fixed inset-y-0 left-0 z-50 w-full sm:w-80 lg:w-96 bg-white transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto`}
        >
          <div className="h-full flex flex-col p-6">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">Bộ lọc</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-grow overflow-auto">
              {/* Genre Filter */}
              <h3 className="font-semibold text-lg mb-2">Thể loại</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreChange(genre)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedGenres.includes(genre)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              {/* Price Filter */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">
                  Khoảng giá: {priceRange.toLocaleString()} VND
                </h3>
                <input
                  type="range"
                  min="0"
                  max="23000000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Location Filter */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Địa điểm</h3>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm p-2"
                >
                  <option value="">Tất cả địa điểm</option>
                  {uniqueCities.map((city) => (
                    <option key={city} value={city} className="truncate">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range Filter */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Khoảng thời gian</h3>
                <DatePicker
                  selectsRange={true}
                  startDate={startDate as Date}
                  endDate={endDate as Date}
                  onChange={handleDateChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm p-2"
                  placeholderText="Chọn khoảng thời gian"
                />
              </div>

              {/* Time Range Filter */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Khung giờ</h3>
                <div className="flex flex-col space-y-2">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm p-2"
                  />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm p-2"
                  />
                </div>
                <button
                  onClick={clearTimeFilter}
                  className="mt-2 w-full bg-gray-200 text-gray-700 rounded-md py-1 px-2 hover:bg-gray-300 transition duration-200 text-sm"
                >
                  Xóa bộ lọc giờ
                </button>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-6">
                <button
                  onClick={clearFilters}
                  className="w-full bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 transition duration-200"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            </div>

            {/* Apply Filters Button (mobile only) */}
            <div className="mt-6 lg:hidden">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition duration-200"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-4 lg:px-16 xl:px-32">
        {/* Header */}
        <div className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            {/* Left: Filter button and Live results */}
            <div className="flex items-center space-x-4 mb-2 md:mb-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`inline-flex items-center justify-center whitespace-nowrap transition duration-200 text-md leading-md font-semibold bg-component-gray-1 text-primary hover:bg-component-gray-2 gap-3 rounded-xl py-3 px-3 disabled:pointer-events-none disabled:opacity-40 ${
                  isSidebarOpen ? "shadow-sm" : ""
                }`}
                aria-expanded={isSidebarOpen}
                aria-label="Filter"
              >
                <MdFilterList
                  className="text-primary"
                  style={{ fontSize: "24px" }}
                />
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-md leading-md font-semibold">Trực tiếp</span>
                <span className="text-md leading-md text-gray-600 text-nowrap">
                  {filteredTickets?.length || 0} kết quả
                </span>
              </div>
            </div>

            {/* Center: Search input */}
            <div className="relative flex-grow mx-2 max-w-xl md:mb-0 w-full md:w-auto">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Right: Sort dropdown */}
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative mr-3 w-full md:w-64" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-12 w-full pl-4 pr-10 rounded-xl border border-gray-300 bg-white hover:border-gray-400 focus:outline-none flex items-center justify-between transition duration-200"
                >
                  <span className="truncate">{sortOption}</span>
                  <MdKeyboardArrowDown className="text-2xl text-gray-600" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg">
                    <ul className="py-1">
                      {sortOptions.map((option) => (
                        <li key={option.text}>
                          <button
                            onClick={() => handleSortOptionClick(option.text)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none transition duration-200 flex items-center"
                          >
                            <FontAwesomeIcon
                              icon={option.icon}
                              className="mr-2"
                            />
                            {option.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Grid and Pagination */}
        <div className="flex-1 p-4">
          <TicketGrid
            maxTicketInRow={isSidebarOpen ? 3 : 5}
            paginatedTickets={paginatedTickets}
          />

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
        </div>
      </div>
    </div>
  );
};

export default Search;
