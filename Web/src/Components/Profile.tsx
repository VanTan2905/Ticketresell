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
import { useParams } from "next/navigation";

const Profile = () => {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [userProfile, setUserProfile] = useState<UserProfileCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);

        if (!id) {
          throw new Error("User ID not found in cookies");
        }
        const profile = await fetchUserProfile(id);
        setUserProfile(profile);
      } catch (err) {
        setError("Failed to load user profile. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    console.log("adasdsa");
    loadUserProfile();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!userProfile) return <div>No user profile found.</div>;

  return (
    <UserProfilePage
      isadjustvisible={false}
      isSellerProfile={true}
      userProfile={userProfile}
    />
  );
};

export default Profile;
