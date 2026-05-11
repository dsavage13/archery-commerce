import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin, authLoading } = useAuth();

    if (authLoading) {
        return <p style={{ padding: "2rem" }}>Loading...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/account" replace />;
    }

    return children;
    }