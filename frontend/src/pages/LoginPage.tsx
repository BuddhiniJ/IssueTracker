import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertBanner } from "../components/AlertBanner";
import { useAuthStore } from "../store/authStore";
import loginImage from "../assets/login.jpg";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await login({ email, password });
      const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(destination || "/issues", { replace: true });
    } catch {
      // handled in store
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-4xl border border-[#C4D9FF] bg-[#FBFBFB] shadow-[0_24px_80px_-36px_rgba(38,50,74,0.45)] lg:grid-cols-[0.92fr_1.08fr]">
        <section className="flex items-center bg-[#E8F9FF]/80 p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-4xl font-bold leading-tight text-[#26324A] sm:text-[2.6rem]">Hello, Welcome Back</h1>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {error ? <AlertBanner variant="error">{error}</AlertBanner> : null}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#42506A]">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2.5 text-sm text-[#26324A] outline-none transition focus:border-[#8CA9FF] focus:ring-4 focus:ring-[#8CA9FF]/40"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#42506A]">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2.5 text-sm text-[#26324A] outline-none transition focus:border-[#8CA9FF] focus:ring-4 focus:ring-[#8CA9FF]/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-[#8168fa] px-4 py-2.5 text-sm font-semibold text-[#26324A] shadow-[0_10px_20px_-10px_rgba(58,53,102,0.5)] transition hover:bg-[#B6AAFF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-sm text-[#5B6783]">
              Don't have an account?{" "}
              <Link className="font-semibold text-[#3A3566] transition hover:text-[#26324A]" to="/register">
                Sign Up
              </Link>
            </p>
          </div>
        </section>

        <section className="hidden min-h-155 bg-[#C4D9FF]/45 p-6 lg:block lg:p-8">
          <div className="flex h-full flex-col rounded-3xl border border-[#8CA9FF]/55 bg-[#FBFBFB]/70 p-5">
            <img
              src={loginImage}
              alt="Login illustration placeholder"
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
        </section>
      </div>
    </div>
  );
};
