import React from "react";
import Background from "@/Components/Background";
import Signupsell from "@/Components/Signupsell";

const profile = () => {
  return (
    <div className="profile">
      <Background test={<Signupsell/>} />
    </div>
  );
};
export default profile;
