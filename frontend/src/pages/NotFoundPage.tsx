import { Link } from "react-router-dom";
import notFoundImage from "../assets/notFound.jpg";

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-4xl border border-[#C4D9FF] bg-[#FBFBFB] shadow-[0_24px_80px_-36px_rgba(38,50,74,0.45)] lg:grid-cols-[0.92fr_1.08fr]">
        <section className="flex items-center bg-[#E8F9FF]/80 p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#3A3566]">Lost Route</p>
            <h1 className="text-5xl font-bold text-[#26324A]">404</h1>
            <p className="mt-3 text-[#5B6783]">Page not found.</p>
            <Link to="/issues" className="mt-6 inline-block rounded-xl bg-[#8CA9FF] px-4 py-2 text-sm font-semibold text-[#26324A] transition hover:bg-[#B6AAFF]">
              Go to Issues
            </Link>
          </div>
        </section>

        <section className="hidden min-h-155 bg-[#C4D9FF]/45 p-6 lg:block lg:p-8">
          <div className="flex h-full flex-col rounded-3xl border border-[#8CA9FF]/55 bg-[#FBFBFB]/70 p-5">
            <img
              src={notFoundImage}
              alt="Not found illustration placeholder"
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
        </section>

      </div>
    </div>
  );
};
