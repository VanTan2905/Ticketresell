"use client";
import React, { useRef, useState, useEffect } from "react";
import "@/Css/Ads.css"; // Updated
import Link from "next/link";

interface PosterInfo {
  imageUrl: string;
  title: string;
  eventUrl: string;
}

const posters: PosterInfo[] = [
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-catalog/d_vgg-defaultLogo.jpg/t_f-fs-0fv,q_auto:low,f_auto,c_fill,$w_280_mul_3,$h_180_mul_3/performer/101864867/05499ab31150c8fe7d6fdbaaf6f6eec1",
    title: "Music Event 2024",
    eventUrl: "/event/music-2024",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_vgg-defaultLogo.jpg/t_f-fs-0fv,q_auto:low,f_auto,c_fill,$w_280_mul_3,$h_180_mul_3/categories/4956/6422804",
    title: "Rugby Match",
    eventUrl: "/event/rugby-match",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_vgg-defaultLogo.jpg/t_f-fs-0fv,q_auto:low,f_auto,c_fill,$w_280_mul_3,$h_180_mul_3/categories/5564/6319662",
    title: "Baseball Champion 2025",
    eventUrl: "/event/baseball-championship",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_vgg-defaultLogo.jpg/t_f-fs-0fv,q_auto:low,f_auto,c_fill,$w_280_mul_3,$h_180_mul_3/categories/1023/VGGFestival-Fallback2",
    title: "Wine Festival",
    eventUrl: "/event/wine-festival",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/6435162",
    title: "Night of Harmony",
    eventUrl: "/event/night-of-harmony",
  },
];

const Ads = () => {
  // Updated
  const listImageRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const handleChangeSlide = () => {
      setCurrent((prev) => (prev === posters.length - 1 ? 0 : prev + 1));
    };

    const interval = setInterval(handleChangeSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (direction: "left" | "right") => {
    setCurrent((prev) =>
      direction === "right"
        ? prev === posters.length - 1
          ? 0
          : prev + 1
        : prev === 0
        ? posters.length - 1
        : prev - 1
    );
  };

  return (
    <div>
      {/* Ads slideshow */} {/* Updated */}
      <div className="slide-show">
        <div
          className="list-images"
          ref={listImageRef}
          style={{ transform: `translateX(${-100 * current}%)` }}
        >
          {posters.map((poster, index) => (
            <div key={index} className="poster-container">
              <img src={poster.imageUrl} alt={poster.title} loading="lazy" />
              <div className="poster-info">
                <h2>{poster.title}</h2>
                <Link href={poster.eventUrl} className="view-event-btn">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="btns">
          <div className="btn-left btn" onClick={() => handleClick("left")}>
            <i className="bx bx-chevron-left"></i>
          </div>
          <div className="btn-right btn" onClick={() => handleClick("right")}>
            <i className="bx bx-chevron-right"></i>
          </div>
        </div>
        <div className="index-images">
          {posters.map((_, index) => (
            <div
              key={index}
              className={`index-item ${current === index ? "active" : ""}`}
              onClick={() => setCurrent(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ads; // Updated
