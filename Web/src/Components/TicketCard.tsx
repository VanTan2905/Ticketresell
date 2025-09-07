import React, { useState } from "react";
import {
  Award,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  MessageSquare,
  Star,
  ThumbsUp,
  Ticket,
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/Components/ui/tooltip";
import SuccessModal from "./successModal";

const TicketCard: React.FC<{ ticket: any; onCardClick: any }> = ({
  ticket,
  onCardClick,
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const handleStarClick = (e: any) => {
    e.stopPropagation(); // Prevent card click event
    setIsRatingModalOpen(true);
  };
  const getRatingInfo = (rating: 1 | 2 | 3 | 4 | 5) => {
    const infos = {
      5: {
        title: "Tuyệt vời! ✨",
        description: "Trải nghiệm hoàn hảo, vượt mong đợi",
        color: "text-yellow-400",
        icon: <Award className="w-5 h-5" />,
      },
      4: {
        title: "Rất tốt 👍",
        description: "Hài lòng với trải nghiệm",
        color: "text-green-500",
        icon: <ThumbsUp className="w-5 h-5" />,
      },
      3: {
        title: "Bình thường 😊",
        description: "Trải nghiệm ở mức chấp nhận được",
        color: "text-blue-500",
        icon: <MessageSquare className="w-5 h-5" />,
      },
      2: {
        title: "Cần cải thiện 🤔",
        description: "Có một số điểm chưa hài lòng",
        color: "text-orange-500",
        icon: <Clock className="w-5 h-5" />,
      },
      1: {
        title: "Không hài lòng 😔",
        description: "Trải nghiệm không tốt",
        color: "text-red-500",
        icon: <MessageSquare className="w-5 h-5" />,
      },
    };
    return infos[rating] || {};
  };

  const calculateDaysFromNow = (startDate: string) => {
    const [datePart, timePart] = startDate.split(", ");
    const [day, month, year] = datePart.split("/");
    const [hours, minutes] = timePart.split(":");

    const eventDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );

    if (isNaN(eventDate.getTime())) {
      return "Ngày sự kiện không hợp lệ";
    }

    const now = new Date();
    const nowAtMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );

    const eventAtMidnight = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      0,
      0,
      0
    );

    const diffTime = eventAtMidnight.getTime() - nowAtMidnight.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "Đã diễn ra";
    } else if (diffDays === 0) {
      return "Diễn ra hôm nay";
    } else {
      return "Sắp diễn ra";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSubmitRating = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Rating/create`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sellerId: ticket.sellerId,
            stars: rating,
            comment: comment,
            orderDetailId: ticket.id,
          }),
        }
      );
      // Parse response
      const result = await response.json();

      // Check if request was successful
      if (!response.ok) {
        console.error("Error submitting rating:", result.message);
      } else {
        console.log("Rating submitted successfully:", result);
        ticket.rated = 1;
        setShowSuccessModal(true);
      }

      setIsRatingModalOpen(false);
      setComment("");
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };
  const closeModal = () => {
    setShowSuccessModal(false);
  };
  const getStatusColor = (status: any) => {
    if (status.includes("Đã diễn ra")) return "bg-gray-100 text-gray-600";
    if (status.includes("hôm nay")) return "bg-green-100 text-green-600";
    return "bg-blue-100 text-blue-600";
  };

  return (
    <>
      <Card
        className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 bg-white/90 backdrop-blur-sm"
        onClick={onCardClick}
      >
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <img
              src={ticket.image}
              alt={ticket.name}
              className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
              className={`absolute left-4 top-4 ${getStatusColor(
                calculateDaysFromNow(ticket.date)
              )} px-4 py-1.5 rounded-full text-sm font-medium shadow-sm`}
            >
              {calculateDaysFromNow(ticket.date)}
            </div>
            {ticket.categories && (
              <div className="absolute right-4 top-4 flex gap-2">
                {ticket.categories.map((category: any, index: any) => (
                  <span
                    key={index}
                    className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
            {/* Updated Star Icon with click handler and hover effects */}
            <button
              onClick={ticket.rated === 1 ? undefined : handleStarClick}
              className={`absolute right-4 bottom-4 p-2 rounded-full transition-colors z-10 ${
                ticket.rated === 1
                  ? "text-gray-400 fill-gray-400 cursor-not-allowed"
                  : "hover:bg-white/10"
              }`}
              disabled={ticket.rated === 1}
            >
              <Star
                className={`w-6 h-6 ${
                  ticket.rated === 1
                    ? "text-gray-200 fill-gray-200"
                    : "text-yellow-400 fill-yellow-400"
                }`}
              />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                {ticket.name}
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Ticket className="w-5 h-5 text-blue-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Xem chi tiết vé</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{ticket.date}</span>
              </div>

              {ticket.location && (
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{ticket.location}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-gray-600">
                <CreditCard className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Số lượng: {ticket.quantity}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Giá mỗi vé</span>
                <p className="text-lg font-bold text-green-600">
                  {formatPrice(ticket.cost)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl sm:rounded-3xl bg-white/95 backdrop-blur-lg p-6 transition-all duration-300 ease-in-out border shadow-2xl z-[9999]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-800 mb-1">
              Đánh giá trải nghiệm
            </DialogTitle>
            <p className="text-center text-gray-600 mt-1">
              Chia sẻ đánh giá của bạn để chúng tôi có thể cải thiện dịch vụ
            </p>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-6 py-6">
            {/* Stars */}
            <div className="flex space-x-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="focus:outline-none transform transition-all duration-300 hover:scale-125"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <Star
                    className={`w-12 h-12 transition-all duration-300 ${
                      star <= (hover || rating)
                        ? "text-yellow-400 fill-yellow-400 filter drop-shadow-lg"
                        : "text-gray-200 hover:text-gray-300"
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            {/* Rating Info */}
            <div className="min-h-[60px] text-center">
              {rating > 0 && (
                <div className="space-y-1 animate-fade-in">
                  <div
                    className={`flex items-center justify-center gap-2 text-lg font-semibold ${
                      getRatingInfo(rating as 1 | 2 | 3 | 4 | 5).color
                    }`}
                  >
                    {getRatingInfo(rating as 1 | 2 | 3 | 4 | 5).icon}
                    <span>
                      {getRatingInfo(rating as 1 | 2 | 3 | 4 | 5).title}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {getRatingInfo(rating as 1 | 2 | 3 | 4 | 5).description}
                  </p>
                </div>
              )}
            </div>

            {/* Comment Box */}
            <div className="w-full space-y-2">
              <label className="text-gray-700 font-medium text-sm">
                Chi tiết đánh giá
              </label>
              <Textarea
                placeholder="Chia sẻ trải nghiệm chi tiết của bạn..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] w-full resize-none rounded-2xl border-gray-200 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-all duration-300 placeholder:text-gray-400
                       text-gray-700 text-base p-3 shadow-sm hover:border-gray-300"
              />
              <p className="text-xs text-gray-500">
                Đánh giá của bạn sẽ giúp chúng tôi nâng cao chất lượng dịch vụ
              </p>
            </div>
          </div>

          <DialogFooter className="sm:space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsRatingModalOpen(false)}
              className="w-full sm:w-auto rounded-2xl border-gray-200 hover:bg-gray-50 
                     text-gray-600 transition-all duration-300 py-4 text-base font-medium
                     hover:border-gray-300"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitRating}
              disabled={!rating}
              className={`w-full sm:w-auto rounded-2xl transition-all duration-300 py-4 text-base font-medium
              ${
                !rating
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {rating ? "Gửi đánh giá" : "Vui lòng chọn số sao"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showSuccessModal && <SuccessModal onClose={closeModal} />}
    </>
  );
};

export default TicketCard;
