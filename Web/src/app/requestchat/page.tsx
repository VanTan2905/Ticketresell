import React from "react";
import Background from "@/Components/Background";
import Chatpage from "@/Components/ChatBox/Chatpage";


const requestchat = () => {
  return (
    <Background test={<Chatpage />} />
  );
};
export default requestchat;
