// pages/CreatePage.jsx

import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Compressor from "compressorjs";

import {
  setTitle,
  setDomain,
  setPrice,
  setImage,
  setError,
} from "../Redux/slice/cartSlice";

const CreatePage = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { title, domain, price, image, error } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      dispatch(setError("Please upload a valid image under 5MB."));
      return;
    }

    new Compressor(file, {
      quality: 0.6,
      success(result) {
        const reader = new FileReader();
        reader.onloadend = () => dispatch(setImage(reader.result));
        reader.readAsDataURL(result);
      },
      error(err) {
        console.error("Image compression error:", err);
        dispatch(setError("Image compression failed. Please try again."));
      },
    });
  };

  const handleSubmit = async (e) => 
{
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!title || !domain || !price || isNaN(price) || !image) {
      dispatch(setError("Please fill in all fields correctly and upload an image."));
      return;
    }

    try {
      const response = await axios.post(
        " https://food-delivery-backend-2-vyik.onrender.com/api/users/datas",
        { title, domain, price: Number(price), image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Clear form on success
      dispatch(setTitle(""));
      dispatch(setDomain(""));
      dispatch(setPrice(""));
      dispatch(setImage(""));
      dispatch(setError(""));
      if (fileInputRef.current) fileInputRef.current.value = "";

      alert("Item added successfully!");

    } catch (err) {
      console.error("Axios POST error:", err);

      const message =
        err.response?.data?.message ||
        (err.response?.status === 403
          ? "Access denied. Only admins can add items."
          : "Failed to submit data. Please try again.");

      dispatch(setError(message));
    }
};

  if (!user || user.role !== "admin") {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3>Add New Menu Item</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <input
            type="text"
            className="form-control"
            value={domain}
            onChange={(e) => dispatch(setDomain(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => dispatch(setPrice(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <label>Image Upload</label>
          <input
            type="file"
            className="form-control"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/*"
          />
        </div>
        {image && (
          <div className="mb-3">
            <img src={image} alt="Preview" style={{ maxHeight: 150 }} />
          </div>
        )}
        <button className="btn btn-primary" type="submit">
          Create Item
        </button>
      </form>
    </div>
  );
};

export default CreatePage;
