import React, { useEffect, useState } from "react";
import { Star, StarHalf } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { fetchImage } from "@/models/FetchImage";

const DEFAULT_IMAGE =
  "https://th.bing.com/th?id=OIP.lcY5HRpW-xdbGVrC1DsbcAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2";
const RatingsList = ({ ratings }: any) => {
  const [userImages, setUserImages] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchUserAvatarImage = async () => {
    try {
      const imageFetchPromises = ratings.map((rating: any) =>
        fetchImage(rating.userId)
      );
      const results = await Promise.all(imageFetchPromises);
      const images = results.map(({ imageUrl, error }, index) => {
        if (error) {
          console.error(
            `Error fetching image for item ${ratings[index].userId}:`,
            error
          );
          return null; // Return null or handle the error as needed
        }
        return imageUrl; // Return the imageUrl if no error
      });
      setUserImages(images);
    } catch (err: any) {
      console.error("Error fetching images:", err);
      throw err; // Handle errors in a way that suits your app
    }
  };

  useEffect(() => {
    fetchUserAvatarImage();
  }, [ratings]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(ratings.length / itemsPerPage);
  const paginatedRatings = ratings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const maxVisiblePages = 5;
    const pageButtons = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageButtons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="w-10 h-10 mx-1 rounded-full transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageButtons.push(
          <span key="ellipsis1" className="mx-1">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 mx-1 rounded-full transition-colors duration-200 ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <span key="ellipsis2" className="mx-1">
            ...
          </span>
        );
      }
      pageButtons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className="w-10 h-10 mx-1 rounded-full transition-colors duration-200 bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };
  // Function to format date

  const formatDate = (dateString: any) => {
    const date = new Date(dateString + "Z");
    // Extract the day, month, and year manually
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    // Extract hours and minutes
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  // Function to render stars
  const renderStars = (starCount: any) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`${
            i < starCount
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 fill-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="w-full max-w-4xl ">
      <div className="bg-white rounded-lg ">
        <h2 className="text-2xl font-bold mb-6 text-center">Đánh giá</h2>

        {/* Các đánh giá */}
        <div className="space-y-4">
          {paginatedRatings.map((rating: any, index: number) => (
            <Card key={rating.ratingId}>
              <CardContent className="pt-6">
                <div className="flex pb-3">
                  <div className="flex items-center gap-3 pr-3">
                    <img
                      src={userImages[index] || DEFAULT_IMAGE}
                      alt={`Người dùng ${rating.userId}`}
                      className="w-7 h-7 rounded-full"
                    />
                  </div>
                  <p className="text-md text-gray-500">{rating.userId}</p>
                </div>
                <p className="text-sm text-gray-500">Đến {rating.sellerId}</p>

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(rating.stars)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(rating.createDate)}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{rating.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 mx-1 rounded-full bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50"
          >
            &lt;
          </button>
          {renderPaginationButtons()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 mx-1 rounded-full bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default RatingsList;
