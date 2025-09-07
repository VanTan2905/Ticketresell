import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import OrderDetailsDashboard from "./BuyerSellDashboard"; // Ensure this is the correct path
import RevenueManager from "./RevenueManager";

interface RevenueItem {
  revenueId: string;
  sellerId: string;
  startDate: string;
  endDate: string;
  revenue1: number;
  type: string;
}

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
  date: string;
  quantity: number;
  price: number;
  order: Order;
  ticket: Ticket;
}
interface Orders {
  orderId: string;
  buyerId: string;
  total: number;
}


interface TopBuyer {
  userId: string;
  username: string;
  orders: Orders[];
}

const RevenueCard = () => {
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topBuyers, setTopBuyers] = useState<TopBuyer[]>([]);
  const sellerId = Cookies.get("id");

  const fetchTransactions = async () => {
    if (!sellerId) {
      setError("Không tìm thấy ID người dùng trong cookies.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Transaction/buyers/${sellerId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Không thể tải giao dịch");
      }
      const result = await response.json();
      setTransactions(result.data);
    } catch (error) {
      console.error("Lỗi khi tải giao dịch:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueBySellerId = async () => {
    if (sellerId) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Revenue/readbysellerid/${sellerId}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Phản hồi mạng không thành công");
        }
        const result = await response.json();
        setRevenueData(result.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu doanh thu:", error);
        setRevenueData([]);
      }
    }
  };
  useEffect(() => {
    fetchRevenueBySellerId();
    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchTopBuyers = async () => {
      const sellerId = Cookies.get("id");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/User/topbuyer/${sellerId}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Phản hồi mạng không thành công");
        }
        const result = await response.json();
        console.log("người mua hàng đầu:", result.data);
        setTopBuyers(result.data);
      } catch (error:any) {
        setTopBuyers([]);
        console.log("lỗi", error);
      }
    };

    fetchTopBuyers();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div className="p-6">
      <RevenueManager revenueData={revenueData} transactions={transactions} />
      <div>
        <OrderDetailsDashboard
        topBuyers={topBuyers}
          revenue={revenueData}
          transactions={transactions}
        />
      </div>
    </div>
  );
};

export default RevenueCard;
