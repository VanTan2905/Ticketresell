import React from "react";
import Background from "@/Components/Background";
import UpdateTicket from "@/Components/UpdateTicket";

const Ticket = () => {
  return (
    <div>
      <Background test={<UpdateTicket/>} />
    </div>
  );
};

export default Ticket;
