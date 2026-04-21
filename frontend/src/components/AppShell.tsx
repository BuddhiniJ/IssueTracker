import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const AppShell = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6">
      <header className="mb-6 rounded-3xl border border-[#C4D9FF] bg-[#E8F9FF]/90 p-4 backdrop-blur md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link to="/issues" className="inline-flex flex-col items-start gap-1">
            <span className="rounded-xl bg-[#0c2264] px-3 py-1 text-xl font-semibold uppercase tracking-wide text-[#ffffff]">
              Issue Tracker
            </span>
            <span className="font-semibold text-[#42506A]"> &nbsp; Simple. Fast. Clear.</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <p className="font-medium text-[#26324A]">{user?.name}</p>
              <p className="text-[#5B6783]">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-[#e78f8f] bg-[#dea4a4] px-3 py-2 text-sm font-medium text-[#6a4242] transition hover:bg-[#E8F9FF]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};
