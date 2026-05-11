import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";

export default function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  async function fetchCategories() {
    try {
      const response = await client.get("/categories/");
      setCategories(response.data);
    } catch (err) {
      console.log(err.response?.data);
      setError("Failed to load categories.");
    }
  }

  async function fetchProduct() {
    try {
      const response = await client.get(`/products/${id}/`);
      const product = response.data;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category?.id || product.category || "",
      });
      setExistingImage(product.image || "");
    } catch (err) {
      console.log(err.response?.data);
      setError("Failed to load product.");
    } finally {
      setLoading(false);
    }
  }

  const handleImageChange = (e) => {
      const file = e.target.files?.[0] || null;
      setImageFile(file);
    }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      setError("");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category_id", formData.category);

      if (imageFile) {
        data.append("image", imageFile);
      }

      try {
        if (isEditing) {
          await client.put(`/products/${id}/`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          await client.post("/products/", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        navigate("/admin");
      } catch (err) {
        console.log(err.response?.data);
        setError(
          err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Failed to save product."
        );
      } finally {
        setSaving(false);
      }
    };

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-empty-text">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <p className="admin-eyebrow">Admin Panel</p>
        <h1 className="admin-title">
          {isEditing ? "Edit Product" : "Add Product"}
        </h1>
        <p className="admin-subtitle">
          {isEditing
            ? "Update this product in your catalog."
            : "Create a new product for your store."}
        </p>
      </div>

      <section className="admin-card admin-form-card">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-field">
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="5"
              required
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-field">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="stock">Stock</label>
              <input
                id="stock"
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div className="admin-form-field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-field">
            <label htmlFor="image">Product Image</label>
            <input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {existingImage && !imageFile ? (
            <div className="admin-image-preview-wrap">
              <p className="admin-image-preview-label">Current Image</p>
              <img
                src={existingImage}
                alt="Current product"
                className="admin-image-preview"
              />
            </div>
          ) : null}

          {imageFile ? (
            <p className="admin-selected-file">Selected file: {imageFile.name}</p>
          ) : null}

          {error ? <p className="admin-form-error">{error}</p> : null}

          <div className="admin-card-actions">
            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving}
            >
              {saving
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                ? "Save Changes"
                : "Create Product"}
            </button>

            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => navigate("/admin")}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}