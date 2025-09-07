"use client";
import React from 'react';
import '@/Css/Announcement.css'; // Ensure the path is correct to your CSS

const Announce: React.FC = () => {
    return (
        <div className="announcement-container">
            <div className="announcement-content">
                <img 
                    src="https://png.pngtree.com/png-clipart/20220321/original/pngtree-loudspeaker-icon-png-image_7464541.png" 
                    alt="Announcement Icon" 
                    className="announcement-icon"
                />
                <img 
                    src="https://png.pngtree.com/png-clipart/20220321/original/pngtree-loudspeaker-icon-png-image_7464541.png" 
                    alt="Announcement Icon" 
                    className="announcement-icon"
                />
                <img 
                    src="https://png.pngtree.com/png-clipart/20220321/original/pngtree-loudspeaker-icon-png-image_7464541.png" 
                    alt="Announcement Icon" 
                    className="announcement-icon"
                />
                <p>Top Seller: 1. Lê Minh Quang             2. Huỳnh Vương Khang            3. Đỗ Khắc Phú Vinh</p>
            </div>
        </div>
    );
};

export default Announce;
