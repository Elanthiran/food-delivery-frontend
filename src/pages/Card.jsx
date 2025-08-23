import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
} from "../Redux/slice/cartSlice";

const Card = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const inCart = cartItems.find((cartItem) => cartItem._id === item._id);

  const handleAdd = () => {
    dispatch(addToCart(item));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item._id));
  };

  const handleUpdate = (amount) => {
    dispatch(updateQuantity({ id: item._id, amount }));
  };

  return (
    <div className="card p-2" style={{ width: 288 }}>
      <img
        src={item.image}
        alt={item.title}
        className="img-fluid"
        style={{ height: 200, objectFit: "cover" }}
      />
      <div className="card-body">
        <h4>{item.title}</h4>
        <div className="d-flex justify-content-between align-items-center">
          <h6>₹{item.price}</h6>
          {inCart ? (
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  inCart.quantity === 1 ? handleRemove() : handleUpdate(-1)
                }
              >
                -
              </button>
              <span>{inCart.quantity}</span>
              <button
                className="btn btn-outline-secondary"
                onClick={() => handleUpdate(1)}
              >
                +
              </button>
            </div>
          ) : (
            <button
              className="btn btn-light btn-outline-warning"
              onClick={handleAdd}
            >
              Add +
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
