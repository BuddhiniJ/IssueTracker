import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Issue } from "../types/issue";
import { PriorityBadge, SeverityBadge, StatusBadge } from "./Badges";

type IssueTableProps = {
  issues: Issue[];
};

type SortKey = "issueNumber" | "title" | "issueType" | "status" | "priority" | "severity" | "author" | "updatedAt";

type SortDirection = "asc" | "desc";

type SortConfig = {
  key: SortKey;
  direction: SortDirection;
};

const statusOrder: Record<Issue["status"], number> = {
  open: 0,
  in_progress: 1,
  resolved: 2,
  closed: 3,
};

const priorityOrder: Record<Issue["priority"], number> = {
  low: 0,
  medium: 1,
  high: 2,
};

const severityOrder: Record<Issue["severity"], number> = {
  minor: 0,
  moderate: 1,
  major: 2,
  critical: 3,
};

const creatorName = (createdBy: Issue["createdBy"]) =>
  typeof createdBy === "string" ? "You" : createdBy.name;

export const IssueTable = ({ issues }: IssueTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedIssues = useMemo(() => {
    if (!sortConfig) {
      return issues;
    }

    const compareValues = (leftIssue: Issue, rightIssue: Issue) => {
      switch (sortConfig.key) {
        case "issueNumber":
          return leftIssue.issueNumber - rightIssue.issueNumber;
        case "title":
          return leftIssue.title.localeCompare(rightIssue.title);
        case "status":
          return statusOrder[leftIssue.status] - statusOrder[rightIssue.status];
        case "issueType":
          return leftIssue.issueType.localeCompare(rightIssue.issueType);
        case "priority":
          return priorityOrder[leftIssue.priority] - priorityOrder[rightIssue.priority];
        case "severity":
          return severityOrder[leftIssue.severity] - severityOrder[rightIssue.severity];
        case "author":
          return creatorName(leftIssue.createdBy).localeCompare(creatorName(rightIssue.createdBy));
        case "updatedAt":
          return new Date(leftIssue.updatedAt).getTime() - new Date(rightIssue.updatedAt).getTime();
        default:
          return 0;
      }
    };

    const directionMultiplier = sortConfig.direction === "asc" ? 1 : -1;

    return [...issues].sort((leftIssue, rightIssue) => compareValues(leftIssue, rightIssue) * directionMultiplier);
  }, [issues, sortConfig]);

  const toggleSort = (key: SortKey) => {
    setSortConfig((currentSort) => {
      if (currentSort?.key === key) {
        return {
          key,
          direction: currentSort.direction === "asc" ? "desc" : "asc",
        };
      }

      return { key, direction: "asc" };
    });
  };

  const sortLabel = (key: SortKey, label: string) => {
    const isActive = sortConfig?.key === key;

    return (
      <button
        type="button"
        onClick={() => toggleSort(key)}
        className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wide transition-colors ${
          isActive ? "text-[#26324A]" : "text-[#5B6783] hover:text-[#26324A]"
        }`}
        aria-label={`Sort by ${label}`}
        aria-pressed={isActive}
      >
        <span>{label}</span>
        <span className="text-[0.65rem] leading-none">{isActive ? (sortConfig?.direction === "asc" ? "▲" : "▼") : "↕"}</span>
      </button>
    );
  };

  if (!issues.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#C4D9FF] bg-[#FBFBFB] p-8 text-center text-[#5B6783]">
        No issues found for this filter.
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-[#C4D9FF] bg-[#E8F9FF]/70 shadow-sm backdrop-blur">
      <div className="overflow-x-auto">
        <table className="w-full min-w-195 text-left text-sm">
          <thead className="bg-[#C4D9FF]/45 text-xs uppercase tracking-wide text-[#5B6783]">
            <tr>
              <th className="px-4 py-3">{sortLabel("issueNumber", "ID")}</th>
              <th className="px-4 py-3">{sortLabel("title", "Title")}</th>
              <th className="px-4 py-3">{sortLabel("issueType", "Type")}</th>
              <th className="px-4 py-3">{sortLabel("status", "Status")}</th>
              <th className="px-4 py-3">{sortLabel("priority", "Priority")}</th>
              <th className="px-4 py-3">{sortLabel("severity", "Severity")}</th>
              <th className="px-4 py-3">{sortLabel("author", "Author")}</th>
              <th className="px-4 py-3">{sortLabel("updatedAt", "Updated")}</th>
              <th className="px-4 py-3">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {sortedIssues.map((issue) => (
              <tr key={issue._id} className="border-t border-[#C4D9FF]/60 text-[#42506A]">
                <td className="px-4 py-3 font-semibold">#{issue.issueNumber}</td>
                <td className="px-4 py-3">
                  <Link to={`/issues/${issue._id}`} className="font-medium text-[#26324A] hover:text-[#3A3566]">
                    {issue.title}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize">{issue.issueType}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={issue.status} /> <br/>
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={issue.priority} />
                </td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={issue.severity} />
                </td>
                <td className="px-4 py-3">{creatorName(issue.createdBy)}</td>
                <td className="px-4 py-3">{new Date(issue.updatedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Link to={`/issues/${issue._id}`} className="inline-block px-3 py-1.5 rounded-lg bg-[#8894b7] text-[#FBFBFB] font-medium hover:bg-[#B5A8E8] transition-colors">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
