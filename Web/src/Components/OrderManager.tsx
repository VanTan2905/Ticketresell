import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaSyncAlt, FaSort } from "react-icons/fa";
import {
  faSortAmountDown,
  faSortAmountUp,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

interface OrderDetail {
  orderDetailId: string;
  orderId: string;
  ticketId: string;
  price: number;
  quantity: number;
}

interface Order {
  orderId: string;
  buyerId: string;
  status: number;
  orderDetails: OrderDetail[];
}

interface OrderManagerProps {
  orders: Order[];
  onRefresh: (orderId: string) => void;
}

const OrderManager: React.FC<OrderManagerProps> = ({ orders, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<
    "orderId" | "buyerId" | "status" | "total" | "items"
  >("orderId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getOrderTotal = (order: Order): number => {
    return order.orderDetails.reduce(
      (total, detail) => total + detail.price * detail.quantity,
      0
    );
  };

  const handleSort = (
    field: "orderId" | "buyerId" | "status" | "total" | "items"
  ) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    const filterOrders = () => {
      let filtered = orders;

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (order) =>
            order.orderId.toLowerCase().includes(searchLower) ||
            order.buyerId.toLowerCase().includes(searchLower)
        );
      }

      filtered = filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortField) {
          case "orderId":
            aValue = a.orderId.toLowerCase();
            bValue = b.orderId.toLowerCase();
            break;
          case "buyerId":
            aValue = a.buyerId.toLowerCase();
            bValue = b.buyerId.toLowerCase();
            break;
          case "status":
            aValue = a.status;
            bValue = b.status;
            break;
          case "total":
            aValue = getOrderTotal(a);
            bValue = getOrderTotal(b);
            break;
          case "items":
            aValue = a.orderDetails.length;
            bValue = b.orderDetails.length;
            break;
          default:
            aValue = a.orderId.toLowerCase();
            bValue = b.orderId.toLowerCase();
        }

        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
      });

      setFilteredOrders(filtered);
      setCurrentPage(1);
    };

    filterOrders();
  }, [searchTerm, orders, sortField, sortDirection]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case -1:
        return (
          <span className="bg-purple-200 text-purple-900 py-1 px-2 text-xs font-bold rounded">
            Đang xử lý
          </span>
        );
      case 0:
        return (
          <span className="bg-green-200 text-green-900 py-1 px-2 text-xs font-bold rounded">
            Hoàn thành
          </span>
        );
      case 1:
        return (
          <span className="bg-orange-200 text-orange-900 py-1 px-2 text-xs font-bold rounded">
            Giỏ hàng
          </span>
        );
      case 2:
        return (
          <span className="bg-blue-200 text-blue-900 py-1 px-2 text-xs font-bold rounded">
            Hoàn trả
          </span>
        );
      case 3:
        return (
          <span className="bg-red-200 text-red-900 py-1 px-2 text-xs font-bold rounded">
            Hủy bỏ
          </span>
        );
      default:
        return (
          <span className="bg-gray-200 text-gray-900 py-1 px-2 text-xs font-bold rounded">
            Không xác định
          </span>
        );
    }
  };

  const renderActionButtons = (order: Order) => {
    console.log("order ", order.status);
    switch (order.status) {
      case -1:
        return (
          <button
            onClick={() => onRefresh(order.orderId)}
            className="text-blue-500 hover:text-blue-700"
            title="Refresh Order"
          >
            <FaSyncAlt />
          </button>
        );
      default:
        return null;
    }
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

  return (
    <div className="flex-1 flex flex-col px-4 lg:px-16 xl:px-32">
      {/* Header */}
      <div className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="relative flex-grow mx-2 w-full mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng hoặc mã người mua"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 w-1/4">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("orderId")}
                >
                  Mã đơn hàng
                  {getSortIcon("orderId")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 w-1/4">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("buyerId")}
                >
                  Mã người mua
                  {getSortIcon("buyerId")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 w-1/6">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("status")}
                >
                  Trạng thái
                  {getSortIcon("status")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 w-1/6">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("total")}
                >
                  Tổng tiền
                  {getSortIcon("total")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 w-16">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("items")}
                >
                  Số lượng
                  {getSortIcon("items")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 w-16">
                <span>Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr
                  key={order.orderId}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    <div className="truncate max-w-xs" title={order.orderId}>
                      {order.orderId}
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="truncate max-w-xs" title={order.buyerId}>
                      {order.buyerId}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4">
                    <div
                      className="truncate"
                      title={formatVND(getOrderTotal(order))}
                    >
                      {formatVND(getOrderTotal(order))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {order.orderDetails.length}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      {renderActionButtons(order)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Không tìm thấy đơn hàng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 mx-1 rounded-full ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
              }`}
            >
              {page}
            </button>
          ))}
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
  );
};

export default OrderManager;
