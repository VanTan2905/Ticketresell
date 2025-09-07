"use client";
import React from "react";
import Login from "@/Components/Login";
import { SessionProvider } from "next-auth/react";
import Background from "@/Components/Background";

const Signin = () => {
  return (
    <Background
      test={
        <div className="Signin">
          <SessionProvider>{<Login />}</SessionProvider>
        </div>
      }
    />
  );
};

export default Signin;
