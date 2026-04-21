import type { IssuePriority, IssueSeverity, IssueStatus } from "../types/issue";
import { priorityLabel, severityLabel, statusLabel } from "../utils/issueMeta";

const statusClass: Record<IssueStatus, string> = {
  open: "bg-[#8fa4e7] text-[#001e78]",
  in_progress: "bg-[#e7db8f] text-[#783e00]",
  resolved: "bg-[#91e78f] text-[#007808]",
  closed: "bg-[#cacaca] text-[#252525]",
};

const priorityClass: Record<IssuePriority, string> = {
  low: "bg-[#91e78f] text-[#007808]",
  medium: "bg-[#e7db8f] text-[#783e00]",
  high: "bg-[#e78f8f] text-[#780000]",
};

const severityClass: Record<IssueSeverity, string> = {
  minor: "bg-[#91e78f] text-[#007808]",
  moderate: "bg-[#e7e58f] text-[#9b5414]",
  major: "bg-[#e7b48f] text-[#8e2900]",
  critical: "bg-[#e78f8f] text-[#780000]",
};

const baseClass = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold";

export const StatusBadge = ({ status }: { status: IssueStatus }) => (
  <span className={`${baseClass} ${statusClass[status]}`}>{statusLabel[status]}</span>
);

export const PriorityBadge = ({ priority }: { priority: IssuePriority }) => (
  <span className={`${baseClass} ${priorityClass[priority]}`}>{priorityLabel[priority]}</span>
);

export const SeverityBadge = ({ severity }: { severity: IssueSeverity }) => (
  <span className={`${baseClass} ${severityClass[severity]}`}>{severityLabel[severity]}</span>
);
