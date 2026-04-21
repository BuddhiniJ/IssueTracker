import type { ReactNode } from "react";

type AlertVariant = "error" | "warning" | "info" | "success";

type AlertBannerProps = {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
};

const variantClass: Record<AlertVariant, string> = {
  error: "bg-[#F8D4D4]/70 text-[#903333] border-[#E9A2A2]",
  warning: "bg-[#8CA9FF]/45 text-[#3A3566] border-[#8CA9FF]",
  info: "bg-[#E8F9FF] text-[#2F4D7A] border-[#C4D9FF]",
  success: "bg-[#C4D9FF]/40 text-[#2C4573] border-[#C4D9FF]",
};

const iconClass: Record<AlertVariant, string> = {
  error: "text-[#903333]",
  warning: "text-[#3A3566]",
  info: "text-[#2F4D7A]",
  success: "text-[#2C4573]",
};

const iconPath: Record<AlertVariant, string> = {
  error: "M12 9v4m0 4h.01M10.29 3.86l-7.4 12.8A1 1 0 003.75 18h16.5a1 1 0 00.86-1.34l-7.4-12.8a1 1 0 00-1.72 0z",
  warning: "M12 8v4m0 4h.01M10.29 3.86l-7.4 12.8A1 1 0 003.75 18h16.5a1 1 0 00.86-1.34l-7.4-12.8a1 1 0 00-1.72 0z",
  info: "M12 8h.01M11 12h1v4h1m-1-13a9 9 0 100 18 9 9 0 000-18z",
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
};

export const AlertBanner = ({ variant = "info", children, className = "" }: AlertBannerProps) => {
  return (
    <div className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${variantClass[variant]} ${className}`.trim()}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`mt-0.5 h-4 w-4 shrink-0 ${iconClass[variant]}`}
        aria-hidden="true"
      >
        <path d={iconPath[variant]} />
      </svg>
      <p>{children}</p>
    </div>
  );
};
