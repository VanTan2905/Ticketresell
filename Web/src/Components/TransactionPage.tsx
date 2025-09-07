import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "@/Css/Transaction.css";
import DateRange from "@/Hooks/DateRange";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface Order {
  orderId: string;
  date: string;
  user: User;
}

interface User {
  userId: string;
  username: string;
}

interface Ticket {
  ticketId: string;
  name: string;
}

interface Transaction {
  orderDetailId: string;
  date: string;
  quantity: number;
  price: number;
  order: Order;
  ticket: Ticket;
}

interface DateParams {
  year: number;
  month: number;
  day: number;
}

const toISODate = ({ year, month, day }: DateParams): string => {
  const date = new Date(year, month - 1, day);
  return date.toISOString();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString + 'Z');
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hours}:${minutes}`;
};

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ start: any; end: any }>({
    start: null,
    end: null,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Define items per page (adjust based on your grid)

  // Calculate total pages
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when transactions change
  }, [transactions]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchTransactions = async () => {
    const id = Cookies.get("id");
    if (!id) {
      setError("User ID not found in cookies.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Transaction/buyers/${id}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const result = await response.json();
      console.log(result.data);

      setTransactions(result.data);
    } catch (error: any) {
      setError("Transaction is available");
      console.error("Transaction is available:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newRange: { start: any; end: any }) => {
    setDateRange(newRange);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Đang tải giao dịch...</div>;
  }

  if (error || transactions.length === 0) {
    return (
      <div className="container mx-auto px-10 py-10 max-w-screen-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="relative flex items-center bg-white rounded-full h-12 p-1 px-3 border border-gray-300 w-3/5 lg:w-64">
            <input
              type="text"
              aria-label="Tìm kiếm vé"
              placeholder="Tìm kiếm vé"
              className="border-none outline-none p-1 bg-transparent w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon
              className="text-lg p-1 cursor-pointer"
              icon={faMagnifyingGlass}
            />
          </div>
          <div className="">
            <DateRange onDateChange={handleDateChange} />
          </div>
        </div>
        <div className="text-center text-gray-500 py-4">
          Không có giao dịch nào.
        </div>
      </div>
    );
  }

  const startDate = dateRange.start ? toISODate(dateRange.start) : null;
  const endDate = dateRange.end ? toISODate(dateRange.end) : null;

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.order.date).toISOString();

    let adjustedEndDate = endDate;
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      adjustedEndDate = endOfDay.toISOString();
    }

    const withinDateRange =
      (!startDate || transactionDate >= startDate) &&
      (!adjustedEndDate || transactionDate <= adjustedEndDate);

    const matchesSearchTerm = transaction.ticket.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return withinDateRange && matchesSearchTerm;
  });

  const currentItems = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const MobileCard = ({ transaction }: { transaction: Transaction }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">
          {formatDate(transaction.order.date)}
        </span>
        <span className="text-sm font-medium text-green-700">
          {formatVND(transaction.price * transaction.quantity)}
        </span>
      </div>
      <div className="mb-2">
        <h3 className="font-medium text-gray-900">
          {truncateText(transaction.ticket.name, 30)}
        </h3>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
            {transaction.quantity} vé
          </span>
        </div>
        <div>Người bán: {transaction.order.user.username}</div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-10 py-10 max-w-screen-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="relative flex items-center bg-white rounded-full h-12 p-1 px-3 border border-gray-300 w-3/5 lg:w-64">
          <input
            type="text"
            aria-label="Tìm kiếm vé"
            placeholder="Tìm kiếm vé"
            className="border-none outline-none p-1 bg-transparent w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <FontAwesomeIcon
            className="text-lg p-1 cursor-pointer"
            icon={faMagnifyingGlass}
          />
        </div>

        <div className="">
          <DateRange onDateChange={handleDateChange} />
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {currentItems.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              Không có giao dịch nào.
            </div>
          ) : (
            currentItems.map((transaction) => (
              <MobileCard
                key={transaction.order.orderId}
                transaction={transaction}
              />
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {["NGÀY", "VÉ", "GIÁ", "SỐ LƯỢNG", "TỔNG CỘNG", "KHÁCH HÀNG"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-4 lg:px-6 py-3 lg:py-4 text-black text-sm font-semibold tracking-wider text-center"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {error ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 lg:px-6 py-4 text-center text-gray-500"
                    >
                      {error}
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 lg:px-6 py-4 text-center text-gray-500"
                    >
                      Không có giao dịch nào.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((transaction) => (
                    <tr key={transaction.orderDetailId}>
                      <td className="px-4 lg:px-6 py-4 text-center">
                        {formatDate(transaction.order.date)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-left">
                        {truncateText(transaction.ticket.name, 30)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-center">
                        {formatVND(transaction.price)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-center">
                        {transaction.quantity}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-center">
                        {formatVND(transaction.price * transaction.quantity)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-center">
                        {transaction.order.user.username}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          
        </div>
      )}
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
  );
};

export default TransactionTable;
