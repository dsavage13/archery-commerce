import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { link } from "react-router-dom";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmed = searchTerm.trim();

    if (trimmed) {
      navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/shop");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Savage Archery
        </Link>

        <nav className="navbar-links">
          <Link to="/shop">Shop</Link>
        </nav>
      </div>

      <form className="navbar-search" onSubmit={handleSearch}>
        <button
          type="submit"
          className="search-submit"
          aria-label="Search"
        >
          <FiSearch />
        </button>

        <input
          type="text"
          className="search-input"
          placeholder="Search bows, arrows, targets, accessories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <div className="navbar-right">
        
        {isAuthenticated && (user?.is_staff || user?.is_superuser) && (
          <Link to="/admin" className="nav-link">
            Admin
          </Link>
        )}
        {isAuthenticated ? (
          <>
            <Link to="/account" className="nav-link">
              {user?.first_name || "Account"}
            </Link>

            <button className="nav-link logout-button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>


          </>
        )}
        
        <Link to="/cart" className="cart-button" aria-label="Cart">
            <FiShoppingCart />
            {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </Link>
      </div>
    </header>
  );
};

export default Navbar;