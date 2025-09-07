"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Search,
  Calendar,
  CreditCard,
  X,
  Filter,
  ChevronDown,
  MapPin,
  Share2,
  Download,
  Tag,
  Info,
  Clock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import QRCode from "qrcode";
import JSZip from "jszip";
import Cookies from "js-cookie";
import { fetchImage } from "@/models/FetchImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import TicketCard from "./TicketCard";

interface TicketData {
  id: string;
  name: string;
  date: string;
  cost: number;
  quantity: number;
  sellerId: string;
  seller: string;
  fullname: string;
  description: string;
  categories?: string[];
  image: string;
  location?: string;
}

interface OrderDetail {
  orderDetailId: string;
  ticketId: string;
  rated: number;
  ticket: {
    id: string;
    name: string;
    startDate: string;
    cost: number;
    sellerId: string;
    seller: any;
    fullname: string;
    description?: string;
    categories?: string[];
    image: string;
    location?: string;
  };
  quantity: number;
}

interface Order {
  status: number;
  orderDetails: OrderDetail[];
}

const MyTicketPage = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "price" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [center, setCenter] = useState({ lat: 10.762622, lng: 106.660172 });
  const ITEMS_PER_PAGE = 6;

  const fetchLocation = async (address: any) => {
    const apiKey = "b2abc07babmsh30e6177f039fd88p18a238jsn5ec9739e64ae";
    const encodedAddress = encodeURIComponent(address);

    const url = `https://google-map-places.p.rapidapi.com/maps/api/geocode/json?address=${encodedAddress}&language=vn&region=vn&result_type=administrative_area_level_1&location_type=APPROXIMATE`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "google-map-places.p.rapidapi.com",
          "x-rapidapi-key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching location data:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);
  const detectMimeType = (base64String: string) => {
    if (base64String.startsWith("/9j/")) return "image/jpeg"; // JPEG
    if (base64String.startsWith("iVBORw0KGgo")) return "image/png"; // PNG
    if (base64String.startsWith("UklGR")) return "image/webp"; // WebP
    return "image/png"; // Mặc định trả về PNG nếu không phát hiện được loại
  };

  // Hàm tải mã QR từ API
  const fetchQRCode = async (ticketId: any, quantity: number) => {
    try {
      // Check if ticketId contains an underscore
      const splitTicketId = ticketId.split("_");
      const isMultiQR = splitTicketId.length > 1 && splitTicketId[1] !== null;

      // Construct the appropriate URL based on the ticketId format
      const url = isMultiQR
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/Ticket/multiqr/${ticketId}/${quantity}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/Ticket/qr/${ticketId}`;

      const response = await fetch(url, {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch QR code");

      const result = await response.json();
      return result.statusCode === 200 ? result.data : null;
    } catch (error) {
      console.error(`Error fetching QR code for ticket ID ${ticketId}:`, error);
      return null;
    }
  };

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const userId = Cookies.get("id");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/History/get/${userId}`,
        {
          credentials: "include",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      if (result.statusCode === 200 && Array.isArray(result.data)) {
        const completedTickets = await Promise.all(
          result.data
            .filter((order: any) => order.status === 0)
            .flatMap((order: any) =>
              order.orderDetails.map(async (detail: any) => {
                const startDate = detail.ticket.startDate;
                const formattedDate = formatDate(startDate);
                const { imageUrl } = await fetchImage(detail.ticket.image);

                // Fetch QR code for each ticket
                const qrCodeData = await fetchQRCode(
                  detail.ticketId,
                  detail.quantity
                ); // Fetch the QR code data from the API

                return {
                  id: detail.orderDetailId,
                  ticketId: detail.ticketId,
                  name: detail.ticket.name,
                  date: formattedDate,
                  cost: detail.ticket.cost,
                  quantity: detail.quantity,
                  sellerId: detail.ticket.sellerId,
                  fullname: detail.ticket.seller.fullname,
                  description: detail.ticket.description || "Không có mô tả",
                  categories: detail.ticket.categories || ["Chung"],
                  image: imageUrl || detail.ticket.image,
                  location: detail.ticket.location,
                  rated: detail.rated,
                  qrcode: qrCodeData || null, // Add QR code data (result.data) here
                };
              })
            )
        );
        setTickets(completedTickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCodes = async (ticket: any) => {
    console.log("downloadQRCodes called with ticket:", ticket);
    try {
      // Check if we have multiple QR codes
      const qrCodes = Array.isArray(ticket.qrcode)
        ? ticket.qrcode
        : [ticket.qrcode];

      // Create a zip file if we have multiple QR codes
      if (qrCodes.length > 1) {
        const zip = new JSZip();

        // Add each QR code to the zip file
        qrCodes.forEach((qrCode: string, index: number) => {
          let qrDataUrl = qrCode;
          if (qrDataUrl.startsWith("iVBORw0KGgo")) {
            qrDataUrl = "data:image/png;base64," + qrDataUrl;
          } else if (qrDataUrl.startsWith("/9j/")) {
            qrDataUrl = "data:image/jpeg;base64," + qrDataUrl;
          } else if (qrDataUrl.startsWith("UklGR")) {
            qrDataUrl = "data:image/webp;base64," + qrDataUrl;
          }

          const base64Data = qrDataUrl.split(",")[1];
          const mimeType = detectMimeType(base64Data);
          const extension = mimeType.split("/")[1];

          zip.file(
            `ticket-${ticket.ticketId}-${index + 1}.${extension}`,
            base64Data,
            { base64: true }
          );
        });

        // Generate and download the zip file
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = `tickets-${ticket.ticketId}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Handle single QR code (existing logic)
        let qrDataUrl = ticket.qrcode;

        if (qrDataUrl.startsWith("iVBORw0KGgo")) {
          qrDataUrl = "data:image/png;base64," + qrDataUrl;
        } else if (qrDataUrl.startsWith("/9j/")) {
          qrDataUrl = "data:image/jpeg;base64," + qrDataUrl;
        } else if (qrDataUrl.startsWith("UklGR")) {
          qrDataUrl = "data:image/webp;base64," + qrDataUrl;
        }

        const base64Data = qrDataUrl.split(",")[1];
        const mimeType = detectMimeType(base64Data);
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ticket-${ticket.ticketId}.${mimeType.split("/")[1]}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading QR code:", error);
      alert("Có lỗi xảy ra khi tải mã QR.");
    }
  };

  const calculateDaysFromNow = (startDate: string) => {
    // Parse ngày từ format "DD/MM/YYYY, HH:mm"
    const [datePart, timePart] = startDate.split(", ");
    const [day, month, year] = datePart.split("/");
    const [hours, minutes] = timePart.split(":");

    // Tạo date object với các thành phần đã parse
    // Note: month trong JS bắt đầu từ 0 nên phải trừ 1
    const eventDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );

    // Kiểm tra tính hợp lệ của ngày
    if (isNaN(eventDate.getTime())) {
      return "Ngày sự kiện không hợp lệ";
    }

    // Lấy thời gian hiện tại và reset về đầu ngày theo giờ địa phương
    const now = new Date();
    const nowAtMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );

    // Reset eventDate về đầu ngày theo giờ địa phương
    const eventAtMidnight = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      0,
      0,
      0
    );

    // Tính số milliseconds giữa hai ngày
    const diffTime = eventAtMidnight.getTime() - nowAtMidnight.getTime();
    // Chuyển đổi thành số ngày
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Debug log với format địa phương
    // console.log({
    //   startDate,
    //   eventDate: eventDate.toLocaleString(),
    //   nowAtMidnight: nowAtMidnight.toLocaleString(),
    //   eventAtMidnight: eventAtMidnight.toLocaleString(),
    //   diffDays
    // });

    if (diffDays < 0) {
      return "Đã diễn ra";
    } else if (diffDays === 0) {
      return "Diễn ra hôm nay";
    } else {
      return "Sắp diễn ra";
    }
  };

  // Ví dụ sử dụng:

  const formatDate = (startDate: string) => {
    if (!startDate) return "Ngày không hợp lệ";
    const date = new Date(startDate);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const sortedAndFilteredTickets = useMemo(() => {
    let filtered = tickets.filter((ticket) => {
      const matchesSearch =
        ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.sellerId &&
          ticket.sellerId.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        filterStatus === "all" ||
        calculateDaysFromNow(ticket.date).includes(filterStatus);

      const matchesCategory =
        selectedCategory === "all" ||
        ticket.categories?.includes(selectedCategory);

      return matchesSearch && matchesStatus && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "price") {
        return sortOrder === "asc" ? a.cost - b.cost : b.cost - a.cost;
      }
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
  }, [tickets, searchTerm, filterStatus, selectedCategory, sortBy, sortOrder]);

  const totalPages = Math.ceil(
    sortedAndFilteredTickets.length / ITEMS_PER_PAGE
  );
  const currentTickets = sortedAndFilteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (status: string) => {
    if (status.includes("Đã diễn ra")) return "bg-gray-100 text-gray-600";
    if (status.includes("hôm nay")) return "bg-green-100 text-green-600";
    return "bg-blue-100 text-blue-600";
  };

  const renderTicketCard = (ticket: TicketData) => (
    <motion.div
      key={ticket.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <TicketCard
        ticket={{
          ...ticket,
          status: calculateDaysFromNow(ticket.date),
        }}
        onCardClick={() => {
          setSelectedTicket(ticket);
          setIsModalOpen(true);
          handleGoogleMapSearch(ticket.location);
        }}
      />
    </motion.div>
  );
  const handleGoogleMapSearch = async (address: any) => {
    const locationData = await fetchLocation(address);

    if (locationData && locationData.results.length > 0) {
      const { lat, lng } = locationData.results[0].geometry.location;
      setCenter({ lat, lng });
    } else {
      console.log("No results found for the provided address.");
    }
  };

  const renderListItem = (ticket: TicketData) => (
    <motion.div
      key={ticket.id}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => {
          setSelectedTicket(ticket);
          setIsModalOpen(true);
        }}
      >
        <img
          src={ticket.image}
          alt={ticket.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{ticket.name}</h3>
          <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {ticket.date}
            </span>
            {ticket.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {ticket.location}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2">
            {ticket.categories?.map((category, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">
            {formatPrice(ticket.cost)}
          </p>
          <p className="text-sm text-gray-500">x{ticket.quantity}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-green-600 ">
                Quản lý vé của bạn
              </h1>
              <p className="text-gray-500">
                Theo dõi và quản lý tất cả các vé đã mua của bạn một cách dễ
                dàng
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                {sortedAndFilteredTickets.length} vé
              </motion.div>
              <div className="flex items-center gap-2">
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <div className="grid grid-cols-2 gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={`small-circle-${i}`}
                        className="w-1.5 h-1.5 rounded-sm bg-current"
                      />
                    ))}
                  </div>
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <div className="flex flex-col gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={`rect-${i}`}
                        className="w-6 h-1 rounded-sm bg-current"
                      />
                    ))}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="relative sm:col-span-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/80 backdrop-blur-sm"
                placeholder="Tìm kiếm theo tên vé hoặc người bán..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="sm:col-span-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full h-12 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-3 pl-4">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {filterStatus === "all"
                        ? "Tất cả trạng thái"
                        : filterStatus}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-lg border border-gray-200 bg-white">
                  <SelectItem
                    value="all"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Tất cả trạng thái
                  </SelectItem>
                  <SelectItem
                    value="Sắp diễn ra"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Sắp diễn ra
                  </SelectItem>
                  <SelectItem
                    value="Diễn ra hôm nay"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Diễn ra hôm nay
                  </SelectItem>
                  <SelectItem
                    value="Đã diễn ra"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Đã diễn ra
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full h-12 border border-gray-200 rounded-xl bg-white hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out">
                  <div className="flex items-center space-x-3">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span>Danh mục</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="border border-gray-200 rounded-xl shadow-lg bg-white">
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="comedy">Hài kịch</SelectItem>
                  <SelectItem value="conference">Hội nghị</SelectItem>
                  <SelectItem value="workshop">Hội thảo</SelectItem>
                  <SelectItem value="festival">Lễ hội</SelectItem>
                  <SelectItem value="magic">Ma thuật</SelectItem>
                  <SelectItem value="theater">Nhà hát</SelectItem>
                  <SelectItem value="dance">Nhảy múa</SelectItem>
                  <SelectItem value="sports">Thể thao</SelectItem>
                  <SelectItem value="exhibition">Triển lãm</SelectItem>
                  <SelectItem value="music">Âm nhạc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Select
                value={sortBy}
                onValueChange={(value: "date" | "price" | "name") =>
                  setSortBy(value)
                }
              >
                <SelectTrigger className="w-full h-12 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-3 pl-4">
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {sortBy === "date"
                        ? "Ngày"
                        : sortBy === "price"
                        ? "Giá"
                        : sortBy === "name"
                        ? "Sắp xếp theo"
                        : "Sắp xếp theo"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-lg border border-gray-200 bg-white">
                  <SelectItem
                    value="name"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Sắp xếp theo
                  </SelectItem>
                  <SelectItem
                    value="date"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Ngày
                  </SelectItem>
                  <SelectItem
                    value="price"
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Giá
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={`loading-placeholder-${index}`}
                  className="animate-pulse"
                >
                  <div className="bg-gray-200 h-48 rounded-t-lg" />
                  <div className="p-6 space-y-4 bg-white rounded-b-lg">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tickets Display */}
          {!isLoading && (
            <>
              <AnimatePresence mode="wait">
                {currentTickets.length > 0 ? (
                  <motion.div
                    key="tickets"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                          : "space-y-4"
                      }
                    >
                      {currentTickets.map(
                        (ticket) =>
                          viewMode === "grid"
                            ? renderTicketCard(ticket) // Không cần thêm key ở đây vì đã có trong renderTicketCard
                            : renderListItem(ticket) // Không cần thêm key ở đây vì đã có trong renderListItem
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <div className="bg-gray-50 rounded-full p-6 mb-6">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Không tìm thấy vé nào
                    </h3>
                    <p className="text-gray-500 mt-2 text-center max-w-md">
                      Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc của
                      bạn
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      <LoadScript googleMapsApiKey="AlzaSy7A_nU8ZLyo2CpKnG8jzdIns81KrCC-zAI">
        {isModalOpen && selectedTicket && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto mt-20"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-4 top-4 z-10 p-2 bg-black/20 hover:bg-black/30 rounded-full transition-colors text-white"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="relative h-64">
                  <img
                    src={selectedTicket.image}
                    alt={selectedTicket.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {selectedTicket.name}
                    </h3>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{selectedTicket.date}</span>
                      </span>
                      {selectedTicket.location && (
                        <span className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedTicket.location}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6 overflow-auto">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                          <Info className="w-5 h-5 text-blue-500" />
                          <span>Chi tiết sự kiện</span>
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {selectedTicket.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                          <span>Bản đồ</span>
                        </h4>
                        <div className="w-full h-64">
                          {/* Nhúng Google Map ở đây */}

                          <GoogleMap
                            mapContainerStyle={{
                              width: "300px",
                              height: "250px",
                            }}
                            center={center} // Tọa độ trung tâm (có thể thay đổi theo vị trí thực tế)
                            zoom={15}
                          >
                            <Marker position={center} />
                          </GoogleMap>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                          <User className="w-5 h-5 text-blue-500" />
                          <span>Thông tin người bán</span>
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {selectedTicket.fullname}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                          <CreditCard className="w-5 h-5 text-blue-500" />
                          <span>Thông tin thanh toán</span>
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Giá mỗi vé</span>
                            <span className="font-semibold">
                              {formatPrice(selectedTicket.cost)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Số lượng</span>
                            <span className="font-semibold">
                              {selectedTicket.quantity}
                            </span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Tổng tiền</span>
                              <span className="text-lg font-bold text-green-600">
                                {formatPrice(
                                  selectedTicket.cost * selectedTicket.quantity
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-blue-500" />
                          <span>Trạng thái</span>
                        </h4>
                        <div
                          className={`inline-flex items-center px-4 py-2 rounded-full ${getStatusColor(
                            calculateDaysFromNow(selectedTicket.date)
                          )}`}
                        >
                          {calculateDaysFromNow(selectedTicket.date)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-end space-x-4">
                      <button
                        onClick={() => downloadQRCodes(selectedTicket)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        <span>Tải về</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </LoadScript>
    </div>
  );
};

export default MyTicketPage;
