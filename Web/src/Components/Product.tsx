import React from "react";
import "@/Css/Product.css";
import Link from "next/link";

const posters = [
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/5486517",
    title: "Rock Legends Live",
    eventUrl: "/event/rock-legends",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451",
    title: "Jazz in the Park",
    eventUrl: "/event/jazz-park",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/7845613",
    title: "Broadway Classics",
    eventUrl: "/event/broadway-classics",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/6598432",
    title: "Symphony of Stars",
    eventUrl: "/event/symphony-stars",
  },
];

const posters1 = [
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/5486517",
    title: "Rock Legends Live",
    eventUrl: "/event/rock-legends",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/8932451",
    title: "Jazz in the Park",
    eventUrl: "/event/jazz-park",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/7845613",
    title: "Broadway Classics",
    eventUrl: "/event/broadway-classics",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/6598432",
    title: "Symphony of Stars",
    eventUrl: "/event/symphony-stars",
  },
];

const posters2 = [
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/9752134",
    title: "Digital Future Summit",
    eventUrl: "/event/digital-summit",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/9752134",
    title: "Culinary Delights Festival",
    eventUrl: "/event/culinary-delights",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/9752134",
    title: "Art and Innovation Expo",
    eventUrl: "/event/art-innovation",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/9752134",
    title: "Adventure Sports Championship",
    eventUrl: "/event/adventure-sports",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/9752134",
    title: "Digital Future Summit",
    eventUrl: "/event/digital-summit",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/9752134",
    title: "Culinary Delights Festival",
    eventUrl: "/event/culinary-delights",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/9752134",
    title: "Art and Innovation Expo",
    eventUrl: "/event/art-innovation",
  },
  {
    imageUrl:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/products/11655/9752134",
    title: "Adventure Sports Championship",
    eventUrl: "/event/adventure-sports",
  },
];

const Product = () => {
  return (
    <div className="products">
      <h2>Sản Phẩm Phổ Biến</h2>
      <div className="product-list">
        {posters.map((poster, index) => (
          <div key={index} className="product-item">
            <Link href={poster.eventUrl}>
              <img src={poster.imageUrl} alt={poster.title} />
              <p>{poster.title}</p>
            </Link>
          </div>
        ))}
      </div>

      <h2>Gợi Ý Cho Bạn</h2>
      <div className="product-list">
        {posters1.map((poster, index) => (
          <div key={index} className="product-item">
            <a href={poster.eventUrl}>
              <img src={poster.imageUrl} alt={poster.title} />
              <p>{poster.title}</p>
            </a>
          </div>
        ))}
      </div>

      <h2>Địa Điểm</h2>
      <div className="product-list product-suggest">
        {posters2.map((poster, index) => (
          <div key={index} className="product-item special-style">
            <a href={poster.eventUrl}>
              <img src={poster.imageUrl} alt={poster.title} />
              <p>{poster.title}</p>
            </a>
          </div>
        ))}
      </div>
      <div className="products">
        {/* Other content */}
        <button className="see-more-btn">Xem Thêm</button>
      </div>
    </div>
  );
};

export default Product;
