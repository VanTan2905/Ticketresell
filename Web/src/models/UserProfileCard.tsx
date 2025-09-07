import ProfileInfo from "@/Components/ProfileInfo";
import SellProfile from "@/Components/sellprofile";
import React, { useState, useEffect } from "react";

export interface UserProfileCard {
  id: string;
  username: string | undefined;
  email: string | undefined;
  avatar: string | undefined;
  phone: string | undefined;
  address: string | undefined;
  status: number;
  fullname: string | undefined;
  sex: string | undefined;
  createDate: string;
  sellConfigId: string | undefined;
  bio: string | undefined;
  birthday: string | undefined;
  roles: string[];
}

export interface UserUpdateDto {
  UserId: string | undefined;
  Password: string | undefined;
  Fullname: string | undefined;
  Sex: string | undefined;
  Phone: string | undefined;
  Address: string | undefined;
  Birthday: string | undefined;
  Bio: string | undefined;
}

function convertFormDataToUserProfileCard(
  formData: any,
  profile: UserProfileCard
): UserProfileCard {
  return {
    id: profile.id, // Preserve existing ID
    username: profile.username, // Preserve username
    email: profile.email, // Preserve email
    avatar: profile.avatar, // Preserve avatar
    phone: formData.phone, // Map from FormData
    address: formData.address, // Map from FormData
    status: profile.status, // Preserve status
    fullname: formData.fullName, // Map from FormData
    sex: formData.sex, // Map from FormData
    createDate: profile.createDate, // Preserve create date
    sellConfigId: profile.sellConfigId, // Preserve sell config ID
    bio: formData.bio, // Map from FormData
    birthday: formData.birthday, // Map from FormData
    roles: profile.roles, // Preserve roles
  };
}

const convertToUserProfileCard = (
  response: undefined | any
): UserProfileCard => {
  return {
    id: response.userId,
    username: response.username,
    email: response.gmail,
    avatar: response.avatar ?? "https://picsum.photos/200",
    phone: response.phone ?? "",
    address: response.address ?? "",
    status: response.status,
    fullname: response.fullname ?? "Unknown",
    sex: response.sex ?? "Khác",
    createDate: response.createDate,
    sellConfigId: response.sellConfigId ?? null,
    bio: response.bio ?? "Đây là tiểu sử của tôi",
    birthday: response.birthday ?? "không có",
    roles: response.roles ?? [],
  };
};

