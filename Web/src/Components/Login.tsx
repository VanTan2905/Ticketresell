"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { getOTP } from "@/pages/api/getOTP";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

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
}> = ({ children, onClick }) => (
  <motion.button
    className="w-full px-4 py-4 mt-6 font-bold text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all"
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
);

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(
    null
  );
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const [otp, setOtp] = useState<number | null>(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const session = useSession();
  useEffect(() => {
    const handleLogin = async () => {
      if (session.status === "authenticated") {
        try {
          console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/authentication/login-google?accessToken=${(session?.data as { token?: { accessToken: string } })?.token?.accessToken}`);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/authentication/login-google?accessToken=${(session?.data as { token?: { accessToken: string } })?.token?.accessToken}`,
            {
              credentials: "include",
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          let navigationPath = "/";
          if (result.message === "False") {
            console.log("hello");
            
            // Navigate to the set password page
            Cookies.set("id", result.data.userId);
            Cookies.set("accessKey", result.data.passwordSetupToken);
            router.push("/setpassword");
          }
          
          if (!response.ok) {
            console.error("Lỗi đăng nhập:", result);
          } else { 
            Cookies.set("id", result.data.user.userId);
            Cookies.set("accessKey", result.data.accessKey);
            setLoginSuccessMessage("Đăng nhập thành công!");
            console.log("TEST1");
            // Determine navigation path based on user roles
            const userRoles = result.data.user.roles.map(
              (role: any) => role.rolename
            );
            
            console.log("TEST2");
            if (userRoles.includes("Admin")) {
              navigationPath = "/admin";
            } else if (userRoles.includes("Staff")) {
              navigationPath = "/staff";
            }
            
            console.log("TEST3");
            setTimeout(() => {
              setLoginSuccessMessage(null);
            }, 3000);
            
            console.log("TEST4");
            setTimeout(() => {
              router.push(navigationPath);
            }, 500);
          }
        } catch (error) {
          console.error("Lỗi trong quá trình đăng nhập:", error);
          setError("Đã xảy ra lỗi trong quá trình đăng nhập.");
        }
      }
    };
    handleLogin();
  }, [session]);

  useEffect(() => {
    if (timer > 0 && otpSent) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
    if (timer === 0) {
      setOtpSent(false);
      setOtp(null);
      alert("OTP đã hết hạn. Vui lòng yêu cầu một mã mới.");
    }
  }, [timer, otpSent]);

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

  const handleSignIn = async () => {
    if (!email || !password) {
      notifyError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Authentication/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Gmail: email,
            Password: password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Lỗi đăng nhập:", result);
        notifyError(result.message || "Email hoặc mật khẩu không hợp lệ.");
      } else {
        if (rememberMe) {
          Cookies.set("id", result.data.user.userId, { expires: 7 });
          Cookies.set("accessKey", result.data.accessKey, { expires: 7 });
        } else {
          Cookies.set("id", result.data.user.userId);
          Cookies.set("accessKey", result.data.accessKey);
        }
        notifySuccess("Đăng nhập thành công!");

        // Determine navigation path based on user roles
        let navigationPath = "/";
        const userRoles = result.data.user.roles.map(
          (role: any) => role.rolename
        );

        if (userRoles.includes("Admin")) {
          navigationPath = "/admin";
        } else if (userRoles.includes("Staff")) {
          navigationPath = "/staff";
        }

        setTimeout(() => {
          setLoginSuccessMessage(null);
        }, 3000);

        setTimeout(() => {
          router.push(navigationPath);
        }, 500);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
      notifyError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  const handleSignUp = async () => {
    if (!username || !name || !password) {
      notifyError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const response = await getOTP(username);
      if (response.status == "Success") {
        setOtpSent(true);
        setTimer(300);
        notifySuccess(
          "Một mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập mã bên dưới."
        );
      } else {
        notifyError("Gửi OTP thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Gửi OTP thất bại:", error);
      notifyError("Đã xảy ra lỗi khi gửi OTP. Vui lòng thử lại.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!enteredOtp) {
      notifyError("Vui lòng nhập mã OTP.");
      return;
    }

    try {
      const response = await fetch("/api/getOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:name,
          username: username,
          password: password,
          email: "default@gmail.com",
          otp: enteredOtp,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        notifySuccess("Xác minh OTP thành công! Đăng ký hoàn tất.");
        setActiveTab("login"); // Chuyển sang tab đăng nhập
        setOtpSent(false); // Đặt lại trạng thái OTP
        setEnteredOtp(""); // Xóa tr��ờng OTP
        setUsername(""); // Xóa tên người dùng
        setName(""); // Xóa tên
        setPassword(""); // Xóa mật khẩu
      } else {
        notifyError(data.message || "Xác minh OTP thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi trong quá trình xác minh OTP:", error);
      notifyError("Đã xảy ra lỗi khi xác minh OTP. Vui lòng thử lại.");
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
          <div className="flex mb-0">
            <button
              className={`w-full py-4 text-lg font-bold transition-all ${
                activeTab === "login"
                  ? "text-white bg-green-500"
                  : "text-gray-600 bg-transparent"
              } rounded-l-3xl`}
              onClick={() => setActiveTab("login")}
            >
              Đăng Nhập
            </button>
            <button
              className={`w-full py-4 text-lg font-bold transition-all ${
                activeTab === "register"
                  ? "text-white bg-green-500"
                  : "text-gray-600 bg-transparent"
              } rounded-r-3xl`}
              onClick={() => setActiveTab("register")}
            >
              Đăng Ký
            </button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            {activeTab === "login" ? (
              <>
                <InputField
                  icon={<FaEnvelope />}
                  type="email"
                  placeholder="Địa chỉ email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                  icon={<FaLock />}
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="mr-2"
                    />
                    <label htmlFor="rememberMe" className="text-gray-600">
                      Ghi nhớ tôi
                    </label>
                  </div>
                    <Link
                      href="/forgotpassword"
                      passHref
                      className="no-underline"
                    >
                      <span className="text-gray-600 cursor-pointer">
                        Quên mật khẩu?
                      </span>
                    </Link>
                </div>

                {error && <p className="text-red-500">{error}</p>}
                {loginSuccessMessage && (
                  <p className="text-green-500">{loginSuccessMessage}</p>
                )}
                <ActionButton onClick={handleSignIn}>Đăng Nhập</ActionButton>
                <div className="mt-4 text-center">
                  <p>hoặc</p>
                </div>
                <div className="mt-4">
                  <button
                    className="w-full flex items-center justify-center px-4 py-4 mt-6 font-bold text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-all"
                    onClick={() => signIn("google")}
                  >
                    <FaGoogle className="mr-2" /> Tiếp tục với Google
                  </button>
                </div>
              </>
            ) : (
              <>
                <InputField
                  icon={<FaUser />}
                  type="text"
                  placeholder="Địa chỉ email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <InputField
                  icon={<FaUser />}
                  type="text"
                  placeholder="Tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <InputField
                  icon={<FaLock />}
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {otpSent ? (
                  <>
                    <InputField
                      icon={<FaLock />}
                      type="text"
                      placeholder="Nhập mã OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                    />
                    <p className="text-gray-600">
                      Mã OTP sẽ hết hạn sau {timer} giây.
                    </p>
                    <ActionButton onClick={handleVerifyOtp}>
                      Xác minh OTP
                    </ActionButton>
                  </>
                ) : (
                  <ActionButton onClick={handleSignUp}>Đăng Ký</ActionButton>
                )}
                <div className="mt-4 text-center">
                  <p>hoặc</p>
                </div>
                <div className="mt-4">
                  <button className="w-full flex items-center justify-center px-4 py-4 mt-6 font-bold text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-all">
                    <FaGoogle className="mr-2" /> Tiếp tục với Google
                  </button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && (
                  <p className="text-green-500">{successMessage}</p>
                )}
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
