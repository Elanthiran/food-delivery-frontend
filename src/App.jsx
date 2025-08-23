// App.jsx

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { login, logout } from "./Redux/slice/authSlice";
import { setData, setError } from "./Redux/slice/cartSlice";

import Navbar from "./pages/Navbar";
import Cart from "./pages/Cart";
import Fish from "./pages/Fish";
import Burger from "./pages/Burger";
import Chicken from "./pages/Chicken";
import MainDish from "./pages/MainDish";
import Egg from "./pages/Egg";
import Login from "./components/Login";
import Register from "./components/Register";
import Checkout from "./pages/CheckOut";
import OrderList from "./pages/OrderList";
import OrderDetails from "./pages/OrderDetails";
import CreateItem from "./pages/CreatePage";
import All from "./pages/All";
import Layout from "./components/Layout";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, totalQuantity, data, search } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) dispatch(login(JSON.parse(storedUser)));
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(" https://food-delivery-backend-2-vyik.onrender.com/api/users/datas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setData(res.data));
      } catch (err) {
        console.error("Fetch error:", err.message);
        dispatch(setError("Failed to load data. Please try again later."));
        if (err.response?.status === 401) {
          dispatch(logout());
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [dispatch, navigate]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("totalQuantity", totalQuantity.toString());
  }, [cartItems, totalQuantity]);

  const filteredData = useMemo(() => {
    const term = search.toLowerCase();
    return data.filter((item) =>
      term ? item.title.toLowerCase().includes(term) : true
    );
  }, [data, search]);

  return (
    <div className="container-fluid px-2">
      <nav className="navbar navbar-expand-lg bg-light border-bottom px-3">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand fw-bold">FOODOO</Link>
          <div className="d-flex align-items-center ms-auto">
            {user ? (
              <>
                <span className="me-2">Welcome, {user.username}</span>
                <span className="me-2">Role: {user.role}</span>
                {user.role === "admin" && (
                  <Link to="/create" className="btn btn-outline-success btn-sm me-2">
                    ➕ Add Item
                  </Link>
                )}
                <button className="btn btn-outline-danger btn-sm" onClick={() => {
                  dispatch(logout());
                  localStorage.clear();
                  navigate("/login");
                }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-primary btn-sm me-2" to="/login">Login</Link>
                <Link className="btn btn-outline-secondary btn-sm" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {user && (
          <>
            <Route path="/" element={<Layout><All data={filteredData} /></Layout>} />
            <Route path="/fish" element={<Layout><Fish data={filteredData} /></Layout>} />
            <Route path="/burger" element={<Layout><Burger data={filteredData} /></Layout>} />
            <Route path="/chicken" element={<Layout><Chicken data={filteredData} /></Layout>} />
            <Route path="/maindish" element={<Layout><MainDish data={filteredData} /></Layout>} />
            <Route path="/egg" element={<Layout><Egg data={filteredData} /></Layout>} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/create" element={<CreateItem />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
