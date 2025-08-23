import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../Redux/slice/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post(" https://food-delivery-backend-2-vyik.onrender.com/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      dispatch(login(res.data.user));
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setErrorMsg(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/premium-photo/background-cooking-set-spices-fresh-vegetables-top-view-free-space-your-text-black-stone-background_187166-56648.jpg?semt=ais_hybrid&w=740')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Dark overlay */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      ></div>

      {/* Login Form */}
      <div
        className="container position-relative"
        style={{ zIndex: 2, maxWidth: "400px", width: "100%" }}
      >
        <div
          className="bg-white p-4 rounded shadow"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2 className="mb-4 text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
