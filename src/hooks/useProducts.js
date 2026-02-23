// src/hooks/useProducts.js
import { useState, useEffect } from "react";
import axios from "axios";

const BASE = "https://dummyjson.com";

// ── GET all products + categories ──────────────────────────────
export function useProducts() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${BASE}/products?limit=100`),
          axios.get(`${BASE}/products/categories`),
        ]);
        if (!cancelled) {
          setProducts(prodRes.data.products);
          setCategories(catRes.data);
        }
      } catch {
        if (!cancelled) setError("Failed to load products. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, []);

  return { products, categories, loading, error };
}

// ── GET products by category ────────────────────────────────────
export function useProductsByCategory(slug) {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BASE}/products/category/${slug}`);
        if (!cancelled) setProducts(res.data.products);
      } catch {
        if (!cancelled) setError("Failed to load this category.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [slug]);

  return { products, setProducts, loading, error };
}

// ── POST — add new product ──────────────────────────────────────
export async function addProduct(data) {
  const res = await axios.post(`${BASE}/products/add`, data);
  return res.data; // returns new product with fake id
}

// ── PUT — fully update a product ───────────────────────────────
export async function updateProduct(id, data) {
  const res = await axios.put(`${BASE}/products/${id}`, data);
  return res.data;
}

// ── DELETE — remove a product ───────────────────────────────────
export async function deleteProduct(id) {
  const res = await axios.delete(`${BASE}/products/${id}`);
  return res.data;
}
