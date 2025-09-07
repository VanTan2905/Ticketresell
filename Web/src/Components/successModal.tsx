import React from "react";
import ReactDOM from "react-dom";

interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50 transition-opacity duration-300 ease-out">
      <div className="bg-white p-8 rounded-3xl shadow-2xl text-center w-96 transform transition-all duration-300 ease-out scale-100 hover:scale-105">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Đã đánh giá thành công!</h2>
        <p className="text-gray-600 mb-6">
          Cảm ơn đánh giá của bạn. Đánh giá của bản sẽ giúp chúng tôi cải thiện dịch vụ.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-3 mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold text-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-green-300 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

export default SuccessModal;
