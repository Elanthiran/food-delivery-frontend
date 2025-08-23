import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in.");
      return;
    }

    axios
      .get(" https://food-delivery-backend-2-vyik.onrender.com/api/orders", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        const data = res.data.orders || res.data || [];
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
          setMessage("");
        } else {
          setMessage("No orders found.");
        }
      })
      .catch(() => {
        setMessage("Error loading orders.");
      });
  }, []);

  if (message)
    return (
      <div className="container text-center mt-5">
        <p className="fs-5">{message}</p>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">🧾 Your Orders</h2>
      <div className="row">
        {orders.map((order) => (
          <div key={order._id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Order ID: {order._id}</h5>
                <p className="card-text mb-3">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <ul className="list-group list-group-flush mb-3 flex-grow-1">
                  {order.items &&
                    order.items.map((item, i) => (
                      <li
                        key={i}
                        className="list-group-item d-flex align-items-center gap-3"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 5 }}
                          />
                        )}
                        <div>
                          <div className="fw-semibold">{item.title}</div>
                          <small>Qty: {item.quantity}</small>
                        </div>
                      </li>
                    ))}
                </ul>
                <Link
                  to={`/orders/${order._id}`}
                  className="btn btn-primary mt-auto"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderList;
