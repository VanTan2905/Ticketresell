import React from "react";
import Footer from "@/Components/Footer"; // Import your Footer component
import Contact from "@/Components/Contact";
import Navbar from "@/Components/Navbar";
import Background from "@/Components/Background";
import Announce from "@/Components/Announcement";
const Contactt = () => {
  return (
    <div className="Contactt">
      <Navbar page={"ticket"}/>
      <Announce/>
      <Background test={<Contact />} />

      <Footer />
    </div>
  );
};

export default Contactt;
