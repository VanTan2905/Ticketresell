"use client"
import React, { useEffect, useState } from "react";
import { Search, X, RefreshCw } from "lucide-react";
import "@/Css/Staff.css"
interface OrderDetail {
  orderDetailId: string;
  ticketId: string;
  price: number;
  quantity: number;
  ticket: {
    name: string;
    location: string;
    startDate: string;
    description: string;
    seller: {
      fullname: string;
    };
    image: string;
  };
}

interface OrderData {
  orderId: string;
  buyerId: string;
  status: number;
  date: string;
  orderDetails: OrderDetail[];
}

interface OrderProps {
  email: string;
}

const Order: React.FC<OrderProps> = ({ email }) => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderDetail | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    if (email) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Order/read?email=${email}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          const filteredOrders = data.data.filter(
            (order: OrderData) =>
              order.buyerId.trim().toLowerCase() === email.trim().toLowerCase()
          );
          setOrders(filteredOrders);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [email]);

  const handleRefresh = (orderId: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Order/read?email=${email}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedOrder = data.data.find(
          (order: OrderData) => order.orderId === orderId
        );
        if (updatedOrder) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.orderId === orderId ? updatedOrder : order
            )
          );
        }
      })
      .catch((error) => {
        console.error("Lỗi khi làm mới trạng thái đơn hàng:", error);
      });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  if (loading) {
    return <p className="text-center text-gray-500">Đang tải...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tìm kiếm */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Bảng danh sách đơn hàng */}
        <div className="overflow-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-gray-600 font-semibold px-6 py-3">Mã Đơn Hàng</th>
                <th className="text-gray-600 font-semibold px-6 py-3">Mã Người Mua</th>
                <th className="text-gray-600 font-semibold px-6 py-3">Trạng Thái</th>
                <th className="text-gray-600 font-semibold px-6 py-3">Tổng Tiền</th>
                <th className="text-gray-600 font-semibold px-6 py-3">Số Lượng</th>
                <th className="text-gray-600 font-semibold px-6 py-3">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="border-t">
                  <td className="px-6 py-4">{order.orderId}</td>
                  <td className="px-6 py-4">{order.buyerId}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 1
                        ? "bg-green-100 text-green-600"
                        : "bg-purple-100 text-purple-600"
                        }`}
                    >
                      {order.status === 1 ? "Hoàn Thành" : "Đang Xử Lý"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {formatPrice(
                      order.orderDetails.reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      )
                    )}
                  </td>
                  <td className="px-6 py-4 ">{order.orderDetails.length}</td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    {(order.status === -1 || order.status === 0 || order.status === 2 || order.status === 3) && (
                      <button
                        onClick={() => handleRefresh(order.orderId)}
                        className="text-blue-600 hover:text-blue-800 font-medium ml-8"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    )}
                  </td>


                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Thông báo khi không có kết quả */}
        {orders.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Không tìm thấy đơn hàng phù hợp</h3>
            <p className="text-gray-500 mt-2">Hãy thử tìm kiếm với thuật ngữ khác</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
