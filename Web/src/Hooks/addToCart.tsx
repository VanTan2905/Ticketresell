interface CartItemPayload {
  UserId: string | undefined;
  TicketId: string;
  Quantity: number;
}

const addToCart = () => {
  const addItem = async (cartItem: CartItemPayload) => {
    const { UserId, TicketId, Quantity } = cartItem;

    // Create the payload
    const payload: CartItemPayload = {
      UserId: cartItem.UserId,
      TicketId: cartItem.TicketId,
      Quantity: cartItem.Quantity,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Cart/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const result = await response.json();
      return result; // Return the response if needed
    } catch (error) {
      console.error("Error adding to cart:", error);
      return null; // Return null or handle the error as needed
    }
  };

  return {
    addItem,
  };
};

export default addToCart;
