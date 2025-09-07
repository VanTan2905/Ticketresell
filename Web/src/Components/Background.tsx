import React from "react";
import "@/Css/Background.css";

const Background = ({ test }: { test: React.ReactNode }) => {
  return (
    <div>
      <div className="Background"></div>
      <div className="Middleground"></div>
      <div className="Frontground">{test}</div>
    </div>
  );
};

export default Background;
