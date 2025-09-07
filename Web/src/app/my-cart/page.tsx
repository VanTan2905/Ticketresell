"use client";
import React from 'react';
import '@/Css/MyCart.css'; // Updated

import Cart from '@/Components/Cart';
import Background from '@/Components/Background';

const MyCart = () => {
    return (
        <Background test={ <Cart/>} />
    );
};

export default MyCart; // Updated
