import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import client from "../api/client";
import { useCart } from "../context/CartContext";

const getCategoryName = (product) => {
  const rawCategory = product?.category;

  if (!rawCategory) return "";

  if (typeof rawCategory === "string") return rawCategory.trim();

  if (typeof rawCategory === "object" && rawCategory.name) {
    return String(rawCategory.name).trim();
  }

  return String(rawCategory).trim();
};

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `http://127.0.0.1:8000${image}`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await client.get(`/products/${id}/`);
        setProduct(response.data);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <p className="product-detail-message">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <p className="product-detail-message product-detail-error">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <p className="product-detail-message">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <section className="product-detail-card">
        <div className="product-detail-image-column">
          <div className="product-detail-image-wrap">
            {product.image ? (
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="product-detail-image"
              />
            ) : (
              <div className="product-detail-image-placeholder">No Image</div>
            )}
          </div>
        </div>

        <div className="product-detail-info-column">
          <p className="product-detail-category">
            {getCategoryName(product) || "Uncategorized"}
          </p>

          <h1 className="product-detail-title">{product.name}</h1>

          <p className="product-detail-price">
            ${Number(product.price).toFixed(2)}
          </p>

          <p className="product-detail-stock">
            {product.stock > 0
              ? `In stock: ${product.stock}`
              : "Out of stock"}
          </p>

          <p className="product-detail-description">
            {product.description || "No description available."}
          </p>

          <div className="product-detail-actions">
            <button
                className="product-detail-add-to-cart"
                disabled={product.stock <= 0}
                onClick={() => addToCart(product)}
                >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>

            <Link to="/shop" className="product-detail-back-link">
              Back to Shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}