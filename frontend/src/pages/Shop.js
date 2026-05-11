import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import client from "../api/client";
import { useCart } from "../context/CartContext";

const getCategoryName = (product) => {
  const rawCategory = product.category;

  if (!rawCategory) return "";

  if (typeof rawCategory === "string") return rawCategory.trim();

  if (typeof rawCategory === "object" && rawCategory.name) {
    return String(rawCategory.name).trim();
  }

  return String(rawCategory).trim();
};

const getProductCategoryId = (product) => {
  const rawCategory = product.category;

  if (!rawCategory) return "";

  if (typeof rawCategory === "object" && rawCategory.id) {
    return String(rawCategory.id);
  }

  return String(rawCategory);
};

const categoryImages = {
  Compound:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80",
  Recurve:
    "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=300&q=80",
  Arrows:
    "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=300&q=80",
  Targets:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
  Broadheads:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80",
  Accessories:
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=300&q=80",
};

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";

  const [selectedCategory, setSelectedCategory] = useState(
    urlCategory || "All"
  );
  const [sortOption, setSortOption] = useState("featured");
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState("All");

  const { addToCart } = useCart();

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `http://127.0.0.1:8000${image}`;
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await client.get("/products/");
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    setSelectedCategory(urlCategory || "All");
  }, [urlCategory]);

  const categories = useMemo(() => {
    const map = new Map();

    products.forEach((product) => {
      if (product.category && typeof product.category === "object") {
        map.set(product.category.id, product.category);
      }
    });

    return Array.from(map.values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    let updatedProducts = [...products];

    if (selectedCategory !== "All") {
      updatedProducts = updatedProducts.filter((product) => {
        return getProductCategoryId(product) === String(selectedCategory);
      });
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      updatedProducts = updatedProducts.filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const description = product.description?.toLowerCase() || "";
        const category = getCategoryName(product).toLowerCase();

        return (
          name.includes(term) ||
          description.includes(term) ||
          category.includes(term)
        );
      });
    }

    if (inStockOnly) {
      updatedProducts = updatedProducts.filter((product) => product.stock > 0);
    }

    if (priceRange === "under50") {
      updatedProducts = updatedProducts.filter(
        (product) => Number(product.price) < 50
      );
    } else if (priceRange === "50to200") {
      updatedProducts = updatedProducts.filter((product) => {
        const price = Number(product.price);
        return price >= 50 && price <= 200;
      });
    } else if (priceRange === "200plus") {
      updatedProducts = updatedProducts.filter(
        (product) => Number(product.price) > 200
      );
    }

    if (sortOption === "priceLowHigh") {
      updatedProducts.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOption === "priceHighLow") {
      updatedProducts.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortOption === "nameAZ") {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "nameZA") {
      updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      updatedProducts.sort((a, b) => b.id - a.id);
    }

    return updatedProducts;
  }, [products, selectedCategory, sortOption, searchTerm, inStockOnly, priceRange]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);

    if (selectedCategory !== "All") {
      nextParams.set("category", selectedCategory);
    } else {
      nextParams.delete("category");
    }

    if (searchTerm.trim()) {
      nextParams.set("search", searchTerm);
    } else {
      nextParams.delete("search");
    }

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams);
    }
  }, [selectedCategory, searchTerm]);

  const handleSidebarSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="shop-page">
        <p className="shop-message">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-page">
        <p className="shop-message shop-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <section className="shop-header">
        <p className="shop-eyebrow">Catalog</p>
        <h1 className="shop-title">Shop Archery Gear</h1>
        <p className="shop-subtitle">
          Browse bows, arrows, targets, and accessories.
        </p>
      </section>

      <section className="category-slider-section">
        <div className="category-slider">
          <button
            className={`category-slider-item ${
              selectedCategory === "All" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("All")}
          >
            <div className="category-slider-image category-slider-all">
              All
            </div>
            <span>All</span>
          </button>

          {categories.map((category) => {
            const image = categoryImages[category.name];

            return (
              <button
                key={category.id}
                className={`category-slider-item ${
                  selectedCategory === String(category.id) ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(String(category.id))}
              >
                {image ? (
                  <img
                    src={image}
                    alt={category.name}
                    className="category-slider-image"
                  />
                ) : (
                  <div className="category-slider-image category-slider-placeholder">
                    {category.name.charAt(0)}
                  </div>
                )}
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="shop-content">
        <aside className="shop-filters">
          <div className="filter-block">
            <h3>Search</h3>
            <input
              type="text"
              className="shop-filter-search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSidebarSearchChange}
            />
          </div>

          <div className="filter-block">
            <h3>Category</h3>
            <button
              className={`filter-pill ${
                selectedCategory === "All" ? "active" : ""
              }`}
              onClick={() => setSelectedCategory("All")}
            >
              All Products
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-pill ${
                  selectedCategory === String(category.id) ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(String(category.id))}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="filter-block">
            <h3>Availability</h3>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span>In stock only</span>
            </label>
          </div>

          <div className="filter-block">
            <h3>Price</h3>

            <label className="filter-radio">
              <input
                type="radio"
                name="price"
                checked={priceRange === "All"}
                onChange={() => setPriceRange("All")}
              />
              <span>All Prices</span>
            </label>

            <label className="filter-radio">
              <input
                type="radio"
                name="price"
                checked={priceRange === "under50"}
                onChange={() => setPriceRange("under50")}
              />
              <span>Under $50</span>
            </label>

            <label className="filter-radio">
              <input
                type="radio"
                name="price"
                checked={priceRange === "50to200"}
                onChange={() => setPriceRange("50to200")}
              />
              <span>$50 - $200</span>
            </label>

            <label className="filter-radio">
              <input
                type="radio"
                name="price"
                checked={priceRange === "200plus"}
                onChange={() => setPriceRange("200plus")}
              />
              <span>$200+</span>
            </label>
          </div>
        </aside>

        <div className="shop-products-area">
          <div className="shop-toolbar">
            <p className="shop-results-count">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
              {searchTerm.trim() ? ` for "${searchTerm}"` : ""}
            </p>

            <div className="shop-sort">
              <label htmlFor="sort">Sort by</label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Newest</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="nameAZ">Name: A to Z</option>
                <option value="nameZA">Name: Z to A</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="shop-message">No products found.</p>
          ) : (
            <div className="shop-product-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="shop-product-card">
                  <div className="shop-product-image-wrap">
                    {product.image ? (
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="shop-product-image"
                      />
                    ) : (
                      <div className="shop-product-image-placeholder">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="shop-product-info">
                    <p className="shop-product-category">
                      {getCategoryName(product) || "Uncategorized"}
                    </p>

                    <h3 className="shop-product-name">{product.name}</h3>

                    <p className="shop-product-description">
                      {product.description || "No description available."}
                    </p>

                    <p className="shop-product-price">
                      ${Number(product.price).toFixed(2)}
                    </p>

                    <p className="shop-product-stock">
                      {product.stock > 0
                        ? `In stock: ${product.stock}`
                        : "Out of stock"}
                    </p>

                    <div className="shop-product-actions">
                      <button
                        className="shop-product-button"
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                      >
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </button>

                      <Link
                        to={`/products/${product.id}`}
                        className="shop-product-secondary-button"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}