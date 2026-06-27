import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft">
                    <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-2xl bg-slate-100" />
                    <p className="text-sm font-medium text-slate-500">Loading FlowQ...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    return children;
};

export default ProtectedRoute;
