"use client";
import React from "react";
import {
  fetchUserProfile,
  UserProfileCard,
  UserProfilePage,
} from "@/models/UserProfileCard";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import "@/Css/UserProfile.css";

const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfileCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const id = Cookies.get("id");
        if (!id) {
          throw new Error("Không tìm thấy ID người dùng trong cookies");
        }
        const profile = await fetchUserProfile(id);
        setUserProfile(profile);
      } catch (err) {
        setError("Không thể tải hồ sơ người dùng. Vui lòng thử lại sau.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (isLoading) return <div>Đang tải...</div>;
  if (!userProfile) return <div>Không tìm thấy hồ sơ người dùng.</div>;

  return (
    <UserProfilePage
      isadjustvisible={true}
      isSellerProfile={false}
      userProfile={userProfile}
    />
  );
};

export default Profile;
