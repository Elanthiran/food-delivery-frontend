// Header.jsx
import React from "react";
import { Link } from "react-router-dom";

import fishImage from "../Images/fish9.jpg";
import burgerImage from "../Images/b1.jpg";
import chickenImage from "../Images/c9.jpg";
import maindishImage from "../Images/m2.jpg";
import eggImage from "../Images/s1.jpg";
import AllImage from "../Images/a1.jpg"

const Header = () => {
  return (
    <div className="row text-center mt-4">
      {[
        { path: "/", image:AllImage, label: "All" },
        { path: "/fish", image: fishImage, label: "Fish" },
        { path: "/chicken", image: chickenImage, label: "Chicken" },
        { path: "/burger", image: burgerImage, label: "Burger" },
        { path: "/maindish", image: maindishImage, label: "MainDish" },
        { path: "/egg", image: eggImage, label: "Egg" },
      ].map((item) => (
        <div key={item.label} className="col-4 col-sm-2 mb-3">
          <Link to={item.path} className="text-decoration-none d-block">
            <img
              src={item.image}
              alt={item.label}
              className="rounded-circle mb-1"
              style={{ width: "100%", maxWidth: 80, height: 50, objectFit: "cover" }}
            />
            <div className="small">{item.label}</div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Header;
