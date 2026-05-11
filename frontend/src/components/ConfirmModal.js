export default function ConfirmModal({ open, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="modal-overlay">
        <div className="modal-card">
            <h2 className="modal-title">Delete Product</h2>
            <p className="modal-text">
            Are you sure you want to delete this product?
            </p>

            <div className="modal-actions">
            <button className="modal-cancel" onClick={onCancel}>
                Cancel
            </button>

            <button className="modal-confirm" onClick={onConfirm}>
                Delete
            </button>
            </div>
        </div>
        </div>
    );
    }