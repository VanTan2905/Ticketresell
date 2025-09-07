"use client";
import React from "react";
import "@/Css/SellBox.css"
import { deleteImage } from "@/models/Deleteimage";
import { log } from "console";

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  ticketId: string;
}

const Popup: React.FC<PopupProps> = ({ isVisible, onClose, ticketId }) => {
  if (!isVisible) return null;
  if(ticketId!=null){
    console.log(ticketId);
  }
  const handleClick = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Ticket/deletebybaseid/${ticketId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete ticket");
      }

      const imageDeleteResult = await deleteImage(ticketId);
      if (imageDeleteResult.success == true && response.ok) {
        console.log(`ticket with Ticket ID ${ticketId} deleted successfully.`);
      } else {
        console.error(`Failed to delete image: ${imageDeleteResult.error}`);
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }

    onClose(); // Close the popup
  };

  return (
    <div className="dialog-background" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Thông báo</h2>
        </div>
        <div className="dialog-body">Bạn có muốn xóa vé này không?</div>
        <div className="dialog-footer">
          <button className="button secondary" onClick={onClose}>
            Hủy
          </button>
          <button className="button primary" onClick={handleClick}>
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
