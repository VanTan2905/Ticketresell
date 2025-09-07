import { createStore } from 'redux';

// Define types for the item to add
interface Item {
  UserId: number;
  TicketId: number;
  Quantity: number;
}

// Define types for the CartItem (which might be similar to Item)
interface CartItem extends Item {}

// Define the state type
interface CartState {
  cart: CartItem[];
}

// Action type constants
const ADD_TO_CART = 'ADD_TO_CART';

interface AddToCartAction {
  type: typeof ADD_TO_CART;
  payload: Item; // The payload structure follows your addItem function result
}

// Define the initial state
const initialState: CartState = {
  cart: []
};

// Reducer function
const cartReducer = (state = initialState, action: AddToCartAction): CartState => {
  switch (action.type) {
    case ADD_TO_CART:
      const existingItem = state.cart.find(item => item.TicketId === action.payload.TicketId);

      if (existingItem) {
        // Update the quantity of the existing item
        return {
          ...state,
          cart: state.cart.map(item =>
            item.TicketId === action.payload.TicketId
              ? { ...item, Quantity: item.Quantity + action.payload.Quantity }
              : item
          )
        };
      } else {
        // Add new item to the cart
        return {
          ...state,
          cart: [...state.cart, action.payload]
        };
      }
    default:
      return state;
  }
};

// Create store
const store = createStore(cartReducer);

export default store;
