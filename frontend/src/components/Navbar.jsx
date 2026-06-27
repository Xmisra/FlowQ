import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
const Navbar = ({ title = "FlowQ", subtitle }) => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  async function handleLogout() {
    try {

      await api.post("/admin/logout");

      setUser(null);

      navigate("/login",{ replace: true });

    } catch (err) {

      toast.error(err.response?.data?.error || "Logout failed");

    }
  }
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-sm">
            FQ
          </div>

          <div>
            <p className="text-base font-semibold text-slate-950">{title}</p>
            {subtitle && (
              <p className="text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Logout
        </button>

      </div>
    </header>
  );
};

export default Navbar;
