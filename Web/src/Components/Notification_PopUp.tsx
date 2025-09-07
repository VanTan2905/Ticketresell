import React, { ReactElement, useEffect } from "react";

interface SuccessPopupProps {
  message: ReactElement; // The message should be a string
  show: boolean; // 'show' should be a boolean (true/false)
  onClose: () => void; // 'onClose' is a function that takes no arguments and returns nothing (void)
}

const Notification_Popup: React.FC<SuccessPopupProps> = ({
  message,
  show,
  onClose,
}) => {
  // Tự động đóng popup sau 3 giây
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000); // Đóng sau 3 giây
      return () => clearTimeout(timer); // Dọn dẹp timer
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

      <div className="relative z-50 bg-white p-4 rounded shadow-lg text-center ">
        <p>
          {message}
        </p>

        <button
          className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default Notification_Popup;
