import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://food-delivery-backend-1-rop5.onrender.com/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrder(response.data);
      } catch (err) {
        console.error("Order details fetch failed:", err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading order details...</div>;
  if (error) return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  if (!order) return null;


  return (
    <div className="container mt-4">
      <h2 className="mb-4">📦 Order Details</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="col-md-6">
          <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        </div>
      </div>

      {/* Payment Details */}
      {order.paymentDetails && (
        <div className="mb-4">
          <h5>💳 Payment Details</h5>
          {order.paymentMethod === "creditCard" && (
            <ul className="list-unstyled">
              <li><strong>Card Number:</strong> {order.paymentDetails.creditCard?.cardNumber}</li>
              <li><strong>Expiry:</strong> {order.paymentDetails.creditCard?.expiry}</li>
            </ul>
          )}
          {order.paymentMethod === "paypal" && (
            <p><strong>PayPal Email:</strong> {order.paymentDetails.paypal?.paypalEmail}</p>
          )}
          {order.paymentMethod === "bankTransfer" && (
            <ul className="list-unstyled">
              <li><strong>Bank:</strong> {order.paymentDetails.bankTransfer?.bankName}</li>
              <li><strong>Account Number:</strong> {order.paymentDetails.bankTransfer?.accountNumber}</li>
              <li><strong>IFSC:</strong> {order.paymentDetails.bankTransfer?.ifsc}</li>
            </ul>
          )}
          {order.paymentMethod === "upi" && (
            <p><strong>UPI ID:</strong>{order.paymentDetails?.upi?.upiId} </p>
          )}
          {order.paymentMethod === "cod" && (
            <p><strong>Payment Status:</strong> Payment on delivery (COD)</p>
          )}
        </div>
      )}

      {/* Ordered Items */}
      <h5 className="mb-3">🛒 Items Ordered</h5>
      <ul className="list-group">
        {order.items.map((item) => (
          <li
            key={item._id}
            className="list-group-item d-flex justify-content-between align-items-center flex-wrap"
          >
            <div className="d-flex align-items-center gap-3">
              <img
                src={item.image}
                alt={item.title}
                className="img-fluid rounded"
                style={{ width: 60, height: 60, objectFit: "cover" }}
              />
              <div className="fw-medium">
                {item.title} <small className="text-muted">× {item.quantity}</small>
              </div>
            </div>
            <div className="fw-bold mt-2 mt-md-0">₹{item.price * item.quantity}</div>
          </li>
        ))}
      </ul>

      {/* Back Button */}
      <div className="mt-4 text-center text-md-start">
        <Link to="/orders" className="btn btn-outline-primary">
          ← Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetails;
