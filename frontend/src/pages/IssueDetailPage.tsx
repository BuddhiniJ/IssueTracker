import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PriorityBadge, SeverityBadge, StatusBadge } from "../components/Badges";
import { ConfirmModal } from "../components/ConfirmModal";
import { useAuthStore } from "../store/authStore";
import { useIssueStore } from "../store/issueStore";

export const IssueDetailPage = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const { user } = useAuthStore();
  const { currentIssue, fetchIssue, updateIssue, deleteIssue, resetCurrentIssue, loading, error } = useIssueStore();
  const [confirmAction, setConfirmAction] = useState<"progress" | "resolve" | "close" | "delete" | null>(null);
  const [adminRemark, setAdminRemark] = useState("");
  const [remarkError, setRemarkError] = useState("");

  useEffect(() => {
    void fetchIssue(id);
    return () => resetCurrentIssue();
  }, [id, fetchIssue, resetCurrentIssue]);

  const isOwner = useMemo(() => {
    if (!currentIssue || !user) {
      return false;
    }
    const createdBy = currentIssue.createdBy;
    const ownerId = typeof createdBy === "string" ? createdBy : createdBy._id;
    return ownerId === user._id;
  }, [currentIssue, user]);

  if (loading && !currentIssue) {
    return <p className="text-sm text-[#5B6783]">Loading issue...</p>;
  }

  if (!currentIssue) {
    return <p className="text-sm text-[#3A3566]">{error || "Issue not found"}</p>;
  }

  const runAction = async () => {
    if (!confirmAction) {
      return;
    }

    if (confirmAction === "delete") {
      await deleteIssue(currentIssue._id);
      navigate("/issues");
      return;
    }

    const trimmedRemark = adminRemark.trim();
    if (confirmAction === "close" && !trimmedRemark) {
      setRemarkError("Remark is required when closing an issue.");
      return;
    }

    await updateIssue(currentIssue._id, {
      status:
        confirmAction === "progress"
          ? "in_progress"
          : confirmAction === "resolve"
            ? "resolved"
            : "closed",
      remark: confirmAction === "resolve" || confirmAction === "close" ? trimmedRemark : undefined,
    });
    setAdminRemark("");
    setRemarkError("");
    setConfirmAction(null);
    await fetchIssue(currentIssue._id);
  };

  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-[#C4D9FF] bg-[#E8F9FF]/80 p-5 shadow-sm">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm font-medium text-[#42506A] transition hover:bg-[#E8F9FF]"
      >
        Go Back
      </button>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#5B6783]">Issue #{currentIssue.issueNumber}</p>
          <h1 className="mt-1 text-3xl font-bold text-[#26324A]">{currentIssue.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={currentIssue.status} />
            <PriorityBadge priority={currentIssue.priority} />
            <SeverityBadge severity={currentIssue.severity} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(isOwner && currentIssue.status === "open") ? (
            <Link
              to={`/issues/${currentIssue._id}/edit`}
              className="rounded-xl border border-[#e7db8f] bg-[#e7db8f] px-3 py-2 text-sm text-[#783e00]"
            >
              Edit
            </Link>
          ) : null}

          {user?.role === "admin" ? (
            <>
              {currentIssue.status === "open" ? (
                <button
                  onClick={() => {
                    setConfirmAction("progress");
                    setAdminRemark("");
                    setRemarkError("");
                  }}
                  className="rounded-xl bg-[#C4D9FF] px-3 py-2 text-sm font-semibold text-[#26324A]"
                >
                  Start Progress
                </button>
              ) : null}
              {currentIssue.status === "in_progress" ? (
                <>
                  <button
                    onClick={() => {
                      setConfirmAction("resolve");
                      setRemarkError("");
                    }}
                    className="rounded-xl bg-[#91e78f] px-3 py-2 text-sm font-semibold text-[#007808]"
                  >
                    Mark Resolved
                  </button>

                  <button
                    onClick={() => {
                      setConfirmAction("close");
                      setRemarkError("");
                    }}
                    className="rounded-xl bg-[#e78f8f] px-3 py-2 text-sm font-semibold text-[#780000]"
                  >
                    Close
                  </button>
                </>
              ) : null}
            </>
          ) : null}

          {(isOwner && currentIssue.status === "open") ? (
            <button
              onClick={() => setConfirmAction("delete")}
              className="rounded-xl bg-[#e78f8f] px-3 py-2 text-sm font-semibold text-[#780000]"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-[#FBFBFB] p-4">
          <p className="mb-2 text-xs uppercase tracking-widest text-[#5B6783]">Description</p>
          <p className="whitespace-pre-wrap text-sm text-[#42506A]">{currentIssue.description || "No description"}</p>
        </div>
        <div className="rounded-xl bg-[#FBFBFB] p-4 text-sm text-[#42506A]">
          <p><span className="font-semibold">Type:</span> <span className="capitalize">{currentIssue.issueType}</span></p>
          <p><span className="font-semibold">Created:</span> {new Date(currentIssue.createdAt).toLocaleString()}</p>
          <p><span className="font-semibold">Updated:</span> {new Date(currentIssue.updatedAt).toLocaleString()}</p>
          <p><span className="font-semibold">Due:</span> {currentIssue.dueDate ? new Date(currentIssue.dueDate).toLocaleDateString() : "-"}</p>
          <p><span className="font-semibold">Tags:</span> {currentIssue.tags.length ? currentIssue.tags.join(", ") : "-"}</p>
        </div>
      </div>

      <ConfirmModal
        open={Boolean(confirmAction)}
        title={confirmAction === "delete" ? "Delete issue" : "Change issue status"}
        message={
          confirmAction === "delete"
            ? "This issue will be permanently removed. Continue?"
            : `Are you sure you want to mark this issue as ${confirmAction === "progress"
              ? "In Progress"
              : confirmAction === "resolve"
                ? "Resolved"
                : "Closed"
            }?`
        }
        confirmText={confirmAction === "delete" ? "Delete" : "Confirm"}
        onCancel={() => {
          setConfirmAction(null);
          setRemarkError("");
        }}
        onConfirm={runAction}
      >
        {confirmAction === "resolve" || confirmAction === "close" ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-[#42506A]">
              Admin remark {confirmAction === "close" ? "(required)" : "(optional)"}
            </label>
            <textarea
              value={adminRemark}
              onChange={(event) => {
                setAdminRemark(event.target.value);
                if (remarkError) {
                  setRemarkError("");
                }
              }}
              rows={3}
              className="w-full rounded-lg border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm text-[#26324A] outline-none ring-[#8CA9FF] transition focus:ring"
              placeholder={
                confirmAction === "close"
                  ? "Provide a reason for closing this issue"
                  : "Optional note for resolution"
              }
            />
            {remarkError ? <p className="mt-2 text-xs text-[#3A3566]">{remarkError}</p> : null}
          </div>
        ) : null}
      </ConfirmModal>

      {currentIssue.resolutionRemark ? (
        <div className="mt-4 rounded-xl bg-[#FBFBFB] p-4 text-sm text-[#2C4573]">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#2C4573]">Resolution Remark</p>
          <p className="mt-2 whitespace-pre-wrap">{currentIssue.resolutionRemark}</p>
        </div>
      ) : null}

      {currentIssue.closureRemark ? (
        <div className="mt-4 rounded-xl bg-[#FBFBFB] p-4 text-sm text-[#3A3566]">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3A3566]">Closure Remark</p>
          <p className="mt-2 whitespace-pre-wrap">{currentIssue.closureRemark}</p>
        </div>
      ) : null}
    </section>
  );
};
