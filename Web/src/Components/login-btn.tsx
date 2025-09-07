import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";
export default function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Đã đăng nhập với {session.user?.email as string} <br />
        <button onClick={() => signOut()}>Đăng xuất</button>
      </>
    );
  }
  return (
    <>
      <button onClick={() => signIn()}>Đăng nhập với Google</button>
    </>
  );
}
