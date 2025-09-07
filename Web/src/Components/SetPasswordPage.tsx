"use client";
import SetPassword from "@/Components/SetPassword";
import { useRouter } from "next/navigation";
import React from "react";
import Cookies from "js-cookie";

const SetPasswordPage = () => {
  const router = useRouter();
  const handlePasswordSet = async (password: string) => {
    try {
      // Lấy UserId và PasswordSetupToken từ cookies
      const userId = Cookies.get("id");
      const passwordSetupToken = Cookies.get("accessKey");
      if (!userId || !passwordSetupToken) {
        throw new Error("Thiếu mã xác thực.");
      }
      // Gọi API để đặt mật khẩu
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authentication/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          password,
          passwordSetupToken,
        }),
      });
      if (!response.ok) {
        const contentType = response.headers.get("Content-Type");
        let errorMessage = "Không thể đặt mật khẩu";
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      // Chuyển hướng đến trang đăng nhập sau khi đặt mật khẩu thành công
      router.push("/");
    } catch (error) {
      // Xử lý lỗi (bạn có thể muốn hiển thị lỗi này cho người dùng)
      console.error("Lỗi khi đặt mật khẩu:", error);
      alert(
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định."
      );
    }
  };

  return (
    <SetPassword
      onSubmit={handlePasswordSet}
      title="Tạo Mật Khẩu Của Bạn"
      subtitle="Vui lòng đặt mật khẩu mạnh cho tài khoản của bạn"
    />
  );
};

export default SetPasswordPage;
