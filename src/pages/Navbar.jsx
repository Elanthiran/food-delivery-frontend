import React from "react";
import { IoMdSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setSearch, setToggle } from "../Redux/slice/cartSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.cart.search);

  return (
    <nav className="navbar navbar-expand-lg bg-light p-3 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Search Bar */}
        <div className="d-flex align-items-center border rounded px-2 flex-grow-1 me-3">
          <IoMdSearch size={20} className="me-2 text-secondary" />
          <input
            type="text"
            className="form-control border-0 bg-light"
            placeholder="Search"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
          />
        </div>
 <button className="btn btn-outline-warning btn-small" onClick={()=>navigate("/orders")}>orders</button>
     
      </div>
    </nav>
  );
};

export default Navbar;
