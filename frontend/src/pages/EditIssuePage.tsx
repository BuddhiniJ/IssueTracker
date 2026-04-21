import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertBanner } from "../components/AlertBanner";
import { IssueForm } from "../components/IssueForm";
import { useAuthStore } from "../store/authStore";
import { useIssueStore } from "../store/issueStore";
import type { IssuePayload } from "../types/issue";

export const EditIssuePage = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const { user } = useAuthStore();
  const { currentIssue, fetchIssue, updateIssue, resetCurrentIssue, loading, error } = useIssueStore();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void fetchIssue(id);
    return () => resetCurrentIssue();
  }, [id, fetchIssue, resetCurrentIssue]);

  const canEdit = useMemo(() => {
    if (!currentIssue || !user) {
      return false;
    }
    const ownerId = typeof currentIssue.createdBy === "string" ? currentIssue.createdBy : currentIssue.createdBy._id;
    const isOwner = ownerId === user._id;
    return isOwner && currentIssue.status === "open";
  }, [currentIssue, user]);

  const handleSubmit = async (payload: IssuePayload) => {
    setSubmitting(true);
    try {
      await updateIssue(id, payload);
      navigate(`/issues/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !currentIssue) {
    return <p className="text-sm text-[#5B6783]">Loading issue...</p>;
  }

  if (!currentIssue) {
    return <p className="text-sm text-[#3A3566]">{error || "Issue not found"}</p>;
  }

  if (!canEdit) {
    return (
      <AlertBanner variant="warning">
        You do not have permission to edit this issue in its current state.
      </AlertBanner>
    );
  }

  return (
    <section className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-3 rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm font-medium text-[#42506A] transition hover:bg-[#E8F9FF]"
      >
        Go Back
      </button>
      <h1 className="mb-4 text-3xl font-bold text-[#26324A]">Edit Issue</h1>
      <IssueForm initialValues={currentIssue} onSubmit={handleSubmit} submitting={submitting} />
    </section>
  );
};
