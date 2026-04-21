import type { IssuePriority, IssueQuery, IssueSeverity, IssueStatus, IssueType } from "../types/issue";

type IssueFiltersProps = {
  search: string;
  query: IssueQuery;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: keyof IssueQuery, value: string) => void;
  onExport: (format: "csv" | "json") => void;
};

export const IssueFilters = ({
  search,
  query,
  onSearchChange,
  onFilterChange,
  onExport,
}: IssueFiltersProps) => {
  return (
    <div className="rounded-2xl border border-[#C4D9FF] bg-[#E8F9FF]/80 p-4 shadow-sm backdrop-blur">
      <div className="grid gap-3 md:grid-cols-6">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or description"
          className="md:col-span-2 rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm text-[#26324A] outline-none ring-[#8CA9FF] transition focus:ring"
        />

        <select
          value={query.status}
          onChange={(e) => onFilterChange("status", e.target.value as "" | IssueStatus)}
          className="rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm text-[#26324A]"
        >
          <option value="">All status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={query.issueType}
          onChange={(e) => onFilterChange("issueType", e.target.value as "" | IssueType)}
          className="rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm text-[#26324A]"
        >
          <option value="">All types</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="improvement">Improvement</option>
          <option value="task">Task</option>
        </select>

        <select
          value={query.priority}
          onChange={(e) => onFilterChange("priority", e.target.value as "" | IssuePriority)}
          className="rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm text-[#26324A]"
        >
          <option value="">All priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={query.severity}
          onChange={(e) => onFilterChange("severity", e.target.value as "" | IssueSeverity)}
          className="rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-2 text-sm text-[#26324A]"
        >
          <option value="">All severity</option>
          <option value="minor">Minor</option>
          <option value="moderate">Moderate</option>
          <option value="major">Major</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => onExport("csv")}
          className="rounded-lg border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-1.5 text-xs font-semibold text-[#42506A]"
        >
          Export CSV
        </button>
        <button
          onClick={() => onExport("json")}
          className="rounded-lg border border-[#C4D9FF] bg-[#FBFBFB] px-3 py-1.5 text-xs font-semibold text-[#42506A]"
        >
          Export JSON
        </button>
      </div>
    </div>
  );
};
