"use client";
import React, { Suspense } from "react";
import "@/Css/Admin.css";
import AdminPage from "@/Components/AdminPage";

const Admin = () => {
  return (
    <div className="bg-white">
      <Suspense fallback={<div>Loading...</div>}>
        <AdminPage />
      </Suspense>
    </div>
  );
};

export default Admin;
