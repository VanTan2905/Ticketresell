import React, { useState, useRef, useEffect } from "react";
import { getCategoryNames, Ticket } from "@/models/TicketFetch";
import { FaTrash, FaSearch, FaCheck, FaSort } from "react-icons/fa";

interface TicketListProps {
  tickets: Ticket[];
  onActive: (ticketId: string) => void;
  onDelete: (ticketId: string) => void;
}

const TicketManager: React.FC<TicketListProps> = ({
  tickets,
  onActive,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets);
  const [sortField, setSortField] = useState<
    "name" | "cost" | "startDate" | "location"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: "name" | "cost" | "startDate" | "location") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    const filterAndSortTickets = () => {
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

      // Apply sorting
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === "startDate") {
          return sortDirection === "asc"
            ? new Date(aValue).getTime() - new Date(bValue).getTime()
            : new Date(bValue).getTime() - new Date(aValue).getTime();
        }

        if (sortField === "cost") {
          return sortDirection === "asc" ? a.cost - b.cost : b.cost - a.cost;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });

      setFilteredTickets(filtered);
      setCurrentPage(1);
    };

    filterAndSortTickets();
  }, [searchTerm, tickets, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
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

  const getSortIcon = (field: string) => {
    if (sortField !== field)
      return <FaSort className="w-3 h-3 ms-1.5 text-gray-400" />;
    return (
      <FaSort
        className={`w-3 h-3 ms-1.5 ${
          sortDirection === "asc" ? "text-blue-500" : "text-blue-700"
        }`}
      />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="flex-1 flex flex-col px-4 lg:px-16 ">
      {/* Search Bar */}
      <div className="p-4 mx-auto w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, danh mục hoặc địa điểm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white mx-auto w-full">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 w-1/4">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("name")}
                >
                  Tên
                  {getSortIcon("name")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 w-1/6">
                Danh mục
              </th>
              <th scope="col" className="px-6 py-3 w-1/6">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("location")}
                >
                  Địa điểm
                  {getSortIcon("location")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 w-1/6">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("cost")}
                >
                  Giá
                  {getSortIcon("cost")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 w-1/8">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("startDate")}
                >
                  Ngày
                  {getSortIcon("startDate")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 w-1/8">
                Trạng thái
              </th>
              <th scope="col" className="px-6 py-3 w-16">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTickets.map((ticket) => (
              <tr
                key={ticket.ticketId}
                className="border-b hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="truncate max-w-xs" title={ticket.name}>
                    {ticket.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {getCategoryNames(ticket)
                      .split(",")
                      .filter((category) => category.trim() !== "")
                      .map((category, index) => (
                        <span
                          key={index}
                          className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full truncate max-w-[150px]"
                          title={category.trim()}
                        >
                          {category.trim()}
                        </span>
                      ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div
                    className="truncate max-w-[150px]"
                    title={ticket.location}
                  >
                    {ticket.location}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="truncate" title={formatVND(ticket.cost)}>
                    {formatVND(ticket.cost)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div
                    className="truncate"
                    title={formatDate(ticket.startDate)}
                  >
                    {formatDate(ticket.startDate)}
                  </div>
                </td>
                <td className="px-6 text-nowrap py-4">
                  {ticket.status === 1 ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Không hoạt động
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {ticket.status === 1 ? (
                    <button
                      onClick={() => onDelete(ticket.ticketId)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-150"
                      title="Xóa"
                    >
                      <FaTrash size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => onActive(ticket.ticketId)}
                      className="text-green-600 hover:text-green-800 transition-colors duration-150"
                      title="Kích hoạt"
                    >
                      <FaCheck size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="max-w-5xl mx-auto w-full">
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
  );
};

export default TicketManager;
