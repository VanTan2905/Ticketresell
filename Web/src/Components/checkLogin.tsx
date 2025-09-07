import Cookies from "js-cookie";

export const checkLogin = async () => {
  const accessKey = Cookies.get("accessKey");
  const validate = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/Authentication/islogged`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessKey: accessKey,
      }),
    }
  );
  const response = await validate.json();
  return response.message;
};
