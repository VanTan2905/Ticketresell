"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import Background from "@/Components/Background";
import PasswordChangeForm from "@/Components/CreatePasswordForm";

const Signin = () => {
  return (
    <Background
      test={
        <div className="createPassword">
          <SessionProvider>{<PasswordChangeForm />}</SessionProvider>
        </div>
      }
    />
  );
};

export default Signin;
