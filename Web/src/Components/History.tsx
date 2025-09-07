import React, { useState, useEffect } from 'react';
import { Ticket, User, Coins, Search, ArrowUpDown, X, Calendar, CreditCard, Package2 } from 'lucide-react';
import { Ticket as TicketModel } from '@/models/TicketFetch';
import Cookies from 'js-cookie';
interface OrderDetail {
  ticket: {
    cost: number;
    seller?: {
      fullname: string;
    };
  };
  quantity: number;
}

interface Order {
  orderId: string;
  orderDetails: OrderDetail[];
  status: number;
  date: string;
}

const HistoryPage = () => {
  const [purchaseHistory, setPurchaseHistory] = useState<Array<{
    id: string;
    date: string;
    tickets: TicketModel[];
    price: number;
    status: number;
    seller: string | null;
  }>>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const userId = Cookies.get('id');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/History/get/${userId}`, {
          credentials: 'include',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        if (result.statusCode === 200 && Array.isArray(result.data)) {
          const filteredOrders = result.data.filter((order: Order) => order.status !== 1);
          const groupedOrders = filteredOrders.map((order: Order) => {
            const date = order.date;
            const formattedDate = date ? (() => {
              const parsedDate = new Date(date);
              if (isNaN(parsedDate.getTime())) {
                return 'Ngày không hợp lệ';
              }

              // Convert to UTC+7
              const utcDate = new Date(parsedDate.toLocaleString('en-US', { timeZone: 'UTC' }));
              const vietnamTime = new Date(utcDate.getTime() + 14 * 60 * 60 * 1000); // Add 7 hours to convert to UTC+7

              // Format date according to Vietnam timezone (UTC+7)
              const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Asia/Ho_Chi_Minh', // Vietnam timezone (UTC+7)
                hour12: false,
              };

              return vietnamTime.toLocaleString('vi-VN', options); // Format date with Vietnam locale
            })() : 'Ngày không hợp lệ';


            return {
              id: order.orderId,
              date: formattedDate,
              tickets: order.orderDetails.map((detail: OrderDetail) => ({
                ...detail.ticket,
                cost: detail.ticket.cost,
                quantity: detail.quantity,
                seller: detail.ticket.seller?.fullname || null,
              })),
              price: order.orderDetails.reduce((total: number, detail: OrderDetail) =>
                total + detail.ticket.cost * detail.quantity, 0),
              status: order.status === -1 ? 1 : order.status,
            };
          });

          // Sort by date descending by default
          groupedOrders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());


          setPurchaseHistory(groupedOrders);
        }
      } catch (error) {
        console.error('Error fetching purchase history:', error);
      }
    };

    fetchPurchaseHistory();
  }, []);

  const getStatusBadge = (status: number) => {
    const statusConfig = {
      0: {
        label: 'Đã Thanh Toán',
        className: 'bg-green-100 text-green-800 ring-green-600/20',
        icon: '✓',
      },
      1: {
        label: 'Đang xử lý',
        className: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
        icon: '⧖',
      },
      2: {
        label: 'Đã hủy',
        className: 'bg-red-100 text-red-800 ring-red-600/20',
        icon: '×',
      },

    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig[0];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${config.className}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const filteredOrders = purchaseHistory
    .filter(order => filterStatus === 'all' || order.status === Number(filterStatus))
    .filter(order =>
      order.id.includes(searchTerm) ||
      order.tickets.some(ticket => ticket.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.seller && order.seller.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Lịch sử đơn hàng</h1>
              <p className="text-gray-500">Quản lý và theo dõi các đơn hàng của bạn</p>
            </div>
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
              {purchaseHistory.length} đơn hàng
            </span>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Tìm kiếm theo mã đơn, tên vé hoặc người bán..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="0">Đã thanh toán</option>
              <option value="1">Đang xử lý</option>
              <option value="2">Đã hủy</option>
            </select>
          </div>

          {/* Orders List */}
          <div className="grid gap-4">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => {
                  setSelectedOrder(order);
                  setIsModalOpen(true);
                }}
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                      <h3 className="font-semibold">#{order.id}</h3>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Ngày mua</p>
                      <p className="font-medium">{order.date}</p>
                    </div>

                    <div className="space-y-1"></div>

                    <div className="space-y-1 text-right">
                      <p className="text-sm text-gray-500">Tổng tiền</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatPrice(order.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {order.tickets.map((ticket, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {ticket.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Không tìm thấy đơn hàng</h3>
                <p className="text-gray-500 mt-2">Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden mt-16"> {/* Add mt-16 for margin-top */}
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Chi tiết đơn hàng #{selectedOrder.id}</h3>
                  <p className="text-sm text-gray-500">Được đặt vào {selectedOrder.date}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b bg-gray-50">
                <h4 className="font-semibold text-gray-900">Chi tiết vé</h4>
              </div>

              <div className="divide-y overflow-y-auto max-h-[30vh]"> {/* Thêm overflow-y-auto ở đây */}
                {selectedOrder.tickets.map((ticket: any, idx: any) => (
                  <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{ticket.name}</h5>
                        {ticket.seller && (
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Người bán: {ticket.seller} {/* This now shows fullname */}
                          </p>
                        )}


                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Đơn giá</p>
                          <p className="font-medium text-gray-900">{formatPrice(ticket.cost)}</p>
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Số lượng</p>
                          <p className="font-medium text-gray-900">{ticket.quantity}</p>
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Thành tiền</p>
                          <p className="font-medium text-blue-600">{formatPrice(ticket.cost * ticket.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Modal Body */}
            <div className="p-3 max-h-[calc(70vh-60px)]">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Total Amount Card */}
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CreditCard className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tổng tiền</p>
                      <p className="text-lg font-bold text-green-600">{formatPrice(selectedOrder.price)}</p>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Trạng thái</p>
                      <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                    </div>
                  </div>
                </div>

                {/* Ticket Count Card */}
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Ticket className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Số lượng vé</p>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedOrder.tickets.reduce((sum: any, ticket: any) => sum + ticket.quantity, 0)} vé
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Details */}

            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default HistoryPage;