import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const getCategoryName = (item) => {
  const rawCategory = item?.category;

  if (!rawCategory) return "";

  if (typeof rawCategory === "string") return rawCategory.trim();

  if (typeof rawCategory === "object" && rawCategory.name) {
    return String(rawCategory.name).trim();
  }

  return String(rawCategory).trim();
};

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <p className="cart-eyebrow">Your Cart</p>
          <h1 className="cart-title">Your cart is empty</h1>
          <p className="cart-empty-text">
            Looks like you have not added anything yet.
          </p>
          <Link to="/shop" className="cart-shop-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <p className="cart-eyebrow">Your Cart</p>
        <h1 className="cart-title">Shopping Cart</h1>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item-card">
              <div className="cart-item-image-wrap">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />
                ) : (
                  <div className="cart-item-image-placeholder">No Image</div>
                )}
              </div>

              <div className="cart-item-info">
                <p className="cart-item-category">
                  {getCategoryName(item) || "Uncategorized"}
                </p>
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-price">
                  ${Number(item.price).toFixed(2)}
                </p>

                <div className="cart-item-controls">
                  <div className="cart-qty-control">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="cart-remove-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="cart-item-total">
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </section>

        <aside className="cart-summary">
          <h2 className="cart-summary-title">Order Summary</h2>

          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <button className="cart-checkout-button">
            Proceed to Checkout
          </button>

          <button className="cart-clear-button" onClick={clearCart}>
            Clear Cart
          </button>

          <Link to="/shop" className="cart-continue-link">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}