import type { ReactNode } from "react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  confirmDisabled?: boolean;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  confirmDisabled = false,
  children,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#26324A]/45 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#C4D9FF] bg-[#FBFBFB] p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-[#26324A]">{title}</h3>
        <p className="mt-2 text-sm text-[#4F5B75]">{message}</p>
        {children ? <div className="mt-4">{children}</div> : null}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-[#C4D9FF] px-4 py-2 text-sm text-[#42506A]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmDisabled}
            className="rounded-lg bg-[#8CA9FF] px-4 py-2 text-sm font-medium text-[#26324A] disabled:opacity-60"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
