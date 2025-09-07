"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCartShopping,
  faCashRegister,
  faLocationDot,
  faMinus,
  faPlus,
  faTag,
  faUser,
  faShare,
  faHeart,
  faInfoCircle,
  faClock,
  faShieldHalved,
  faTicket,
  faStar,
  faArrowRight,
  faMapMarkerAlt,
  faLock,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { NumberContext } from "./NumberContext";
import { checkLogin } from "./checkLogin";
import Dropdown from "./Dropdown";
import RelatedTicket from "./RelatedTicket";
import Notification_Popup from "./Notification_PopUp";
import { fetchRemainingByID } from "@/models/TicketFetch";
import { fetchImage } from "@/models/FetchImage";
import addToCart from "@/Hooks/addToCart";

interface TicketDetail {
  id: string;
  message: React.ReactNode;
}

type Category = {
  categoryId: string;
  name: string;
  description: string;
};
type seller = {
  userId: string;
  username: string;
  fullname: string;
};

type Ticket = {
  name: string;
  cost: number;
  location: string;
  startDate: string;
  author: seller;
  imageId: string;
  imageUrl: string;
  description: string;
  categories: Category[];
};
const DEFAULT_IMAGE =
  "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517";

const TicketDetail = () => {
  const [ticketresult, setTicketresult] = useState<Ticket | null>(null);
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [categoriesId, setCategories] = useState<string[]>([]);
  const [remainingItems, setRemainingItems] = useState(0);
  const router = useRouter();
  const userId = Cookies.get("id");
  const [checkOwner, setCheckOwner] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState(false);
  const splitId = () => {
    if (id) {
      return id.split("_")[0];
    } else {
      console.error("id.fullTicketId is undefined or null");
      return null;
    }
  };
  const baseId = splitId();
  const context = useContext(NumberContext);

  const [count, setCount] = useState(1);
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const increase = () => {
    setCount(count + 1);
  };

  const decrease = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const fetchTicketById = async (id: string | null) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Ticket/readbyid/${baseId}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching ticket result:", error);
      return null;
    }
  };
  const checkRemaining = async () => {
    try {
      const response = await fetchRemainingByID(baseId);
      setRemainingItems(response);
    } catch (error) {
      console.error("Error fetching ticket result:", error);
      return null;
    }
  };

  const { addItem } = addToCart();

  const handleAddToCart = async () => {
    const check = await checkLogin();
    if (check == "False") {
      router.push("/login");
    } else {
      const result = await addItem({
        UserId: userId,
        TicketId: id,
        Quantity: count,
      });
      if (result) {
        setShowPopup(true);

        const increaseNumber = () => {
          if (context) {
            const { number, setNumber } = context;

            let num = Number(number) || 0;
            num += 1;
            setNumber(num);
            console.log("change cart count to ", num);
          }
        };
        increaseNumber();
        console.log("Item added to cart successfully:", result);
      } else {
        console.error("Failed to add item to cart");
      }
    }
  };
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  useEffect(() => {
    const loadresult = async () => {
      console.log("Fetched ID:", id);
      if (id) {
        const result = await fetchTicketById(id);
        console.log(result);

        result.data.imageUrl = DEFAULT_IMAGE;
        if (result.data.image) {
          const { imageUrl: fetchedImageUrl, error } = await fetchImage(
            result.data.image
          );
          if (fetchedImageUrl) {
            result.data.imageUrl = fetchedImageUrl;
          } else {
            console.error(
              `Error fetching image for ticket ${result.data.image}: ${error}`
            );
          }
        }
        if (result) {
          const ticketDetail: Ticket = {
            imageUrl: result.data.imageUrl,
            imageId: result.data.image,
            name: result.data.name,
            startDate: new Date(result.data.startDate).toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              year: "numeric",
              day: "2-digit",
              month: "2-digit",
              hour12: false,
              timeZone: "Asia/Ho_Chi_Minh",
            }),
            author: result.data.seller,
            location: `${result.data.location}`,
            cost: result.data.cost,
            description: result.data.description,
            categories: result.data.categories.map((category: any) => ({
              categoryId: category.categoryId,
              name: category.name,
              description: category.description,
            })),
          };
          setTicketresult(ticketDetail);
          if (result.data.seller.userId == userId) {
            setCheckOwner(true);
          }
          const categoryIds = ticketDetail.categories.map(
            (category: any) => category.categoryId
          );
          setCategories(categoryIds);
          console.log(categoryIds);
        }
      } else {
        console.error("ID is undefined or invalid.");
      }
    };
    checkRemaining();
    loadresult();
  }, [id]);

  if (!ticketresult) {
    return (
      <p className="text-center text-xl mt-8 text-red-600">
        Chi tiết vé không thể tải. Vui lòng thử lại sau.
      </p>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section with Solid White Background */}
      <div className="relative h-64 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>{" "}
        {/* Lớp phủ đen */}
        <div className="absolute inset-0 bg-white opacity-109"></div>{" "}
        {/* Họa tiết nền */}
        <div className="container mx-auto px-4 h-full flex items-end pb-16">
          <nav className="text-white/90 text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href="/tickets"
                  className="hover:text-white transition-colors"
                >
                  Vé
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium truncate max-w-[200px]">
                {ticketresult?.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-32 pb-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="w-full lg:w-5/12 space-y-6">
            {/* Image Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden group">
              <div className="relative">
                <img
                  className="w-full h-[500px] object-cover transform transition-transform duration-500 group-hover:scale-105"
                  src={ticketresult?.imageUrl}
                  alt={ticketresult?.name}
                />
                <div className="absolute top-4 right-4 space-x-2">
                  <button className="bg-white/95 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:-translate-y-1">
                    <FontAwesomeIcon
                      icon={faShare}
                      className="text-gray-700 w-5 h-5"
                    />
                  </button>
                  <button className="bg-white/95 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:-translate-y-1">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="text-gray-700 w-5 h-5"
                    />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {ticketresult?.name}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm font-medium">
                      {remainingItems} vé còn lại
                    </span>
                    <div className="flex items-center text-white/90">
                      <FontAwesomeIcon icon={faClock} className="mr-2" />
                      <span className="text-sm">Ưu đãi có thời hạn</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="text-green-600 w-6 h-6"
                  />
                  Thông tin sự kiện
                </h3>
                <span className="text-sm text-gray-500">#{id}</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-green-600 w-5 h-5 mt-1"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">Địa điểm</h4>
                    <p className="text-gray-600">{ticketresult?.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-green-600 w-5 h-5 mt-1"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">Ngày & Giờ</h4>
                    <p className="text-gray-600">{ticketresult?.startDate}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Mô tả sự kiện</h4>
                <p className="text-gray-600 leading-relaxed">
                  {ticketresult?.description}
                </p>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Danh mục</h4>
                <div className="flex flex-wrap gap-2">
                  {ticketresult?.categories.map((category) => (
                    <Link
                      key={category.categoryId}
                      href={{
                        pathname: `/search`,
                        query: { cateName: category.name },
                      }}
                    >
                      <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                        <FontAwesomeIcon
                          icon={faTag}
                          className="mr-2 w-4 h-4"
                        />
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-7/12 space-y-6">
            {/* Purchase Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Seller Info */}
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-white text-2xl"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Người bán đã xác thực
                    </p>
                    <Link
                      href={`/sellshop/${ticketresult?.author.userId}`}
                      className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors"
                    >
                      {ticketresult?.author.fullname}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center text-green-600">
                  <FontAwesomeIcon icon={faShieldHalved} className="mr-2" />
                  <span className="text-sm font-medium">
                    Đảm bảo chính hãng
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Giá mỗi vé</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-4xl font-bold text-gray-900">
                        {formatVND(ticketresult?.cost)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      onClick={decrease}
                      disabled={count <= 1}
                    >
                      <FontAwesomeIcon
                        icon={faMinus}
                        className="text-gray-600"
                      />
                    </button>
                    <span className="text-2xl font-semibold w-16 text-center">
                      {count}
                    </span>
                    <button
                      className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      onClick={increase}
                      disabled={count >= remainingItems}
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="text-gray-600"
                      />
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="p-6 bg-gray-50 rounded-xl">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {formatVND(ticketresult?.cost * count)}
                    </span>
                  </div>

                  <div className="h-px bg-gray-200 my-4"></div>
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      Tổng cộng (chưa bao gồm thuế)
                    </span>
                    <span className="font-bold text-xl">
                      {formatVND(ticketresult?.cost * count)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {!checkOwner && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className="col-span-1 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300"
                      onClick={handleAddToCart}
                    >
                      <FontAwesomeIcon icon={faCartShopping} />
                      <span>Thêm vào giỏ hàng</span>
                    </button>
                    <button className="col-span-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300">
                      <FontAwesomeIcon icon={faCashRegister} />
                      <span>Mua ngay</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Security Features */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="text-green-600 w-5 h-5 mt-1"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Giao dịch an toàn
                    </h4>
                    <p className="text-sm text-gray-600">
                      Protected by SSL encryption
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-600 w-5 h-5 mt-1"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Sự kiện đã được xác minh
                    </h4>
                    <p className="text-sm text-gray-600">
                      100% authentic tickets
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <Dropdown
                title="Đánh giá & Xếp hạng"
                content={ticketresult?.description}
                dropdownStatus={true}
                iconDropdown="faShop"
              />
            </div>
          </div>
        </div>

        {/* Related Tickets Section */}
        <section className="mt-8 md:mt-16 px-4 md:px-0">
          <div className=" rounded-lg md:rounded-2xl  p-4 md:p-8 transition-shadow duration-200 ">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              <RelatedTicket categoriesId={categoriesId} ticketID={baseId} />
            </div>
          </div>
        </section>

        {/* Enhanced Notification Popup */}
        <Notification_Popup
          message={
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCartShopping}
                  className="text-green-600 w-5 h-5"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Đã thêm vào giỏ hàng!
                </h3>
                <p className="text-sm text-gray-600">
                  Vé của bạn đã được thêm thành công
                </p>
              </div>
            </div>
          }
          show={showPopup}
          onClose={handleClosePopup}
        />

        {/* Floating Action Buttons - Mobile Only */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="flex space-x-4">
            {!checkOwner && (
              <>
                <button
                  className="flex-1 bg-white border-2 border-green-600 text-green-600 font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2"
                  onClick={handleAddToCart}
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                  <span>Thêm vào giỏ hàng</span>
                </button>
                <button className="flex-1 bg-green-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2">
                  <FontAwesomeIcon icon={faCashRegister} />
                  <span>Mua ngay</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Quick Info Bar - Sticky on Scroll */}
        <div className="hidden lg:block fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 transform transition-transform duration-300 z-40 translate-y-0">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h3 className="font-semibold text-gray-900 truncate max-w-[300px]">
                  {ticketresult?.name}
                </h3>
                <span className="text-sm text-gray-500">|</span>
                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-sm">{ticketresult?.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Giá</p>
                  <p className="font-semibold text-gray-900">
                    {formatVND(ticketresult?.cost)}
                  </p>
                </div>
                {!checkOwner && (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
                    onClick={handleAddToCart}
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Event Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon
                icon={faTicket}
                className="text-green-600 w-6 h-6"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Nhận vé ngay lập tức
              </h3>
              <p className="text-sm text-gray-600">
                Vé sẽ được gửi qua email của bạn ngay sau khi thanh toán
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon
                icon={faShieldHalved}
                className="text-green-600 w-6 h-6"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Mua hàng an toàn
              </h3>
              <p className="text-sm text-gray-600">
                Xử lý thanh toán 100% an toàn
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon
                icon={faStar}
                className="text-green-600 w-6 h-6"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Hỗ trợ khách hàng
              </h3>
              <p className="text-sm text-gray-600">
                Đội ngũ hỗ trợ tận tâm 24/7
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-24 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
      >
        <FontAwesomeIcon icon={faArrowRight} className="rotate-270 w-5 h-5" />
      </button>
    </div>
  );
};

export default TicketDetail;
