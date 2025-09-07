

// authService.ts
export const logoutUser = async (userId: string | undefined) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Authentication/logout/${userId}`,
      {
        method: "POST", // or "DELETE" depending on your API
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response);

    if (response.ok) {
      // If the response is successful
      console.log("Logout successful");
      return true;
    } else {
      // Handle non-200 responses
      const errorData = await response.json();
      console.error("Logout failed:", errorData);
      return false;
    }
  } catch (error) {
    // Handle network or other errors
    console.error("An error occurred during logout:", error);
    return false;
  }
};
