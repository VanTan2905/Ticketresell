"use client";
import React from 'react';
import '@/Css/MyCart.css'; // Updated

import History from '@/Components/History';
import Background from '@/Components/Background';

const MyCart = () => {
    return (
       
        <Background test={ <History/>} />
   
    );
};

export default MyCart; // Updated
