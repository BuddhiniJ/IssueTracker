import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Issue, IssuePayload, IssuePriority, IssueSeverity, IssueStatus, IssueType } from "../types/issue";
import { AlertBanner } from "./AlertBanner";
import { useAuthStore } from "../store/authStore";

type IssueFormProps = {
  initialValues?: Issue | null;
  onSubmit: (payload: IssuePayload) => Promise<void>;
  submitting: boolean;
};

const splitTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export const IssueForm = ({ initialValues, onSubmit, submitting }: IssueFormProps) => {
  const { user } = useAuthStore();
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [issueType, setIssueType] = useState<IssueType>(initialValues?.issueType || "bug");
  const [priority, setPriority] = useState<IssuePriority>(initialValues?.priority || "medium");
  const [severity, setSeverity] = useState<IssueSeverity>(initialValues?.severity || "moderate");
  const [status, setStatus] = useState<IssueStatus>(initialValues?.status || "open");
  const [tags, setTags] = useState(initialValues?.tags.join(", ") || "");
  const [dueDate, setDueDate] = useState(initialValues?.dueDate?.slice(0, 10) || "");
  const [error, setError] = useState<string | null>(null);

  const canEditStatus = useMemo(() => user?.role === "admin", [user?.role]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        issueType,
        priority,
        severity,
        status: canEditStatus ? status : undefined,
        tags: splitTags(tags),
        dueDate: dueDate || null,
      });
    } catch (submitError: any) {
      setError(submitError?.message || "Failed to save issue");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#C4D9FF] bg-[#E8F9FF]/80 p-5 shadow-sm">
      {error ? <AlertBanner variant="error">{error}</AlertBanner> : null}

      <div>
        <label className="mb-1 block text-sm font-medium text-[#42506A]">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm text-[#26324A] outline-none ring-[#8CA9FF] transition focus:ring"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#42506A]">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm text-[#26324A] outline-none ring-[#8CA9FF] transition focus:ring"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[#42506A]">Type</label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value as IssueType)}
            className="w-full rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm text-[#26324A]"
          >
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="improvement">Improvement</option>
            <option value="task">Task</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[#42506A]">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as IssuePriority)}
            className="w-full rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm text-[#26324A]"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[#42506A]">Severity</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as IssueSeverity)}
            className="w-full rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm text-[#26324A]"
          >
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="major">Major</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[#42506A]">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm text-[#26324A]"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[#42506A]">Status</label>
          <select
            value={status}
            disabled={!canEditStatus}
            onChange={(e) => setStatus(e.target.value as IssueStatus)}
            className="w-full rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm text-[#26324A] disabled:cursor-not-allowed disabled:bg-[#E8F9FF]"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#42506A]">Tags (comma separated)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="ui, performance, api"
          className="w-full rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm text-[#26324A]"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-[#8CA9FF] px-5 py-2.5 text-sm font-semibold text-[#26324A] transition hover:bg-[#B5A5FF] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Save Issue"}
      </button>
    </form>
  );
};
