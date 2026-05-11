import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const { user, isAuthenticated, logout, authLoading } = useAuth();

  if (authLoading) {
    return <div className="account-page">Loading account...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="account-page">
      <div className="account-header">
        <p className="account-eyebrow">My Account</p>
        <h1 className="account-title">Welcome, {user?.first_name || "User"}</h1>
        <p className="account-subtitle">
          Manage your profile, review orders, and continue shopping.
        </p>
      </div>

      <div className="account-layout">
        <aside className="account-sidebar">
          <button className="account-sidebar-item active">Profile</button>
          <button className="account-sidebar-item">Orders</button>
          <button className="account-sidebar-item">Addresses</button>
          <button className="account-sidebar-item">Settings</button>
          <button className="account-sidebar-item logout" onClick={logout}>
            Logout
          </button>
        </aside>

        <section className="account-content">
          <div className="account-card">
            <h2 className="account-card-title">Profile Information</h2>

            <div className="account-info-grid">
              <div className="account-info-item">
                <span className="account-label">First Name</span>
                <p>{user?.first_name || "-"}</p>
              </div>

              <div className="account-info-item">
                <span className="account-label">Last Name</span>
                <p>{user?.last_name || "-"}</p>
              </div>

              <div className="account-info-item full">
                <span className="account-label">Email</span>
                <p>{user?.email || "-"}</p>
              </div>
            </div>
          </div>

          <div className="account-card">
            <div className="account-card-header">
              <h2 className="account-card-title">Quick Links</h2>
              <Link to="/shop" className="account-shop-link">
                Shop More
              </Link>
            </div>

            <div className="account-orders-list">
              <div className="account-order-row">
                <div>
                  <span className="account-label">Account Type</span>
                  <p>
                    {user?.is_staff || user?.is_superuser ? "Admin" : "Customer"}
                  </p>
                </div>

                <div>
                  <span className="account-label">Email Verified</span>
                  <p>Not implemented yet</p>
                </div>

                <div>
                  <span className="account-label">Orders</span>
                  <p>Coming soon</p>
                </div>

                <div>
                  <span className="account-label">Checkout</span>
                  <p>Ready to connect</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}