import { useEffect, useState } from "react";
import client from "../api/client";

export default function AdminBannerSection() {
    const [formData, setFormData] = useState({
        eyebrow: "",
        title: "",
        subtitle: "",
        button_text: "",
        button_link: "",
        is_active: true,
    });

    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const getImageUrl = (image) => {
        if (!image) return "";
        if (image.startsWith("http://") || image.startsWith("https://")) return image;
        return `http://127.0.0.1:8000${image}`;
    };

    useEffect(() => {
        fetchBanner();
    }, []);

    async function fetchBanner() {
        try {
        const response = await client.get("/admin/banner/");
        const banner = response.data;

        setFormData({
            eyebrow: banner.eyebrow || "",
            title: banner.title || "",
            subtitle: banner.subtitle || "",
            button_text: banner.button_text || "",
            button_link: banner.button_link || "",
            is_active: banner.is_active ?? true,
        });

        setExistingImage(banner.image || "");
        } catch (err) {
        console.log(err.response?.data);
        setError("Failed to load banner.");
        }
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleImageChange(e) {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError("");

        const data = new FormData();
        data.append("eyebrow", formData.eyebrow);
        data.append("title", formData.title);
        data.append("subtitle", formData.subtitle);
        data.append("button_text", formData.button_text);
        data.append("button_link", formData.button_link);
        data.append("is_active", formData.is_active);

        if (imageFile) {
        data.append("image", imageFile);
        }

        try {
        const response = await client.put("/admin/banner/", data, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });

        setExistingImage(response.data.image || "");
        setImageFile(null);
        } catch (err) {
        console.log(err.response?.data);
        setError(
            err.response?.data?.detail ||
            JSON.stringify(err.response?.data) ||
            "Failed to save banner."
        );
        } finally {
        setSaving(false);
        }
    }

    return (
        <section id="admin-banner" className="admin-scroll-section">
        <div className="admin-card">
            <div className="admin-card-header">
            <div>
                <p className="admin-section-eyebrow">Homepage</p>
                <h2 className="admin-card-title">Edit Hero Banner</h2>
            </div>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-field">
                <label htmlFor="eyebrow">Eyebrow</label>
                <input
                id="eyebrow"
                name="eyebrow"
                value={formData.eyebrow}
                onChange={handleChange}
                />
            </div>

            <div className="admin-form-field">
                <label htmlFor="title">Title</label>
                <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                />
            </div>

            <div className="admin-form-field">
                <label htmlFor="subtitle">Subtitle</label>
                <textarea
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                rows="4"
                />
            </div>

            <div className="admin-form-row">
                <div className="admin-form-field">
                <label htmlFor="button_text">Button Text</label>
                <input
                    id="button_text"
                    name="button_text"
                    value={formData.button_text}
                    onChange={handleChange}
                />
                </div>

                <div className="admin-form-field">
                <label htmlFor="button_link">Button Link</label>
                <input
                    id="button_link"
                    name="button_link"
                    value={formData.button_link}
                    onChange={handleChange}
                />
                </div>
            </div>

            <div className="admin-form-field">
                <label htmlFor="image">Banner Image</label>
                <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                />
            </div>

            {existingImage && !imageFile ? (
                <div className="admin-image-preview-wrap">
                <p className="admin-image-preview-label">Current Banner</p>
                <img
                    src={getImageUrl(existingImage)}
                    alt="Current banner"
                    className="admin-image-preview"
                />
                </div>
            ) : null}

            <label className="filter-checkbox">
                <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                />
                <span>Banner active</span>
            </label>

            {error ? <p className="admin-form-error">{error}</p> : null}

            <div className="admin-card-actions">
                <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
                >
                {saving ? "Saving..." : "Save Banner"}
                </button>
            </div>
            </form>
        </div>
        </section>
    );
    }