export const fetchUserProfile = async (
  id: string | undefined
): Promise<UserProfileCard> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/user/read/${id}`,
    {
      credentials: "include",
    }
  );
  const responseModel = await response.json();
  const userProfile: UserProfileCard = convertToUserProfileCard(
    responseModel.data
  );
  return userProfile;
};

export const UserProfilePage: React.FC<{
  isadjustvisible: boolean;
  isSellerProfile: boolean;
  userProfile: UserProfileCard;
}> = ({ isSellerProfile, userProfile, isadjustvisible }) => {
  const [profile, setProfile] = useState(userProfile);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    profile.avatar || "https://picsum.photos/200"
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleSave = (updatedData: any) => {
    // Update the profile with the transformed data
    setProfile((currentProfile) =>
      convertFormDataToUserProfileCard(updatedData, currentProfile)
    );
  };

  useEffect(() => {
    loadUserImage();
  }, [profile.id]);

  const loadUserImage = async () => {
    try {
      const response = await fetch(`/api/images/${profile.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAvatarPreview(url);
      } else {
        setAvatarPreview("");
      }
    } catch (error) {
      console.error("Error loading user image:", error);
      setAvatarPreview("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setShowSaveButton(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const [imageFileSelected, setImageFile] = useState<File | null>(null);

  //   const userUpdateDto: UserUpdateDto = {
  //     UserId: profile.id,
  //     SellConfigId: profile.sellConfigId,
  //     Username: profile.username,
  //     Password: undefined,
  //     Gmail: profile.email,
  //     Fullname: profile.fullname,
  //     Sex: profile.sex,
  //     Phone: profile.phone,
  //     Address: profile.address,
  //     Avatar: profile.id,
  //     Birthday: profile.birthday,
  //     Bio: profile.bio,
  //   };

  //   setIsEditModalOpen(false);
  //   setShowSaveButton(false);

  //   if (avatarOnly && imageFileSelected) {
  //     const formData = new FormData();
  //     formData.append("image", imageFileSelected);
  //     formData.append("id", profile.id); // Append the image ID

  //     try {
  //       const response = await fetch("/api/uploadImage", {
  //         method: "POST",
  //         body: formData,
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         alert(data.message);
  //       } else {
  //         throw new Error("Image upload failed.");
  //       }
  //     } catch (error) {
  //       console.error("Error uploading image:", error);
  //       alert("Error uploading image.");
  //     }
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/user/update/${profile.id}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(userUpdateDto),
  //       }
  //     );

  //     if (response.ok) {
  //       const updatedProfile = await response.json();
  //       setProfile(convertToUserProfileCard(updatedProfile.data));
  //       alert("Profile updated successfully!");
  //     } else {
  //       const errorData = await response.json();
  //       console.error("Error updating profile:", errorData);
  //       alert(`Error: ${errorData.title || "Error updating profile"}`);
  //     }
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     alert("An error occurred while updating the profile.");
  //   }
  // };

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.API_URL}/api/Authentication/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserId: profile.id,
            CurrentPassword: passwordData.currentPassword,
            NewPassword: passwordData.newPassword,
          }),
        }
      );

      if (response.ok) {
        alert("Password changed successfully!");
        setIsChangePasswordModalOpen(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.title || "Error changing password"}`);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred while changing the password.");
    }
  };

  const handleOpenChangePasswordModal = () =>
    setIsChangePasswordModalOpen(true);
  const handleCloseChangePasswordModal = () =>
    setIsChangePasswordModalOpen(false);

  return (
    <div className="bg-transparent min-h-96 pb-32 font-sans ">
      ""
      <div className="bg-white">
        <SellProfile
          birthday={profile.birthday}
          userId={profile.id}
          address={profile.address}
          bio={profile.bio}
          sex={profile.sex}
          gmail={profile.email}
          avatar={profile.avatar}
          fullname={profile.fullname}
          phoneNumber={profile.phone}
          isAdjustVisible={isadjustvisible}
          onSave={(updatedData) => {
            // Update profile if IDs match, transforming FormData to UserProfileCard
            setProfile((currentProfile) =>
              convertFormDataToUserProfileCard(updatedData, currentProfile)
            );
          }}
        />

        <ProfileInfo
          id={profile.id}
          address={profile.address}
          bio={profile.bio}
          birthday={profile.birthday}
          api={`${process.env.NEXT_PUBLIC_API_URL}/api/Rating/${
            isSellerProfile ? "byseller" : "byuser"
          }/${profile.id}`}
        />

        {/* Profile Actions */}
        {/* <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => handleOpenEditModal()}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out flex items-center justify-between"
          >
            <span>Edit Profile</span>
            <FaChevronRight className="text-gray-400" />
          </button>
          <div className="border-t border-gray-200"></div>
          <button
            onClick={handleOpenChangePasswordModal}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out flex items-center justify-between"
          >
            <span>Change Password</span>
            <FaChevronRight className="text-gray-400" />
          </button>
          <div className="border-t border-gray-200"></div>
          <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out flex items-center justify-between">
            <span>Add Bank Info</span>
            <FaChevronRight className="text-gray-400" />
          </button>
        </div> */}

        {/* Change Password Modal */}
        {/* {isChangePasswordModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center sm:items-center p-4">
            <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <button
                  onClick={handleCloseChangePasswordModal}
                  className="text-blue-500 font-semibold"
                >
                  Cancel
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  Change Password
                </h2>
                <button
                  onClick={handleChangePassword}
                  className="text-blue-500 font-semibold"
                >
                  Save
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};
