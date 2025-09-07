"use client";

import React, { useState, useEffect, useRef } from "react";
interface HorizontalCardsProps {
  categoryId: any;
  title: any;
}
const HorizontalCards : React.FC<HorizontalCardsProps> = ({ categoryId, title }) => {
  const [cardsData, setCardsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleCards, setVisibleCards] = useState(5);
  const sliderRef = useRef(null);
  useEffect(() => {
    setCurrentIndex(0);
  }, [visibleCards]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Ticket/getByListCate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify([categoryId]),
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setCardsData(result.data);
      } catch (error:any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 768) {
        setVisibleCards(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(3);
      } else if (window.innerWidth < 1280) {
        setVisibleCards(4);
      } else {
        setVisibleCards(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slideLeft = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cardsData.length - visibleCards : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 300);
  };

  const slideRight = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === cardsData.length - visibleCards ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getVisibleCards = () => {
    if (cardsData.length <= visibleCards) return cardsData;

    const visibleCardsArray: any[] = [];
    for (let i = 0; i < visibleCards; i++) {
      const index = (currentIndex + i) % cardsData.length;
      visibleCardsArray.push(cardsData[index]);
    }
    return visibleCardsArray;
  };

  if (isLoading) return <div className="text-center py-8">Đang tải...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Lỗi: {error}</div>;

  const visibleCardsData = getVisibleCards();

  return (
    <div className="w-full h-[70vh] bg-white-50 py-8">
      <div className="container pd-5">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {cardsData.map((card : any) => (
            <div
              key={card.ticketId}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://img3.gelbooru.com/images/c6/04/c604a5f863d5ad32cc8afe8affadfee6.jpg"
                  alt={`Ảnh bìa ${card.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {card.name}
                </h3>
                <p className="text-xs text-gray-600">
                  Bởi {card.seller.fullname}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(card.startDate).toLocaleDateString()}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {card.categories.slice(0, 3).map((category:any) => (
                    <span
                      key={category.categoryId}
                      className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700"
                    >
                      {category.name}
                    </span>
                  ))}
                  {card.categories.length > 3 && (
                    <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
                      ...
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalCards;
