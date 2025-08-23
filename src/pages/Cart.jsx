import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  removeFromCart,
  updateQuantity,
} from "../Redux/slice/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("totalQuantity", totalQuantity.toString());
  }, [cartItems, totalQuantity]);

  const handleUpdate = (id, amount) => {
    dispatch(updateQuantity({ id, amount }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      className="min-vh-100 d-flex align-items-start justify-content-center py-5 px-2"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chanwalrus-958545.jpg&fm=jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container bg-white bg-opacity-75 p-4 rounded shadow" style={{ maxWidth: "1200px", width: "100%" }}>
        <h2 className="mb-4 text-center">🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <div className="alert alert-info text-center">Your cart is empty.</div>
        ) : (
          <>
            <div className="row g-4">
              {cartItems.map((item) => (
                <div key={item._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={item.image}  
                      alt={item.title}
                      className="img-fluid rounded-top"
                      style={{ height: 180, objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h6 className="text-truncate" title={item.title}>{item.title}</h6>
                      <p className="text-muted mb-2">Price: ₹{item.price}</p>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            item.quantity === 1
                              ? handleRemove(item._id)
                              : handleUpdate(item._id, -1)
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleUpdate(item._id, 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm mt-auto"
                        onClick={() => handleRemove(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Amount and Checkout */}
            <div className="mt-4 p-3 border rounded bg-light">
              <h5>Total Amount: ₹{totalAmount}</h5>
              <button
                className="btn btn-success mt-2"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}

        {/* Back to Shopping */}
        <div className="mt-4 text-center">
          <button
            className="btn btn-outline-dark"
            onClick={() => navigate("/")}
          >
            ← Back to Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
