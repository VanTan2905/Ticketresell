import React, { useState, useEffect } from "react";
import { TicketCard, fetchTicketItems } from "@/models/TicketSellCard";

import {
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Popup from "./PopupDelete"; // Adjust the path based on your file structure

const TicketsPage = () => {
  const [ticketItems, setTicketItems] = useState<TicketCard[]>([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Define items per page (adjust based on your grid)
  const totalPages = Math.ceil(ticketItems.length / itemsPerPage);

  const fetchItems = async () => {
    try {
      const items = await fetchTicketItems();
      console.log(items);
      setTicketItems(items);
    } catch (error) {
      console.error("Error fetching ticket items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeleteTicket = (ticketId: string) => {
    setTicketToDelete(ticketId);
    setPopupVisible(true); // Show the confirmation popup
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Filter ticket items based on search term
  const filteredItems = ticketItems.filter((ticket) =>
    ticket.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the current set of items to display
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex justify-center ">
      {/* Content */}
      <div className="w-full py-10 px-16 overflow-x-auto">
        {/* Search Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-2 pt-8 rounded-full  sm:space-y-0 sm:space-x-4">
          <div className="relative flex items-center bg-white rounded-full p-1 h-[7vh] px-3 border border-gray-300 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Tìm kiếm vé"
              className="border-none outline-none p-1 bg-transparent w-full"
              value={searchTerm} // Bind the input to the searchTerm state
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
            />
            <FontAwesomeIcon
              className="text-lg p-1 cursor-pointer"
              icon={faMagnifyingGlass}
            />
          </div>

          <Link
            href={`/addticket`}
            className="w-full add-btn-seller-as sm:w-auto  px-3 py-1 bg-green-500 text-white rounded-full border no-underline border-gray-300 hover:bg-green-400 transition-all"
          >
            Thêm
          </Link>
        </div>

        {/* Tickets Section */}
        <div className="mt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {currentItems.length > 0 ? (
              currentItems.map((ticketItem, index) => (
                <div key={ticketItem.id} className="no-underline">
                  <div
                    className="movie-card-wrapper no-underline p-1 cursor-pointer"
                    data-index={index}
                  >
                    <div className="bg-transparent rounded-2xl border overflow-hidden movie-card flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                      <Link
                        href={`/ticket/${ticketItem.id}`}
                        passHref
                        className="no-underline"
                      >
                        <div className="relative flex-grow">
                          <img
                            src={
                              ticketItem.imageUrl ||
                              "https://img3.gelbooru.com/images/c6/04/c604a5f863d5ad32cc8afe8affadfee6.jpg"
                            }
                            alt={ticketItem.name}
                            className="w-full h-40 sm:h-48 object-cover"
                          />
                          <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-sm sm:px-3 sm:py-1 sm:text-base rounded-bl-2xl">
                            {formatVND(ticketItem.price)}
                          </div>
                        </div>
                      </Link>
                      <div className="p-3 sm:p-4 flex-grow flex flex-col">
                        <Link
                          href={`/ticket/${ticketItem.id}`}
                          passHref
                          className="no-underline"
                        >
                          <h3 className="text-base sm:text-lg font-semibold mb-1 text-gray-900 line-clamp-2">
                            {truncateText(ticketItem.name, 35)}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">
                            {truncateText(ticketItem.location, 35)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {ticketItem.date}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Số lượng: {ticketItem.quantity}
                          </p>
                          <div className="tokenize-wrapper mt-2 overflow-hidden">
                            <div className="flex flex-wrap">
                              {ticketItem.categories
                                .slice(0, 2)
                                .map((category) => (
                                  <span
                                    key={category.categoryId}
                                    className="token bg-gray-200 text-gray-700 rounded-full px-2 py-1 mr-1 mb-1 text-xs sm:text-sm"
                                  >
                                    {category.name}
                                  </span>
                                ))}
                              {ticketItem.categories.length > 2 && (
                                <span
                                  key="More categories"
                                  className="token bg-gray-200 text-gray-700 rounded-full px-2 py-1 mr-1 mb-1 text-xs sm:text-sm"
                                >
                                  ...
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="card-content mt-auto">
                            <p className="text-xs sm:text-sm text-gray-700 line-clamp-2"></p>
                          </div>
                        </Link>
                        <div className="flex justify-between items-center pt-3">
                          <Link
                            href={`/updateticket/${ticketItem.id}`}
                            passHref
                            className="no-underline"
                          >
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              className="text-gray-600 hover:text-blue-500 transition-colors duration-200 cursor-pointer active:scale-95"
                            />
                          </Link>
                          <button
                            className="text-red-600 cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation(); // Prevent routing
                              handleDeleteTicket(ticketItem.id); // Call delete function
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="hover:text-red-800 transition-colors duration-200 active:scale-95"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600">
                Không tìm thấy
              </p>
            )}
          </div>
        </div>

        {/* Pagination UI */}
        <div className="flex justify-center space-x-2 mt-4">
          <button
            className={`p-2 rounded-full ${
              currentPage === 1 ? "text-gray-300" : "text-green-500"
            }`}
            onClick={() => {
              currentPage > 1 && setCurrentPage(currentPage - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`p-2 rounded-full ${
                currentPage === index + 1
                  ? "bg-green-500 text-white"
                  : "text-green-500"
              }`}
              onClick={() => {
                setCurrentPage(index + 1); // Navigate to the clicked page
                window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top
              }}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`p-2 rounded-full ${
              currentPage === totalPages ? "text-gray-300" : "text-green-500"
            }`}
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Popup for delete confirmation */}
      <Popup
        isVisible={isPopupVisible}
        onClose={() => {
          setPopupVisible(false);
          fetchItems();
        }}
        ticketId={ticketToDelete || ""}
      />
    </div>
  );
};

export default TicketsPage;
