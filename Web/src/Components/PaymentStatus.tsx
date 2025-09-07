"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import React from "react";
const PaymentStatus = () => {
  const [countdown, setCountdown] = useState(3);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (hasFetchedRef.current) return; // Prevent double fetch
      hasFetchedRef.current = true;
      const method = searchParams ? searchParams.get("method") : null;
      const orderId = searchParams ? searchParams.get("orderId") : null;
      const token =
        method === "paypal"
          ? searchParams
            ? searchParams.get("token")
            : "default"
          : "default";

      console.log(method);
      console.log(orderId);
      if (!method || !orderId) {
        setSuccess(false);
        setLoading(false);
        return;
      }

      let apiEndpoint;
      switch (method) {
        case "momo":
          apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/Payment/momo/verify`;
          break;
        case "vnpay":
          apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/Payment/vnpay/verify`;
          break;
        case "paypal":
          apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/Payment/paypal/verify`;
          break;
        default:
          setSuccess(false);
          setLoading(false);
          return;
      }

      const requestBody = {
        orderId,
        token,
        orderInfo: {
          userId: "user-id-here", // Replace with actual user ID if needed
          selectedTicketIds: [], // This can be left empty as per your requirements
        },
      };
      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          credentials: "include",
        });

        const result = await response.json();
        setSuccess(result.statusCode === 200);
        setLoading(false);
      } catch (error) {
        console.error("Payment verification failed:", error);
        setSuccess(false);
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Đang xác thực thanh toán...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 mt-[40vh] mb-[50vh]">
      {success ? (
        <div className="flex items-center space-x-3">
          <FaCheckCircle className="text-green-500" size={50} />
          <p className="text-xl font-semibold text-green-500">
            Thanh toán thành công!
          </p>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <FaTimesCircle className="text-red-500" size={50} />
          <p className="text-xl font-semibold text-red-500">
            Thanh toán thất bại!
          </p>
        </div>
      )}

      <p className="mt-4 text-gray-500">
        Chuyển hướng trong {countdown} giây...
      </p>
    </div>
  );
};

export default PaymentStatus;
