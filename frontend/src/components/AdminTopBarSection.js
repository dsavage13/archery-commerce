import { useEffect, useState } from "react";
import client from "../api/client";

export default function AdminTopBarSection() {
    const [formData, setFormData] = useState({
        message: "",
        is_active: true,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTopBar();
    }, []);

    async function fetchTopBar() {
        try {
        const response = await client.get("/admin/top-bar/");
        const bar = response.data;

        setFormData({
            message: bar.message || "",
            is_active: bar.is_active ?? true,
        });
        } catch (err) {
        console.log(err.response?.data);
        setError("Failed to load top bar.");
        }
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
        await client.put("/admin/top-bar/", formData);
        } catch (err) {
        console.log(err.response?.data);
        setError("Failed to save top bar.");
        } finally {
        setSaving(false);
        }
    }

    return (
        <section id="admin-top-bar" className="admin-scroll-section">
        <div className="admin-card">
            <div className="admin-card-header">
            <div>
                <p className="admin-section-eyebrow">Homepage</p>
                <h2 className="admin-card-title">Edit Top Bar</h2>
            </div>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-field">
                <label htmlFor="message">Announcement Text</label>
                <input
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Free shipping on orders over $99"
                required
                />
            </div>

            <label className="filter-checkbox">
                <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                />
                <span>Top bar active</span>
            </label>

            {error ? <p className="admin-form-error">{error}</p> : null}

            <div className="admin-card-actions">
                <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
                >
                {saving ? "Saving..." : "Save Top Bar"}
                </button>
            </div>
            </form>
        </div>
        </section>
    );
    }