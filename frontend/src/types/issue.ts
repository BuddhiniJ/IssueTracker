export type IssueStatus = "open" | "in_progress" | "resolved" | "closed";
export type IssuePriority = "low" | "medium" | "high";
export type IssueSeverity = "minor" | "moderate" | "major" | "critical";
export type IssueType = "bug" | "feature" | "improvement" | "task";

export interface IssueUser {
    _id: string;
    name: string;
    email: string;
}

export interface Issue {
    _id: string;
    issueNumber: number;
    title: string;
    description: string;
    severity: IssueSeverity;
    priority: IssuePriority;
    issueType: IssueType;
    status: IssueStatus;
    createdBy: string | IssueUser;
    tags: string[];
    dueDate: string | null;
    resolvedAt: string | null;
    closedAt: string | null;
    resolutionRemark: string;
    closureRemark: string;
    createdAt: string;
    updatedAt: string;
}

export interface IssueQuery {
    page: number;
    limit: number;
    search: string;
    status: "" | IssueStatus;
    issueType: "" | IssueType;
    priority: "" | IssuePriority;
    severity: "" | IssueSeverity;
    sortBy: "createdAt" | "updatedAt" | "priority" | "status" | "issueType";
    sortOrder: "asc" | "desc";
}

export interface IssuePagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IssueStatusCounts {
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
}

export interface IssueListResponse {
    issues: Issue[];
    pagination: IssuePagination;
    statusCounts: IssueStatusCounts;
}

export interface IssuePayload {
    title: string;
    description?: string;
    issueType?: IssueType;
    priority?: IssuePriority;
    severity?: IssueSeverity;
    status?: IssueStatus;
    remark?: string;
    dueDate?: string | null;
    tags?: string[];
}