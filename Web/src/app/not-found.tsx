// app/not-found.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/Components/Navbar";
import Background from "@/Components/Background";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the homepage after a short delay
    const timeout = setTimeout(() => {
      router.push("/");
    }, 2000); // Adjust delay as needed (in milliseconds)

    return () => clearTimeout(timeout); // Clear timeout on component unmount
  }, [router]);
  return (
    <div className=" h-screen">
      <Navbar page={"a"} />
      <Background
        test={
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
            <p className="mt-4">Redirecting to homepage...</p>
          </div>
        }
      />
    </div>
  );
}
