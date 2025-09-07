import useShowItem from "@/Hooks/useShowItem";
import Link from "next/link";
import React, { useState } from "react";
import { fetchImage } from "./FetchImage";
import Image from "next/image";


interface Category {
  categoryId: string;
  name: string;
  description: string;
}

export interface BannerItemCard {
  categories: Category[]
  imageUrl: string;
  name: string;
  date: string;
  author: string;
  description: string;
  price: string;
  id: string;
}



const DEFAULT_IMAGE =
  "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517";



const convertToBannerItemCards = async (
  response: any[]
): Promise<BannerItemCard[]> => {
  const bannerItemCards = await Promise.all(
    response.map(async (item) => {
      let imageUrl = DEFAULT_IMAGE;
      if (item.image) {
        const { imageUrl: fetchedImageUrl, error } = await fetchImage(
          item.image
        );

        if (fetchedImageUrl) {
          imageUrl = fetchedImageUrl;
        } else {
          console.error(
            `Error fetching image for ticket ${item.ticketId}: ${error}`
          );
        }
      }

      return {
        categories: item.categories,
        imageUrl,
        name: item.name,
        date: formatDate(item.startDate), // Sử dụng startDate ở đây
        author: item.seller.fullname,
        description: item.description,
        price: formatPrice(item.cost.toString()), // Định dạng giá ở đây
        id: item.ticketId,
      };
    })
  );

  return bannerItemCards;
};

interface CategoriesPageProps {
  bannerItems: BannerItemCard[];
}

export const fetchBannerItems = async (): Promise<BannerItemCard[]> => {
  const bannerItemsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ticket/read`);
  const response = await bannerItemsRes.json();

  const bannerItems: Promise<BannerItemCard[]> = convertToBannerItemCards(
    response.data
  );

  return bannerItems;
};
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  // Get hours and determine AM/PM
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12; // Convert to 12-hour format
  const formattedHours = hours ? String(hours).padStart(2, '0') : '12'; // the hour '0' should be '12'

  return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
};

const formatPrice = (price: string): string => {
  const priceNumber = parseFloat(price); // Chuyển đổi chuỗi thành số
  return priceNumber.toLocaleString('vi-VN'); // Định dạng theo kiểu Việt Nam
};
const BannerItemCard = ({ itemCart }: { itemCart: BannerItemCard }) => {
  return (
    <div className="category-card">
      <Image
        src={itemCart.imageUrl}
        alt={itemCart.name} // Add an alt text here
        width={90}
        height={90}
      />
      <div className="overlay">
        <div className="description">
          <div className="mt-5">
            <h4
              style={{
                whiteSpace: 'nowrap',  // Prevent line break
                overflow: 'hidden',     // Hide overflow content
                textOverflow: 'ellipsis', // Add ... for truncated text
                width: '300px'          // Fixed width
              }}
            >
              {itemCart.name}
            </h4>
            <p
              style={{
                whiteSpace: 'nowrap',  // Prevent line break
                overflow: 'hidden',     // Hide overflow content
                textOverflow: 'ellipsis', // Add ... for truncated text
                width: '650px'          // Fixed width
              }}
            >
              Người bán: {itemCart.author}
            </p>

            <p>Giá: {itemCart.price} VND</p>
            <p
              style={{
                whiteSpace: 'nowrap',  // Prevent line break
                overflow: 'hidden',     // Hide overflow content if needed
              }}
              className="text-sm"
            >
              Ngày diễn ra: {itemCart.date}
            </p>
          </div>
        </div>
      </div>
    </div>

  );
};
const renderBannerItems = (
  BannerItemCards: BannerItemCard[],
  currentIndex: number,
  itemsToShow: number
) => {
  return BannerItemCards.slice(currentIndex, currentIndex + itemsToShow).map(
    (item, index) => (
      <Link href={`/ticket/${item.id}`} key={index}>
        <BannerItemCard itemCart={item} />
      </Link>
    )
  );
};

export const CategoriesPage = ({
  bannerItems,
}: {
  bannerItems: BannerItemCard[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = useShowItem();
  const animationClass = "fade-in"; // Example animation class

  return (
    <div className={`category-items ${animationClass}`}>
      {renderBannerItems(bannerItems, currentIndex, itemsToShow)}
    </div>
  );
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Category/read`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return undefined;
  }
};
