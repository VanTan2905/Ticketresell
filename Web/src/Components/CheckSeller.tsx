import Cookies from "js-cookie";

export const CheckSeller = async (): Promise<boolean> => {
  const id = Cookies.get('id'); // Get the user ID from the cookie
  console.log(id); // Log the user ID
  
  if (!id) return false; 

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/check/${id}`, {
      method: "GET",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    if (result.statusCode === 200 && result.data === null) {
      return true; // Seller does not exist or is inactive
    } else {
      return false; // Seller exists and is active
    }
  } catch (error) {
    console.error("Error fetching seller status:", error);
    return false; // Return false in case of an error
  }
};
