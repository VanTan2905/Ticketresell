import React from "react";
import AddTicketModal from "@/Components/AddTicketPage";
import Background from "@/Components/Background";
const Add = () => {
  return (
    <div className="Add">
      <Background test={< AddTicketModal />} />
    </div>
  );
};

export default Add;