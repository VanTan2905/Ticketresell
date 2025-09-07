import React, { useState } from "react";
import { Card } from "@/Components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Calendar,
  Check,
  LockIcon,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  DollarSign,
} from "lucide-react";

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


interface RevenueItem {
  revenueId: string;
  sellerId: string;
  startDate: string;
  endDate: string;
  revenue1: number;
  type: string;
}

interface RevenueManagerProps {
  revenueData: RevenueItem[];
  transactions: Transaction[]
}

const RevenueManager: React.FC<RevenueManagerProps> = ({ revenueData , transactions }) => {
  const [timeframe, setTimeframe] = useState("month");
  const today = new Date();

  // Sort revenue data by startDate
  const sortedRevenueData = [...revenueData].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const countTransactionsToday = (transactions: Transaction[]): number => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format

    if(!transactions)
      return 0;

    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.order.date).toISOString().split('T')[0];
        return transactionDate === todayString;
    }).length;
};

// Function to count transactions for the current month
const countTransactionsThisMonth = (transactions: Transaction[]): number => {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    if(!transactions)
      return 0;
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.order.date);
        return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
    }).length;
};

// Function to count transactions for the current year
const countTransactionsThisYear = (transactions: Transaction[]): number => {
    const today = new Date();
    const year = today.getFullYear();

    if(!transactions)
      return 0;
    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.order.date);
        return transactionDate.getFullYear() === year;
    }).length;
};

// Example usage
const transactionsToday = countTransactionsToday(transactions);
const transactionsThisMonth = countTransactionsThisMonth(transactions);
const transactionsThisYear = countTransactionsThisYear(transactions);


const countUniqueBuyersToday = (transactions: Transaction[]): number => {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format

  const uniqueBuyers = new Set<string>();
  if(!transactions)
    return 0;
  transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.order.date).toISOString().split('T')[0];
      if (transactionDate === todayString) {
          uniqueBuyers.add(transaction.order.user.userId);
      }
  });

  return uniqueBuyers.size;
};

// Function to count unique buyerId's for the current month
const countUniqueBuyersThisMonth = (transactions: Transaction[]): number => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  const uniqueBuyers = new Set<string>();
  if(!transactions)
    return 0;
  transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.order.date);
      if (transactionDate.getMonth() === month && transactionDate.getFullYear() === year) {
          uniqueBuyers.add(transaction.order.user.userId);
      }
  });

  return uniqueBuyers.size;
};

// Function to count unique buyerId's for the current year
const countUniqueBuyersThisYear = (transactions: Transaction[]): number => {
  const today = new Date();
  const year = today.getFullYear();

  const uniqueBuyers = new Set<string>();
  if(!transactions)
    return 0;
  transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.order.date);
      if (transactionDate.getFullYear() === year) {
          uniqueBuyers.add(transaction.order.user.userId);
      }
  });

  return uniqueBuyers.size;
};

const calculateTotalRevenue = (revenueItems: RevenueItem[]): number => {
  return revenueItems.reduce((sum, item) => sum + item.revenue1, 0);
};

