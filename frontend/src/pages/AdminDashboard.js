import { Link } from "react-router-dom";
import AdminSectionNav from "../components/AdminSectionNav";
import AdminProductsSection from "../components/AdminProductsSection";
import AdminCategoriesSection from "../components/AdminCategoriesSection";
import AdminBannerSection from "../components/AdminBannerSection";
import AdminTopBarSection from "../components/AdminTopBarSection";

export default function AdminDashboard() {
    return (
        <div className="admin-page">
        <section id="admin-overview" className="admin-scroll-section">
            <div className="admin-header">
            <p className="admin-eyebrow">Admin Panel</p>
            <h1 className="admin-title">Store Dashboard</h1>
            <p className="admin-subtitle">
                Manage products, categories, and store updates from one place.
            </p>
            </div>

            <div className="admin-card">
            <div className="admin-card-header">
                <h2 className="admin-card-title">Quick Actions</h2>
                <div className="admin-card-actions">
                <a href="#admin-products" className="admin-primary-link">
                    Go to Products
                </a>
                <a href="#admin-categories" className="admin-primary-link">
                    Go to Categories
                </a>
                <Link to="/admin/products/new" className="admin-primary-link">
                    Add Product
                </Link>
                </div>
            </div>
            </div>


            <div className="admin-stats-grid">
            <div className="admin-stat-card">
                <span className="admin-stat-label">Products</span>
                <h2 className="admin-stat-value">Live</h2>
                <p className="admin-stat-text">Manage your full product catalog below.</p>
            </div>

            <div className="admin-stat-card">
                <span className="admin-stat-label">Categories</span>
                <h2 className="admin-stat-value">Live</h2>
                <p className="admin-stat-text">Organize products with clean category structure.</p>
            </div>

            <div className="admin-stat-card">
                <span className="admin-stat-label">Orders</span>
                <h2 className="admin-stat-value">Soon</h2>
                <p className="admin-stat-text">Order management can be added next.</p>
            </div>
            </div>


        </section>
        <AdminTopBarSection />
        <AdminBannerSection />
        <AdminProductsSection />
        <AdminCategoriesSection />
        </div>
    );
    }