"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import Background from "@/Components/Background";
import ForgotPasswordForm from "@/Components/ForgotPassword";

const Signin = () => {
  return (
    <Background
      test={
        <div className="forgorPassword">
          <SessionProvider>{<ForgotPasswordForm />}</SessionProvider>
        </div>
      }
    />
  );
};

export default Signin;
