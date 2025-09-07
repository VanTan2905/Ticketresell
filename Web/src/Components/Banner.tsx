"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { BannerItemCard } from "@/models/CategoryCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import "@/Css/Banner.css";
import useShowItem from "@/Hooks/useShowItem";
import {
  fetchBannerItems,
  CategoriesPage,
  fetchCategories,
} from "@/models/CategoryCard";
import Link from "next/link";

interface Category {
  categoryId: string;
  name: string;
  description: string;
}

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("");
  const [bannerItems, setBannerItems] = useState<BannerItemCard[]>([]);
  const itemsToShow = useShowItem();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const banner = await fetchBannerItems();
      setBannerItems(banner);
      const cate = await fetchCategories();
      setCategories(cate);
    };

      fetchData();
    }, []);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getNextIndex = (currentIndex: number): number => {
    const remainingItems = bannerItems.length - currentIndex;
    return remainingItems <= itemsToShow ? 0 : currentIndex + itemsToShow;
  };

  const getPrevIndex = (currentIndex: number): number => {
    if (currentIndex === 0) {
      const remainder = bannerItems.length % itemsToShow;
      return remainder === 0
        ? bannerItems.length - itemsToShow
        : bannerItems.length - remainder;
    }
    return Math.max(0, currentIndex - itemsToShow);
  };

    const nextProduct = () => {
      setAnimationClass("slide-out-left");
      setTimeout(() => {
        setCurrentIndex(getNextIndex(currentIndex));
        setAnimationClass("slide-in-right");
      }, 300);
    };

    const prevProduct = () => {
      setAnimationClass("slide-out-right");
      setTimeout(() => {
        setCurrentIndex(getPrevIndex(currentIndex));
        setAnimationClass("slide-in-left");
      }, 300);
    };

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(nextProduct, 5000);
  };

    useEffect(() => {
      resetTimeout();
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, [currentIndex]);

  const getVisibleItems = () => {
    // Separate items with active category first, then remaining items
    const categorizedItems = activeCategory
      ? bannerItems.filter((item) =>
          item.categories.some(
            (category) => category.categoryId === activeCategory
          )
        )
      : [];

    const uncategorizedItems = bannerItems.filter(
      (item) =>
        !item.categories.some(
          (category) => category.categoryId === activeCategory
        )
    );

    const sortedItems = [...categorizedItems, ...uncategorizedItems];

    const endIndex = currentIndex + itemsToShow;
    const items = sortedItems.slice(currentIndex, endIndex);

    // If items are fewer than itemsToShow and not at the start, reset
    if (items.length < itemsToShow && currentIndex !== 0) {
      setCurrentIndex(0);
      return sortedItems.slice(0, itemsToShow);
    }

      return items;
    };

  const visibleItems = getVisibleItems();
  const limitedCategories = categories.slice(0, 6);

  return (
    <div className="categories">
      <div className="w-full py-2 md:py-4 overflow-hidden">
        <nav
          className="container mx-auto px-2 md:px-4"
          aria-label="Category Navigation"
        >
          <div className="relative">
            <div className="flex overflow-x-auto scrollbar-hide items-center gap-2 md:gap-4 pb-2 md:pb-0 md:flex-wrap">
              <button
                onClick={() => setActiveCategory(null)}
                className={`whitespace-nowrap px-4 md:px-8 py-2 md:py-2.5 rounded-full transition-all duration-300 
          text-sm md:text-base font-medium tracking-wide
          hover:bg-emerald-500/90 hover:shadow-lg 
          focus:outline-none focus:ring-2 focus:ring-emerald-400/50
          ${
            !activeCategory
              ? "bg-emerald-500/90 text-white shadow-emerald-500/20 shadow-lg"
              : "text-gray-100 hover:text-white"
          }`}
              >
                Tất cả
              </button>

              {limitedCategories.map((category) => (
                <button
                  key={category.categoryId}
                  onClick={() => setActiveCategory(category.categoryId)}
                  className={`whitespace-nowrap px-4 md:px-8 py-2 md:py-2.5 rounded-full transition-all duration-300 
            text-sm md:text-base font-medium tracking-wide
            hover:bg-emerald-500/90 hover:shadow-lg 
            focus:outline-none focus:ring-2 focus:ring-emerald-400/50
            ${
              activeCategory === category.categoryId
                ? "bg-emerald-500/90 text-white shadow-emerald-500/20 shadow-lg"
                : "text-gray-100 hover:text-white"
            }`}
                >
                  {category.name}
                </button>
              ))}

              <button
                className="whitespace-nowrap px-4 md:px-8 py-2 md:py-2.5 rounded-full transition-all duration-300 
          text-sm md:text-base font-medium tracking-wide
          focus:outline-none focus:ring-2 focus:ring-emerald-400/50 
          hover:bg-emerald-500/90 hover:shadow-lg text-white"
              >
                <span className="inline-flex items-center gap-1">
                  <Link href="/search" className="no-underline" passHref>
                    <span className="no-underline text-white">Nhiều hơn nữa...</span>
                  </Link>
                </span>
              </button>
            </div>

            {/* Fade effect for horizontal scroll */}
            <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l  md:hidden" />
            <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r  md:hidden" />
          </div>
        </nav>
      </div>

        <div className="category-items-container">
          <FontAwesomeIcon
            className="caret"
            icon={faCaretLeft}
            onClick={() => {
              prevProduct();
              resetTimeout();
            }}
          />
          <div className={`category-items ${animationClass}`}>
            <CategoriesPage bannerItems={visibleItems} />
          </div>
          <FontAwesomeIcon
            className="caret"
            icon={faCaretRight}
            onClick={() => {
              nextProduct();
              resetTimeout();
            }}
          />
        </div>
      </div>
    );
  };

  export default Banner;
