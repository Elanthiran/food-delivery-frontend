import { createSlice } from "@reduxjs/toolkit";

// Optional: Read from localStorage
const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
const savedTotalQuantity = parseInt(localStorage.getItem("totalQuantity")) || 0;

const initialState = {
  cartItems: savedCartItems,
  totalQuantity: savedTotalQuantity,
  orderedItems: [],
  orderList: [],
  data: [],
  title: "",
  domain: "",
  price: "",
  image: "",
  error: "",
  search: "",
  toggle: true,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCartFromStorage: (state, action) => {
      state.cartItems = action.payload.cartItems || [];
      state.totalQuantity = action.payload.totalQuantity || 0;
    },

    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find((i) => i._id === item._id);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }

      state.totalQuantity++;
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === id);

      if (existingItem) {
        state.cartItems = state.cartItems.filter((item) => item._id !== id);
        state.totalQuantity -= existingItem.quantity;
      }
    },

    updateQuantity: (state, action) => {
      const { id, amount } = action.payload;
      const item = state.cartItems.find((item) => item._id === id);

      if (item) {
        item.quantity += amount;

        if (item.quantity <= 0) {
          state.cartItems = state.cartItems.filter((i) => i._id !== id);
        }

        state.totalQuantity += amount;
        if (state.totalQuantity < 0) state.totalQuantity = 0;
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalQuantity");
    },

    setOrderedItems: (state, action) => {
      state.orderedItems = action.payload || [...state.cartItems];
      state.cartItems = [];
      state.totalQuantity = 0;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalQuantity");
    },

    setOrderList: (state, action) => {
      state.orderList = action.payload;
    },

    setData: (state, action) => {
      state.data = action.payload;
    },

    setTitle: (state, action) => {
      state.title = action.payload;
    },

    setDomain: (state, action) => {
      state.domain = action.payload;
    },

    setPrice: (state, action) => {
      state.price = action.payload;
    },

    setImage: (state, action) => {
      state.image = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setSearch: (state, action) => {
      state.search = action.payload;
    },

    setToggle: (state, action) => {
      state.toggle = action.payload;
    },
  },
});

export const {
  loadCartFromStorage,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setOrderedItems,
  setOrderList,
  setData,
  setTitle,
  setDomain,
  setPrice,
  setImage,
  setError,
  setSearch,
  setToggle,
} = cartSlice.actions;

export default cartSlice.reducer;
