import React, { Suspense } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import PaymentStatus from "@/Components/PaymentStatus";
const PaymentReturn = () => {
  return (
    <div className="home">
      {/* <Announce/> */}
      <Navbar page={"ticket"} />
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentStatus />
      </Suspense>
      <Footer />
      {/*     
      <Topticket />
      <Product /> */}
    </div>
  );
};

export default PaymentReturn;
