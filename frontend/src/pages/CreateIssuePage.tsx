import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IssueForm } from "../components/IssueForm";
import { useIssueStore } from "../store/issueStore";
import type { IssuePayload } from "../types/issue";

export const CreateIssuePage = () => {
  const navigate = useNavigate();
  const createIssue = useIssueStore((state) => state.createIssue);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload: IssuePayload) => {
    setSubmitting(true);
    try {
      const issue = await createIssue(payload);
      navigate(`/issues/${issue._id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-3 rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm font-medium text-[#42506A] transition hover:bg-[#E8F9FF]"
      >
        Go Back
      </button>
      <h1 className="mb-4 text-3xl font-bold text-[#26324A]">Create New Issue</h1>
      <IssueForm onSubmit={handleSubmit} submitting={submitting} />
    </section>
  );
};
