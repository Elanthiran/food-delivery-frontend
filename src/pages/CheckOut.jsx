import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart, setError } from "../Redux/slice/cartSlice";

const CheckOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, totalQuantity, error } = useSelector((state) => state.cart);

  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Payment method fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upiId, setUpiId] = useState("");

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shippingAddress || !paymentMethod) {
      dispatch(setError("Please fill out all required fields."));
      return;
    }

    if (cartItems.length === 0) {
      dispatch(setError("Your cart is empty."));
      return;
    }

    // Payment validation
    if (paymentMethod === "creditCard" && (!cardNumber || !expiry || !cvv)) {
      dispatch(setError("Please enter valid credit card details."));
      return;
    }

    if (paymentMethod === "paypal" && !paypalEmail) {
      dispatch(setError("Please enter your PayPal email."));
      return;
    }

    if (paymentMethod === "bankTransfer" && (!bankName || !accountNumber || !ifsc)) {
      dispatch(setError("Please fill in all bank transfer details."));
      return;
    }

    if (paymentMethod === "upi" && !upiId) {
      dispatch(setError("Please enter your UPI ID."));
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(setError("You must be logged in to place an order."));
      return;
    }

    const order = {
      items: cartItems,
      shippingAddress,
      paymentMethod,
      paymentDetails: {
        creditCard: paymentMethod === "creditCard" ? { cardNumber, expiry, cvv } : undefined,
        paypal: paymentMethod === "paypal" ? { paypalEmail } : undefined,
        bankTransfer: paymentMethod === "bankTransfer" ? { bankName, accountNumber, ifsc } : undefined,
        upi: paymentMethod === "upi" ? { upiId } : undefined,
      },
    };

    try {
      await axios.post("http://localhost:5000/api/orders", order, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(clearCart());
      setOrderPlaced(true);
      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      console.error("Order error:", err);
      dispatch(setError("Failed to place order. Please try again."));
    }
  };

  return (
    <div className="container mt-4">
      <h2>🧾 Checkout</h2>

      {orderPlaced ? (
        <div className="alert alert-success mt-4">
          Order placed successfully! Redirecting to orders...
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Shipping Address</label>
            <textarea
              className="form-control"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your address"
              rows="3"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="">Select...</option>
              <option value="creditCard">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bankTransfer">Bank Transfer</option>
              <option value="upi">UPI</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>

          {/* Payment Method Specific Inputs */}
          {paymentMethod === "creditCard" && (
            <div className="mb-3">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
              <div className="d-flex flex-column flex-md-row gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="mb-3">
              <label className="form-label">PayPal Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                required
              />
            </div>
          )}

          {paymentMethod === "bankTransfer" && (
            <>
              <div className="mb-3">
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Account Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">IFSC Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {paymentMethod === "upi" && (
            <div className="mb-3">
              <label className="form-label">UPI ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="yourname@bank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
            </div>
          )}

          {/* No additional input needed for COD */}

          <h4 className="mt-4">Order Summary</h4>
          <ul className="list-group mb-3">
            {cartItems.map((item) => (
              <li
                key={item._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div><strong>{item.title}</strong> × {item.quantity}</div>
                <div>₹{item.price * item.quantity}</div>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between mb-3">
            <span><strong>Total Quantity:</strong> {totalQuantity}</span>
            <span><strong>Total Price:</strong> ₹{totalAmount.toFixed(2)}</span>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-success w-100">
            Confirm & Place Order
          </button>
        </form>
      )}
    </div>
  );
};

export default CheckOut;
