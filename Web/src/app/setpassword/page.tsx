"use client";
import React from "react";
import SetPasswordPage from "@/Components/SetPasswordPage";
import Background from "@/Components/Background";
import { SessionProvider } from "next-auth/react";

const SetPassword = () => {
    return (
        <Background
          test={
            <div className="forgorPassword">
              <SessionProvider>{<SetPasswordPage />}</SessionProvider>
            </div>
          }
        />
      );
};

export default SetPassword;
