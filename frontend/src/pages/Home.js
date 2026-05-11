import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `http://127.0.0.1:8000${image}`;
};

const Home = () => {
  const [banner, setBanner] = useState(null);
  const [topBar, setTopBar] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchTopBar();
    fetchBanner();
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchBanner() {
    try {
      const response = await client.get("/banner/");
      setBanner(response.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  }

  async function fetchProducts() {
    try {
      const response = await client.get("/products/");
      setProducts(response.data.slice(0, 4));
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await client.get("/categories/");
      setCategories(response.data);
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setLoadingCategories(false);
    }
  }

  async function fetchTopBar() {
  try {
    const response = await client.get("/top-bar/");
    setTopBar(response.data);
  } catch (err) {
    console.log(err.response?.data);
  }
}

  return (
    <div>
      <div className="top-strip">
        {topBar?.message || "Free shipping on orders over $99"}
      </div>

      <section className="hero-section">
        <aside className="sidebar">
          <h3>Categories</h3>

          {loadingCategories ? (
            <p>Loading...</p>
          ) : categories.length === 0 ? (
            <p>No categories</p>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="category-item"
              >
                {cat.name}
              </Link>
            ))
          )}
        </aside>

        <div className="hero-banner">
          <img
            src={
              banner?.image
                ? getImageUrl(banner.image)
                : "https://via.placeholder.com/1200x500"
            }
            alt="hero"
          />
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <span className="hero-badge">
              {banner?.eyebrow || "Premium Gear"}
            </span>
            <h1>{banner?.title || "Precision Archery Equipment"}</h1>
            <p>{banner?.subtitle || "Shop bows, arrows, and accessories."}</p>

            <div className="hero-buttons">
              <Link to={banner?.button_link || "/shop"} className="btn-primary">
                {banner?.button_text || "Shop Now"}
              </Link>
              <Link to="/register" className="btn-secondary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Featured Products</h2>

        {loadingProducts ? (
          <p>Loading featured products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card">
                {p.image ? (
                  <img src={getImageUrl(p.image)} alt={p.name} />
                ) : (
                  <div className="product-image-placeholder">No Image</div>
                )}

                <div className="product-info">
                  <h3>{p.name}</h3>
                  <p className="product-price">
                    ${Number(p.price).toFixed(2)}
                  </p>

                  <Link
                    to={`/products/${p.id}`}
                    className="product-button"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;