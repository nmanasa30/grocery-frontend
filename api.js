// src/api.js

import axios from "axios";

// Change this URL when testing locally or after deploy
const API_URL = "http://127.0.0.1:5000"; // or "https://grocery-backend-7hlc.onrender.com" for deployed

// Example: Get all products
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Example: Add a product
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/api/products`, productData);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

// Example: User login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
  }
};
