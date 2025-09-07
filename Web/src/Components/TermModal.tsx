import React from "react";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-11/12  max-w-4xl rounded-lg shadow-2xl relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
        
        {/* Header */}
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            HỢP ĐỒNG THỎA THUẬN
          </h2>
        </div>

        {/* Content */}
        <ScrollArea className="h-[50vh] my-4">
          <div className="space-y-6 px-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-bold text-lg text-gray-800 mb-3">
                Điều khoản chung
              </div>
              <p className="text-gray-600 leading-relaxed">
                TICKETRESELL sẽ cung cấp dịch vụ trung gian, tạo điều kiện để
                bạn có thể dễ dàng trao đổi, mua bán vé một
                cách thuận tiện. Bằng việc đăng ký và sử dụng dịch vụ của
                trang web, việc bạn đồng ý với các điều khoản sau đây
                là điều kiện bắt buộc khi sử dụng dịch vụ của chúng tôi.
              </p>
            </div>

            <div className="font-bold text-lg text-gray-800">
              Điều khoản thỏa thuận
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="font-semibold text-gray-800 mb-2">
                1. Vai trò trung gian
              </div>
              <p className="text-gray-600 leading-relaxed">
                Trang web là bên trung gian đứng ra cung cấp nền tảng để người
                bán và người mua vé có thể kết nối với nhau. Người bán đồng ý
                trả phí hoa hồng 5% từ mỗi giao dịch bán vé thành công, được
                trừ trực tiếp từ giá trị của vé tại thời điểm người mua thanh
                toán.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="font-semibold text-gray-800 mb-2">
                2. Cam kết về tính xác thực của vé
              </div>
              <p className="text-gray-600 leading-relaxed mb-3">
                Người bán cam kết rằng các vé được cung cấp qua trang web là
                vé hợp pháp và có giá trị sử dụng, đảm bảo 100% tính xác thực
                của mã QR.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  Mã QR cung cấp phải hợp lệ, có thể quét và được công nhận
                  tại sự kiện.
                </li>
                <li>
                  Người bán chịu trách nhiệm về mọi vấn đề liên quan đến tính
                  xác thực của vé và mã QR.
                </li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="font-semibold text-gray-800 mb-2">
                3. Hình thức bán vé và quy trình thanh toán
              </div>
              <p className="text-gray-600 leading-relaxed mb-3">
                Việc bán vé sẽ diễn ra hoàn toàn trên nền tảng trực tuyến của
                trang web.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  Sau khi người mua thanh toán thành công, hệ thống sẽ gửi mã
                  QR của vé đến người mua.
                </li>
                <li>
                  Người bán có trách nhiệm đảm bảo rằng mã QR là chính xác và
                  hoạt động bình thường.
                </li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="font-semibold text-gray-800 mb-2">
                4. Hoa hồng trung gian
              </div>
              <p className="text-gray-600 leading-relaxed">
                Trang web sẽ tự động trừ phí hoa hồng 5% trên mỗi giao dịch
                thành công.
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-gray-100 transition-colors duration-200"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;