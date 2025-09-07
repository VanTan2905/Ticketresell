import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPencilAlt, FaPhoneAlt, FaFlag } from "react-icons/fa";
import EditProfilePopup from "./EditProfilePopUp";
import { fetchImage } from "@/models/FetchImage";
import uploadImageForTicket from "@/models/UpdateImage";
import Link from "next/link";
import { AlertCircle, X } from "lucide-react";
import Cookies from "js-cookie";

import { Alert, AlertDescription } from "@/Components/ui/alert";
const DEFAULT_IMAGE = "https://images7.alphacoders.com/129/1297416.png";

interface FormData {
  userid: string;
  fullName: string | undefined;
  sex: string | undefined;
  phone: string | undefined;
  address: string | undefined;
  birthday: string | undefined;
  bio: string | undefined;
}

interface Props {
  birthday: string | undefined;
  address: string | undefined;
  bio: string | undefined;
  sex: string | undefined;
  gmail: string | undefined;
  fullname: string | undefined;
  phoneNumber: string | undefined;
  avatar: string | undefined;
  isAdjustVisible: boolean;
  userId: string;
  onSave: (data: FormData) => void;
}

const ReportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}> = ({ isOpen, onClose, userId }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const reportReasons = [
    { label: "Báo cáo vé không phù hợp", status: 4 },
    { label: "Báo cáo bạo lực", status: 5 },
    { label: "Báo cáo giá cao", status: 6 },
    { label: "Báo cáo vé giả", status: 7 },
  ];

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (selectedReason) {
      const statusMap = {
        "Báo cáo vé không phù hợp": 4,
        "Báo cáo bạo lực": 5,
        "Báo cáo giá cao": 6,
        "Báo cáo vé giả": 7,
      } as const; // use 'as const' to fix types
      console.log("asdsadasdasd", userId);
      const statusCode = statusMap[selectedReason as keyof typeof statusMap]; // type assertion here
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/Chatbox/createreport/${statusCode}/${userId}`;

      const requestBody = {
        title: "Report",
        description: selectedReason,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
            onClose();
          }, 3000);
        } else {
          console.error("Failed to submit report:", response.statusText);
        }
      } catch (error) {
        console.error("Error submitting report:", error);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 mt-10"
      style={{ zIndex: 500 }}
    >
      <div className="w-full max-w-md mx-4 animate-in slide-in-from-bottom duration-300 mt-10">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden mt-10">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Báo cáo người dùng
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <ul className="space-y-3">
              {reportReasons.map((reason) => (
                <li key={reason.status} className="group">
                  <label className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                    <div className="relative">
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason.label}
                        checked={selectedReason === reason.label}
                        onChange={() => setSelectedReason(reason.label)}
                        className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 focus:ring-offset-2"
                      />
                      {selectedReason === reason.label && (
                        <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-75"></div>
                      )}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                      {reason.label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-2 p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={onClose}
              className="px-4 py-1 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Gửi báo cáo
            </button>
          </div>
        </div>

        {showAlert && (
          <Alert className="mt-4 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-900 animate-in fade-in slide-in-from-top duration-300">
            <AlertDescription className="text-green-800 dark:text-green-200">
              Bạn đã gửi báo cáo thành công
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
const SellProfile: React.FC<Props> = ({
  birthday,
  address,
  bio,
  sex,
  gmail,
  avatar,
  fullname,
  phoneNumber,
  isAdjustVisible,
  userId,
  onSave,
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_IMAGE);
  const [coverImageUrl, setCoverImageUrl] = useState<string>(DEFAULT_IMAGE);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const coverId = `${userId}_cover`;
  const id = Cookies.get("id");

  const fetchImageAvatar = async (imageId: string) => {
    const { imageUrl: fetchedImageUrl, error } = await fetchImage(imageId);
    if (fetchedImageUrl && !error) {
      setAvatarUrl(fetchedImageUrl);
    }
  };

  const fetchImageCoverAvatar = async (imageId: string) => {
    const { imageUrl: fetchedImageUrl, error } = await fetchImage(imageId);
    if (fetchedImageUrl && !error) {
      setCoverImageUrl(fetchedImageUrl);
    }
  };

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);
  const handleReportClick = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  const formData: any = {
    userid: userId,
    fullName: fullname,
    sex: sex,
    phone: phoneNumber,
    address: address,
    birthday: birthday,
    bio: bio,
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      uploadImageForTicket(userId, file);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageUrl(reader.result as string);
      };
      uploadImageForTicket(coverId, file);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchImageAvatar(userId);
    fetchImageCoverAvatar(coverId);
  }, [avatar]);

  return (
    <div className="relative profile">
      <img
        className="w-full object-cover mt-[10vh] max-w-full h-[45vh] bg-gray-100"
        src={coverImageUrl}
        alt=""
      />
      {isAdjustVisible && (
        <>
          <label
            htmlFor="coveravatar"
            className="flex items-center absolute top-[35vh] left-[87vw] px-4 py-2 bg-gray-500 rounded text-gray-600 p-1.5 cursor-pointer"
          >
            <FaPencilAlt className="mr-2 text-white" size={12} />
            <span className="text-white">Thêm ảnh bìa</span>
          </label>
          <input
            id="coveravatar"
            type="file"
            className="hidden"
            onChange={handleCoverAvatarChange}
            accept="image/*"
          />
        </>
      )}
      <div className="absolute w-[20vh] h-[20vh] rounded-full left-[3vw] top-[30vh] border-4 border-white bg-gray-100">
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-full h-full object-cover rounded-full"
        />
        {isAdjustVisible && (
          <>
            <label
              htmlFor="avatar"
              className="absolute bottom-2 right-2 bg-gray-200 text-gray-600 p-1.5 rounded-full cursor-pointer"
            >
              <FaPencilAlt size={12} />
            </label>
            <input
              id="avatar"
              type="file"
              className="hidden"
              onChange={handleAvatarChange}
              accept="image/*"
            />
          </>
        )}
      </div>
      <div className="px-[3vw] mt-[8vh] mb-[5vh]">
        <div className="flex justify-between items-center">
          <div className="seller-desc flex items-center space-x-2">
            <Link
              href={`/profile/${userId}`}
              className="no-underline text-black"
              passHref
            >
              <p className="text-2xl font-medium">
                {fullname ? fullname : "Không xác định"}
              </p>
            </Link>
            {!isAdjustVisible && userId !== id && (
              <button
                onClick={handleReportClick}
                className="text-red-500 p-1 rounded-full hover:bg-gray-100 flex items-center justify-center mb-2"
                aria-label="Report"
                style={{ fontSize: "0.9em" }} // Giảm kích thước biểu tượng
              >
                <FaFlag />
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            {isAdjustVisible ? (
              <button
                onClick={handleOpenEditModal}
                className="bg-gray-600 text-white py-2 px-4 rounded flex items-center hover:bg-gray-700"
              >
                Chỉnh sửa trang cá nhân
              </button>
            ) : (
              <button className="bg-white-500 text-white py-2 px-4 rounded flex items-center ">
                Theo dõi
              </button>
            )}
          </div>
        </div>
        <div className="mt-3">
          <p className="flex items-center text-md text-gray-500">
            <span>
              <FaPhoneAlt className="text-sm mr-2 text-gray-400" />
            </span>
            {phoneNumber ? phoneNumber : "Chưa cung cấp số điện thoại"}
          </p>
        </div>
        <div className="mt-3">
          <p className="flex items-center text-md text-gray-500">
            <span>
              <FaEnvelope className="text-sm mr-2 text-gray-400" />
            </span>
            {gmail ? gmail : "Chưa cung cấp email"}
          </p>
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfilePopup
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          userId={userId}
          initialData={formData}
          onSave={onSave}
        />
      )}

      {/* Render ReportModal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        userId={userId}
      />
    </div>
  );
};

export default SellProfile;
