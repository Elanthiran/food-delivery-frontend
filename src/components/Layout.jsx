// Layout.jsx
import React from "react";
import Header from "./Header";
import Navbar from "../pages/Navbar";

const Layout = ({ children }) => {
  return (
    <>
    <Navbar />
      <Header />
      <div className="container">
        {children}
      </div>
    </>
  );
};

export default Layout;
