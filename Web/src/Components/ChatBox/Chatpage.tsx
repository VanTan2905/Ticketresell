"use client";
import React, { useState, useEffect } from "react";
import UserRequest, { UserData } from "./UserRequest";
import Cookies from "js-cookie";

const Chatpage = () => {
  const userId = Cookies.get("id");

  const [cookieUser, setCookieUser] = useState<UserData | any>();

  const fetchSpecificUser = async () => {
    if (!userId) return;

    try {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/User/read/${userId}`
      );
      const response = await userResponse.json();
      console.log("API Response:", response);
      if (response.statusCode === 200 && response.data) {
        const userData: UserData = response.data;
        setCookieUser(userData);
      }
    } catch (error) {
      console.error("Error fetching specific user:", error);
    }
  };

  // Add this useEffect to see state changes
  useEffect(() => {
    console.log("User state updated:", cookieUser);
  }, [cookieUser]);

  // Call fetchUserData when component mounts
  useEffect(() => {
    fetchSpecificUser();
  }, []);

  return <UserRequest userData={cookieUser} userCookie={cookieUser} />;
};

export default Chatpage;