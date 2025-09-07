"use client";

import React, { useState } from "react";
import "@/Css/Topticket.css";

interface Product {
  imageUrl: string;
  title: string;
  Price: string;
}

const products: Record<string, Product[]> = {
  day: [
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Courtyard.io",
      Price: "14.50 POL",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "ALTS by Adidas",
      Price: "0.12 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Redacted Remilio Babies",
      Price: "0.88 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Kanpai Pandas",
      Price: "0.42 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Egg",
      Price: "0.13 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Azuki Elementals",
      Price: "0.47 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "My Pet Hooligan",
      Price: "0.34 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "My Pet Hooligan",
      Price: "0.34 ETH",
    },
  ],
  "in week": [
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Cool Cats",
      Price: "0.34 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Bad Egg Co",
      Price: "0.44 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Lil Pudgys",
      Price: "0.90 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Azuki Elementals",
      Price: "0.47 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "My Pet Hooligan",
      Price: "0.34 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Azuki Elementals",
      Price: "0.47 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "My Pet Hooligan",
      Price: "0.34 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "My Pet Hooligan",
      Price: "0.34 ETH",
    },
  ],
  "in month": [
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Cool Cats",
      Price: "0.34 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Bad Egg Co",
      Price: "0.44 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Lil Pudgys",
      Price: "0.90 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Azuki Elementals",
      Price: "0.47 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "My Pet Hooligan",
      Price: "0.34 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "Azuki Elementals",
      Price: "0.47 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "My Pet Hooligan",
      Price: "0.34 ETH",
    },
    {
      imageUrl:
        "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517",
      title: "My Pet Hooligan",
      Price: "0.34 ETH",
    },
  ],
};

const TopProducts: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    "day" | "in week" | "in month"
  >("day");

  const categoryLabels = {
    day: "Ngày",
    "in week": "Trong tuần",
    "in month": "Trong tháng",
  } as const; // Use 'as const' to infer literal types

  type Category = keyof typeof categoryLabels;

  return (
    <div className="top-products">
      <div className="top-products__categories">
        {(["day", "in week", "in month"] as Category[]).map((category) => (
          <button
            key={category}
            onClick={
              () => setSelectedCategory(category) // No need for type assertion here
            }
            className={`top-products__category-btn ${
              selectedCategory === category ? "active" : ""
            }`}
          >
            {categoryLabels[category]} {/* This is now type-safe */}
          </button>
        ))}
      </div>
      <div className="top-products__list">
        {products[selectedCategory].map((product, index) => (
          <div key={index} className="top-products__item">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="top-products__image"
            />
            <span className="top-products__title">{product.title}</span>
            <span className="top-products__floorPrice">
              Giá: {product.Price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