// Example usage
const uniqueBuyersToday = countUniqueBuyersToday(transactions);
const uniqueBuyersThisMonth = countUniqueBuyersThisMonth(transactions);
const uniqueBuyersThisYear = countUniqueBuyersThisYear(transactions);
  const calculateAverageDailyRateForToday = (
    revenueData: RevenueItem[]
  ): number => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Filter revenues that match today's date and sum their revenue1 values
    const totalRevenueToday = revenueData
      .filter((item) => item.startDate === todayString) // Assuming startDate indicates when the revenue is considered for today
      .reduce((total, item) => total + item.revenue1, 0);

    // Count the number of revenue entries for today
    const numberOfEntries = revenueData.filter(
      (item) => item.startDate === todayString
    ).length;

    // Calculate and return the Average Daily Rate (ADR)
    return numberOfEntries > 0 ? totalRevenueToday / numberOfEntries : 0;
  };

  const calculatePercentageChangeTodayYesterday = (
    revenueData: RevenueItem[]
  ): number => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayRevenue = revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return (
          itemDate.getFullYear() === today.getFullYear() &&
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getDate() === today.getDate()
        );
      })
      .reduce((total, item) => total + item.revenue1, 0);

    const yesterdayRevenue = revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return (
          itemDate.getFullYear() === yesterday.getFullYear() &&
          itemDate.getMonth() === yesterday.getMonth() &&
          itemDate.getDate() === yesterday.getDate()
        );
      })
      .reduce((total, item) => total + item.revenue1, 0);

    if (yesterdayRevenue === 0) {
      return todayRevenue > 0 ? 100 : 0;
    }

    const percentageChange =
      ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    return percentageChange;
  };

  const calculatePercentageChangeMonth = (
    month: number,
    year: number,
    revenueData: RevenueItem[]
  ): number => {
    const lastMonth = new Date(year, month - 1);
    const currentMonth = new Date(year, month);

    const currentMonthRevenue = revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return (
          itemDate.getFullYear() === currentMonth.getFullYear() &&
          itemDate.getMonth() === currentMonth.getMonth()
        );
      })
      .reduce((total, item) => total + item.revenue1, 0);

    const lastMonthRevenue = revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return (
          itemDate.getFullYear() === lastMonth.getFullYear() &&
          itemDate.getMonth() === lastMonth.getMonth()
        );
      })
      .reduce((total, item) => total + item.revenue1, 0);

    if (lastMonthRevenue === 0) {
      return currentMonthRevenue > 0 ? 100 : 0;
    }

    const percentageChange =
      ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    return percentageChange;
  };

  const calculatePercentageChangeYear = (
    year: number,
    revenueData: RevenueItem[]
  ): number => {
    const lastYear = year - 1;

    const currentYearRevenue = revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return itemDate.getFullYear() === year;
      })
      .reduce((total, item) => total + item.revenue1, 0);

    const lastYearRevenue = revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return itemDate.getFullYear() === lastYear;
      })
      .reduce((total, item) => total + item.revenue1, 0);

    if (lastYearRevenue === 0) {
      return currentYearRevenue > 0 ? 100 : 0;
    }

    const percentageChange =
      ((currentYearRevenue - lastYearRevenue) / lastYearRevenue) * 100;
    return percentageChange;
  };

  const calculateDayRevenue = (
    selectedDate: Date,
    revenueData: RevenueItem[]
  ): number => {
    return revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return (
          itemDate.getFullYear() === selectedDate.getFullYear() &&
          itemDate.getMonth() === selectedDate.getMonth() &&
          itemDate.getDate() === selectedDate.getDate()
        );
      })
      .reduce((total, item) => total + item.revenue1, 0);
  };

  const calculateMonthRevenue = (
    selectedMonth: number,
    selectedYear: number,
    revenueData: RevenueItem[]
  ): number => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthToFilter =
      selectedMonth === currentMonth && selectedYear === currentYear
        ? currentMonth
        : selectedMonth;

    return revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return (
          itemDate.getFullYear() === selectedYear &&
          itemDate.getMonth() === monthToFilter
        );
      })
      .reduce((total, item) => total + item.revenue1, 0);
  };

  const calculateYearRevenue = (
    selectedYear: number,
    revenueData: RevenueItem[]
  ): number => {
    const today = new Date();
    const currentYear = today.getFullYear();

    const yearToFilter =
      selectedYear === currentYear ? currentYear : selectedYear;

    return revenueData
      .filter((item) => {
        const itemDate = new Date(item.startDate);
        return itemDate.getFullYear() === yearToFilter;
      })
      .reduce((total, item) => total + item.revenue1, 0);
  };

  const formatCurrency = (amount: number) => {
    return `${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)} đ`;
  };

  const StatCard = ({
    title,
    value,
    change,
    subtitle,
    totalOrders,
    totalBuyers,
    icon: Icon
  }: {
    title: string;
    value: string;
    change: string;
    subtitle: string;
    changeClass: string;
    totalOrders: number;
    totalBuyers: number;
    icon: React.ElementType;
  }) => (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 translate-y--8">
        <div className="absolute inset-0 opacity-5">
          <Icon className="w-full h-full" />
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Icon className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="text-sm font-medium text-slate-600">{title}</h3>
          </div>
          <LockIcon className="w-4 h-4 text-slate-400" />
        </div>
        
        <div className="space-y-2">
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-full ${
              parseFloat(change) >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}>
              {parseFloat(change) >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {change}%
            </span>
            <span className="text-sm text-slate-500">{subtitle}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <ShoppingCart className="w-4 h-4" />
              Giao dịch
            </span>
            <span className="font-medium text-slate-900">{totalOrders}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <Users className="w-4 h-4" />
              Người mua
            </span>
            <span className="font-medium text-slate-900">{totalBuyers}</span>
          </div>
        </div>
      </div>
    </Card>
  );

  // Format date for X-axis
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth()+1}`;
  };

  // Format Y-axis values
  const formatYAxis = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return String(value);
  };



  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Adjust label formatting based on the selected timeframe (e.g., day, month, year)
      const formattedLabel =
        timeframe === "day"
          ? formatDate(label)
          : timeframe === "month"
          ? `${label}`
          : `${label}`; // For year

      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-slate-100">
          <p className="text-sm text-slate-600">{formattedLabel}</p>
          <p className="text-sm font-bold text-slate-900">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };
  const percentageChange =
    calculatePercentageChangeTodayYesterday(sortedRevenueData);

  const monthlyPercentageChange = calculatePercentageChangeMonth(
    today.getMonth(),
    today.getFullYear(),
    sortedRevenueData
  );
  const yearlyPercentageChange = calculatePercentageChangeYear(
    today.getFullYear(),
    sortedRevenueData
  );

  const dailyChangeFormatted =
    (percentageChange >= 0 ? "+" : "") +
    percentageChange.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const monthlyChangeFormatted =
    (monthlyPercentageChange >= 0 ? "+" : "") +
    monthlyPercentageChange.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const yearlyChangeFormatted =
    (yearlyPercentageChange >= 0 ? "+" : "") +
    yearlyPercentageChange.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Determine classes based on percentage changes
  const dailyChangeClass =
    percentageChange >= 0 ? "text-green-500 " : "text-red-500 ";
  const monthlyChangeClass =
    monthlyPercentageChange >= 0 ? "text-green-500" : "text-red-500 ";
  const yearlyChangeClass =
    yearlyPercentageChange >= 0 ? "text-green-500 " : "text-red-500 ";

  const getMaxRevenue = () => {
    const data = getFilteredRevenueData(); // Get filtered data based on the timeframe

    // Ensure 'data' is defined and not empty, otherwise return 0 as default
    if (!data || data.length === 0) {
      return 0;
    }

    return Math.max(...data.map((item) => item.value)); // Get the maximum revenue
  };

  const getFilteredRevenueData = () => {
    if (timeframe === "day") {
      return sortedRevenueData.map((item) => ({
        name: item.startDate,
        value: item.revenue1,
      }));
    } else if (timeframe === "month") {
      // Group by month
      const groupedByMonth = sortedRevenueData.reduce(
        (acc: Record<number, { name: string; value: number }>, item) => {
          const month = new Date(item.startDate).getMonth() + 1;
          const year = new Date(item.startDate).getFullYear();
          if (!acc[month]) {
            acc[month] = { name: `${month}/${year}`, value: 0 };
          }
          acc[month].value += item.revenue1;
          return acc;
        },
        {} as Record<number, { name: string; value: number }>
      );

      return Object.values(groupedByMonth);
    } else if (timeframe === "year") {
      // Group by year
      const groupedByYear = sortedRevenueData.reduce(
        (acc: Record<number, { name: string; value: number }>, item) => {
          const year = new Date(item.startDate).getFullYear();
          if (!acc[year]) {
            acc[year] = { name: `${year}`, value: 0 };
          }
          acc[year].value += item.revenue1;
          return acc;
        },
        {} as Record<number, { name: string; value: number }>
      );

      return Object.values(groupedByYear);
    }
  };

  console.log("sorterrevenue",sortedRevenueData);
  
  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Main Revenue Chart Card */}
      <Card className="w-full p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-8">
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                {formatCurrency(
                  calculateTotalRevenue(sortedRevenueData)
                )}
              </h2>
              <span
                className={`inline-flex px-2 py-1 text-sm font-medium ${
                  percentageChange >= 0
                    ? "text-green-500 bg-green-50"
                    : "text-red-500 bg-red-50"
                } rounded-full`}
              >
                {percentageChange >= 0 ? "+" : ""}
                {percentageChange.toFixed(2)}%
              </span>
            </div>
            <p className="text-sm text-slate-500">Tổng doanh thu</p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {/* <div className="flex items-center gap-1">
                <Check size={16} className="text-green-500" />
                <span className="text-green-500">Đang tăng</span>
              </div> */}
              <span className="px-2 py-1 text-sm font-medium text-blue-500 bg-blue-50 rounded-lg whitespace-nowrap">
                Doanh thu trung bình:{" "}
                {calculateAverageDailyRateForToday(
                  sortedRevenueData
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-slate-50 text-sm rounded-xl px-4 py-2 pr-8 text-slate-600 focus:outline-none duration-200"
            >
              {[
                { label: "Hôm nay", value: "day" },
                { label: "Tháng này", value: "month" },
                { label: "Năm nay", value: "year" },
              ].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Calendar className="absolute right-1 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={getFilteredRevenueData()}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 20,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={
                  timeframe === "day" ? formatDate : (name) => name
                }
                dy={10}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                ticks={Array.from(
                  { length: 5 },
                  (_, i) => (i * getMaxRevenue()) / 4
                )}
                tickFormatter={formatYAxis}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#7c3aed"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: "#7c3aed" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard
          title="Hôm nay"
          value={formatCurrency(calculateDayRevenue(today, sortedRevenueData))}
          change={dailyChangeFormatted}
          subtitle={`Ngày ${today.getDate()}/${today.getMonth() + 1}`}
          changeClass={dailyChangeClass}
          totalBuyers={uniqueBuyersToday}
          totalOrders={transactionsToday}
          icon={DollarSign}
        />
        <StatCard
          title="Tháng này"
          value={formatCurrency(calculateMonthRevenue(today.getMonth(), today.getFullYear(), sortedRevenueData))}
          change={monthlyChangeFormatted}
          subtitle={`Từ tháng ${today.getMonth() + 1}`}
          changeClass={monthlyChangeClass}
          totalOrders={transactionsThisMonth}
          totalBuyers={uniqueBuyersThisMonth}
          icon={Calendar}
        />
        <StatCard
          title="Năm nay"
          value={formatCurrency(calculateYearRevenue(today.getFullYear(), sortedRevenueData))}
          change={yearlyChangeFormatted}
          subtitle={`Từ năm ${today.getFullYear()}`}
          changeClass={yearlyChangeClass}
          totalOrders={transactionsThisYear}
          totalBuyers={uniqueBuyersThisYear}
          icon={TrendingUp}
        />
      </div>
    </div>
  );
};

export default RevenueManager;
