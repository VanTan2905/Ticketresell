import React, { useEffect, useState } from "react";
import { BannerItemCard, fetchBannerItems } from "@/models/CategoryCard";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import DOMPurify from "dompurify";
import useShowItem from "@/Hooks/useShowItem";

interface Category {
  categoryId: string;
  name: string;
  description: string;
}

interface CategoryCarouselProps {
  category: Category;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("");
  const itemsToShow = useShowItem();
  const [bannerItems, setBannerItems] = useState<BannerItemCard[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const banner = await fetchBannerItems();
      setBannerItems(banner);
    };

    fetchData();
  }, []);

  const getVisibleItems = () => {
    // Filter items by active category
    const categorizedItems = bannerItems.filter((item) =>
      item.categories.some((cat) => cat.categoryId === category.categoryId)
    );

    // Ensure the item count is divisible by itemsToShow
    const divisibleCount = Math.floor(categorizedItems.length / itemsToShow) * itemsToShow;
    const paddedItems = categorizedItems.slice(0, divisibleCount);

    const endIndex = currentIndex + itemsToShow;
    const items = paddedItems.slice(currentIndex, endIndex);

    // Reset index if fewer items than itemsToShow and not at the start
    if (items.length < itemsToShow && currentIndex !== 0) {
      setCurrentIndex(0);
      return paddedItems.slice(0, itemsToShow);
    }

    return items;
  };

  const displayedItems = getVisibleItems();

  const nextItems = () => {
    setAnimationClass("slide-out-left");
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev + itemsToShow < bannerItems.length ? prev + itemsToShow : 0
      );
      setAnimationClass("slide-in-right");
    }, 300);
  };

  const prevItems = () => {
    setAnimationClass("slide-out-right");
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev - itemsToShow >= 0 ? prev - itemsToShow : Math.max(bannerItems.length - itemsToShow, 0)
      );
      setAnimationClass("slide-in-left");
    }, 300);
  };

  const truncateText = (text: string, maxLength: number) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = text;
    const plainText = tempElement.innerText;
    return plainText.length > maxLength ? plainText.slice(0, maxLength) + "..." : plainText;
  };



  return (
    <section className="w-full px-4 sm:px-0 py-6 md:py-8 lg:py-10 bg-white">
      {bannerItems.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6 space-x-2">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 relative pl-4">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-green-500 rounded-full"></span>
              {category.name}
            </h2>
          </div>

          <div className="relative">
            <button
              onClick={prevItems}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-10 p-2 rounded-full transition-all duration-200"
            >
              <FontAwesomeIcon
                icon={faCaretLeft}
                className="w-4 h-4 md:w-5 md:h-5 text-gray-600 hover:text-gray-800"
              />
            </button>

            <div className={`overflow-hidden px-2 ${animationClass}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 laptop-lg:grid-cols-4 gap-4 md:gap-4 laptop:grid-cols-3">
                {displayedItems.map((item, index) =>
                  item && item.id ? (
                    <Link key={item.id} href={`/ticket/${item.id}`} className="no-underline" passHref>
                      <div className="group h-full">
                        <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                          <div className="relative pt-[60%]">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="absolute top-0 left-0 w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 text-sm rounded-full shadow-lg backdrop-blur-sm bg-opacity-90">
                              {(item.price)}
                            </div>
                          </div>

                          <div className="p-4 md:p-5 flex-grow flex flex-col">
                            <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
                              {truncateText(item.name, 20)}
                            </h3>
                            <h4 className="text-base md:text-lg font-medium text-gray-700 mb-2">
                              {item.author}
                            </h4>
                            <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-2">
                              {truncateText(DOMPurify.sanitize(item.description), 20)}
                            </p>
                            <div className="mt-auto">
                              <span className="inline-block bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-600">
                                {item.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div key={index} className="h-full"></div>
                  )
                )}
              </div>
            </div>

            <button
              onClick={nextItems}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-10 p-2 hover:bg-white rounded-full transition-all duration-200"
            >
              <FontAwesomeIcon
                icon={faCaretRight}
                className="w-4 h-4 md:w-5 md:h-5 text-gray-600 hover:text-gray-800"
              />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CategoryCarousel;
