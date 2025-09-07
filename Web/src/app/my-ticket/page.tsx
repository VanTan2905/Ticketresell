import React from "react";
import Background from "@/Components/Background";

import MyTicketsPage from "@/Components/MyTicket"

const MyTicket = () => {
  return (
    <div className="myticket">
      <Background
        test={
          <div>
            <MyTicketsPage />
          </div>
        }
      />
   

    </div>
  );
};

export default MyTicket;
