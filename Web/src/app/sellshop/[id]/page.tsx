import React from "react";
import Sellershop from "@/Components/SellerShop";
import Background from "@/Components/Background";
const SellerShop = () => {
    return (
      <div className="Seller">
        <Background test={<Sellershop />} />
      </div>
    );
  };
  export default SellerShop;