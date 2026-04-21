import type { IssuePriority, IssueSeverity, IssueStatus } from "../types/issue";

export const statusLabel: Record<IssueStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export const priorityLabel: Record<IssuePriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const severityLabel: Record<IssueSeverity, string> = {
  minor: "Minor",
  moderate: "Moderate",
  major: "Major",
  critical: "Critical",
};
