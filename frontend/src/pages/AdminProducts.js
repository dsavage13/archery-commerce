import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import ConfirmModal from "../components/ConfirmModal";

const getCategoryName = (product) => {
  const rawCategory = product.category;

  if (!rawCategory) return "Uncategorized";
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

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await client.get("/products/");
      setProducts(response.data);
      setError("");
    } catch (err) {
      console.log(err.response?.data);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteClick(productId) {
    setDeleteId(productId);
  }

  async function confirmDelete() {
    try {
      await client.delete(`/products/${deleteId}/`);
      setProducts((prev) =>
        prev.filter((product) => product.id !== deleteId)
      );
    } catch (err) {
      console.log(err.response?.data);
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Failed to delete product."
      );
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <p className="admin-eyebrow">Admin Panel</p>
        <h1 className="admin-title">Manage Products</h1>
        <p className="admin-subtitle">
          Edit your catalog, update inventory, and manage product listings.
        </p>
      </div>

      <section className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Product List</h2>

          <div className="admin-card-actions">
            <Link to="/admin/products/new" className="admin-primary-link">
              Add Product
            </Link>
            <Link to="/admin/categories" className="admin-secondary-link">
              Manage Categories
            </Link>
          </div>
        </div>

        {error ? <p className="admin-form-error">{error}</p> : null}

        {loading ? (
          <p className="admin-empty-text">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="admin-empty-text">No products found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-product-cell">
                        <div className="admin-product-thumb-wrap">
                          {product.image ? (
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="admin-product-thumb"
                            />
                          ) : (
                            <div className="admin-product-thumb-placeholder">
                              No Image
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="admin-product-name">{product.name}</p>
                          <p className="admin-product-description">
                            {product.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>{getCategoryName(product)}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>{product.stock}</td>

                    <td>
                      <div className="admin-table-actions">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="admin-table-link"
                        >
                          Edit
                        </Link>

                        <button
                          className="admin-table-delete"
                          onClick={() => handleDeleteClick(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmModal
        open={!!deleteId}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}