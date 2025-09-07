import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InputField: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }
> = ({ icon, ...props }) => (
  <div className="relative mt-5">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
      {icon}
    </div>
    <input
      className="w-full pl-10 pr-3 py-4 bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
      {...props}
    />
  </div>
);

const ActionButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
}> = ({ children, onClick, isLoading }) => (
  <motion.button
    className="w-full px-4 py-4 mt-6 font-bold text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all disabled:opacity-50"
    onClick={onClick}
    disabled={isLoading}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {isLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
        Đang gửi...
      </>
    ) : (
      children
    )}
  </motion.button>
);

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const notifySuccess = (message: string) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const notifyError = (message: string) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split("@");
    if (!username || !domain) return email;
    return `${username.slice(0, 2)}${"*".repeat(
      username.length - 2
    )}@${domain}`;
  };

  const handleSubmit = async () => {
    if (!email) {
      notifyError("Vui lòng nhập địa chỉ email.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Mail/sendPasswordKey`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ to: email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send reset link");
      }

      setSuccess(true);
      notifySuccess("Một liên kết đổi mật khẩu đã được gửi đến email của bạn.");
    } catch (err) {
      notifyError("Gửi email không thành công. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-20 p-10 max-w-lg mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold">
              <span className="text-green-500">Ticket</span>
              <span className="text-black">Resell</span>
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            {!success ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Quên mật khẩu</h2>
                  <p className="text-gray-600 mt-2">
                    Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                  </p>
                </div>

                <InputField
                  icon={<FaEnvelope />}
                  type="email"
                  placeholder="Địa chỉ email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <ActionButton onClick={handleSubmit} isLoading={isLoading}>
                  Gửi liên kết đặt lại mật khẩu
                </ActionButton>
              </>
            ) : (
              <div className="text-center py-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Một liên kết đổi mật khẩu đã được gửi đến gmail của{" "}
                  {maskEmail(email)}. Vui lòng check gmail của bạn
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;
