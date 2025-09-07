import React, { useEffect, useState } from "react";
import { MdCake, MdCall, MdEmail, MdLocationOn } from "react-icons/md";
import RatingsList from "./rating";

interface props {
  id: string;
  birthday: string | undefined;
  bio: string | undefined;
  address: string | undefined;
  api: string;
}

const ProfileInfo: React.FC<props> = ({ birthday, bio, address, id, api }) => {
  const [ratingsData, setRatingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to manage post likes and example dynamic data

  // Fetch data here
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        const response = await fetch(api);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.statusCode === 200 && result.data) {
          setRatingsData(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch ratings");
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching ratings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [id]);
  return (
    <div className="flex flex-col md:flex-row gap-4 px-4">
      {/* Left Sidebar */}
      <div className="w-full h-fit md:w-1/4 p-4 bg-white rounded-lg flex-shrink-0">
        <h2 className="font-bold text-xl mb-4">Thông tin</h2>
        <div className="flex mb-1">
          <span>
            <MdCake />
          </span>
          <p className="ml-2">
            
            {birthday && !isNaN(new Date(birthday).getTime())
              ? new Date(birthday).toLocaleDateString("vi-VN")
              : "Chưa cập nhật"}
          </p>
        </div>
        <div className="flex mb-1">
          <span>
            <MdLocationOn />
          </span>
          <p className="ml-2">{address ? address : "Chưa cập nhật địa chỉ"}</p>
        </div>
        <div className="flex mb-2">
          <p className="ml-2 text-gray-500">
            {bio ? bio : "Chưa cập nhật tiểu sử"}
          </p>
        </div>
      </div>
      <RatingsList ratings={ratingsData} />;{/* Main Content */}
      {/* <div className="w-full h-fit md:w-2/4 p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <nav className="flex space-x-4">
            <a
              href="#"
              className="no-underline	text-gray-500 hover:text-green-500"
            >
              Followers
            </a>
            <a
              href="#"
              className="no-underline	text-gray-500 hover:text-green-500"
            >
              Following
            </a>
            <a
              href="#"
              className="no-underline	text-green-500 font-bold border-b-2 border-green-500"
            >
              Posts
            </a>
          </nav>
        </div>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <img
              src="https://preview.redd.it/with-geats-finally-ended-is-ace-considered-to-be-in-the-top-v0-ojwsyx9t6okb1.png?auto=webp&s=a79a574c8ba2e4c0770fe4e0bfe52388cd5484a7"
              alt="Charles Deo"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-2">
              <h4 className="font-bold">Thu Thủy</h4>
              <span className="text-gray-400 text-sm">15 mins ago</span>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg mb-2">
            <img
              src="https://preview.redd.it/with-geats-finally-ended-is-ace-considered-to-be-in-the-top-v0-ojwsyx9t6okb1.png?auto=webp&s=a79a574c8ba2e4c0770fe4e0bfe52388cd5484a7"
              alt="Post Image"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <p className="mb-2">
            <strong>Cao Giáp</strong> Xinh quá ~~~
          </p>
          <div className="flex space-x-4">
            <span
              className="text-pink-500 cursor-pointer"
              onClick={handleLikeClick}
            >
              {likes} Likes
            </span>
            <span
              className="text-gray-500 cursor-pointer"
              onClick={handleFollowClick}
            >
              {following} Followers
            </span>
          </div>
        </div>

      </div> */}
      {/* Right Sidebar */}
      {/* <div className="w-full h-fit md:w-1/4 p-4 bg-white rounded-lg shadow-md flex-shrink-0">
        <div className="mb-4">
          <h3 className="font-bold text-xl">You might know</h3>
          <div className="flex items-center mb-2">
            <img
              src="https://th.bing.com/th/id/OIP.GvZhpjtTKOZ-O_heAu0nlgAAAA?rs=1&pid=ImgDetMain"
              alt="Kamen Rider Dooms Geats"
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-2">
              <p className="font-bold">Khang Huỳnh</p>
              <p className="text-gray-500 text-sm">vkev@gmail.com</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-xl">Active</h3>
          <div className="flex items-center mb-2">
            <img
              src="https://th.bing.com/th/id/OIP.GvZhpjtTKOZ-O_heAu0nlgAAAA?rs=1&pid=ImgDetMain"
              alt="Kamen Rider Dooms Geats"
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-2">
              <p className="font-bold">Chí Cường</p>
              <p className="text-green-500 text-sm">Online</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ProfileInfo;
