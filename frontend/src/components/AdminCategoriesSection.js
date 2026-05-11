import { useEffect, useState } from "react";
import client from "../api/client";
import ConfirmModal from "./ConfirmModal";

export default function AdminCategoriesSection() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
        setLoading(true);
        const response = await client.get("/categories/");
        setCategories(response.data);
        setError("");
        } catch (err) {
        console.log(err.response?.data);
        setError("Failed to load categories.");
        } finally {
        setLoading(false);
        }
    }

    function slugify(text) {
        return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-");
    }

    function handleChange(e) {
        const { name, value } = e.target;

        if (name === "name") {
        setFormData((prev) => ({
            ...prev,
            name: value,
            slug: slugify(value),
        }));
        return;
        }

        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    }

    function resetForm() {
        setFormData({
        name: "",
        slug: "",
        });
        setEditingId(null);
    }

    function handleEdit(category) {
        setEditingId(category.id);
        setFormData({
        name: category.name || "",
        slug: category.slug || "",
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError("");

        const payload = {
        name: formData.name,
        slug: formData.slug || slugify(formData.name),
        };

        try {
        if (editingId) {
            await client.put(`/categories/${editingId}/`, payload);
        } else {
            await client.post("/categories/", payload);
        }

        await fetchCategories();
        resetForm();
        } catch (err) {
        console.log(err.response?.data);
        setError(
            err.response?.data?.detail ||
            JSON.stringify(err.response?.data) ||
            "Failed to save category."
        );
        } finally {
        setSaving(false);
        }
    }

    function handleDeleteClick(categoryId) {
        setDeleteId(categoryId);
    }

    async function confirmDelete() {
        if (!deleteId) return;

        try {
        await client.delete(`/categories/${deleteId}/`);
        setCategories((prev) =>
            prev.filter((category) => category.id !== deleteId)
        );

        if (editingId === deleteId) {
            resetForm();
        }
        } catch (err) {
        console.log(err.response?.data);
        setError(
            err.response?.data?.detail ||
            JSON.stringify(err.response?.data) ||
            "Failed to delete category."
        );
        } finally {
        setDeleteId(null);
        }
    }

    return (
        <section id="admin-categories" className="admin-scroll-section">
        <div className="admin-card">
            <div className="admin-card-header">
            <div>
                <p className="admin-section-eyebrow">Categories</p>
                <h2 className="admin-card-title">
                {editingId ? "Edit Category" : "Manage Categories"}
                </h2>
            </div>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-row">
                <div className="admin-form-field">
                <label htmlFor="name">Category Name</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    required
                />
                </div>

                {/* <div className="admin-form-field">
                <label htmlFor="slug">Slug</label>
                <input
                    id="slug"
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="category-slug"
                    required
                />
                </div> */}
            </div>

            {error ? <p className="admin-form-error">{error}</p> : null}

            <div className="admin-card-actions">
                <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
                >
                {saving
                    ? editingId
                    ? "Saving..."
                    : "Creating..."
                    : editingId
                    ? "Save Changes"
                    : "Create Category"}
                </button>

                <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
                >
                {editingId ? "Cancel Edit" : "Clear"}
                </button>
            </div>
            </form>

            <div className="admin-table-spacer" />

            {loading ? (
            <p className="admin-empty-text">Loading categories...</p>
            ) : categories.length === 0 ? (
            <p className="admin-empty-text">No categories found.</p>
            ) : (
            <div className="admin-table-wrap">
                <table className="admin-table">
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map((category) => (
                    <tr key={category.id}>
                        <td>{category.name}</td>
                        <td>
                        <div className="admin-table-actions">
                            <button
                            type="button"
                            className="admin-table-link-button"
                            onClick={() => handleEdit(category)}
                            >
                            Edit
                            </button>

                            <button
                            type="button"
                            className="admin-table-delete"
                            onClick={() => handleDeleteClick(category.id)}
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
        </div>

        <ConfirmModal
            open={!!deleteId}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteId(null)}
        />
        </section>
    );
    }