import React from "react";

import Background from "@/Components/Background";
import Sell from "@/Components/DashboardSell";
const Seller = () => {
  return (
    <div className="Seller">
      <Background test={<Sell />} />
    </div>
  );
};
export default Seller;
