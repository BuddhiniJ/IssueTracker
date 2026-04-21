import { create } from "zustand";
import { issueApi } from "../services/api";
import type {
  Issue,
  IssuePayload,
  IssueQuery,
  IssueStatusCounts,
  IssuePagination,
} from "../types/issue";

const defaultPagination: IssuePagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

const defaultStatusCounts: IssueStatusCounts = {
  open: 0,
  in_progress: 0,
  resolved: 0,
  closed: 0,
};

export const defaultIssueQuery: IssueQuery = {
  page: 1,
  limit: 10,
  search: "",
  status: "",
  issueType: "",
  priority: "",
  severity: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

type IssueState = {
  issues: Issue[];
  currentIssue: Issue | null;
  query: IssueQuery;
  pagination: IssuePagination;
  statusCounts: IssueStatusCounts;
  loading: boolean;
  error: string | null;
  setQuery: (query: Partial<IssueQuery>) => void;
  fetchIssues: () => Promise<void>;
  fetchIssue: (id: string) => Promise<void>;
  createIssue: (payload: IssuePayload) => Promise<Issue>;
  updateIssue: (id: string, payload: Partial<IssuePayload>) => Promise<Issue>;
  deleteIssue: (id: string) => Promise<void>;
  resetCurrentIssue: () => void;
};

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: [],
  currentIssue: null,
  query: defaultIssueQuery,
  pagination: defaultPagination,
  statusCounts: defaultStatusCounts,
  loading: false,
  error: null,

  setQuery: (query) => {
    set((state) => ({ query: { ...state.query, ...query } }));
  },

  fetchIssues: async () => {
    set({ loading: true, error: null });
    try {
      const data = await issueApi.list(get().query);
      set({
        issues: data.issues,
        pagination: data.pagination,
        statusCounts: data.statusCounts,
        loading: false,
      });
    } catch (error: any) {
      const message = error?.response?.data?.error || "Failed to fetch issues";
      set({ error: message, loading: false });
    }
  },

  fetchIssue: async (id) => {
    set({ loading: true, error: null });
    try {
      const issue = await issueApi.getById(id);
      set({ currentIssue: issue, loading: false });
    } catch (error: any) {
      const message = error?.response?.data?.error || "Failed to fetch issue";
      set({ error: message, loading: false });
    }
  },

  createIssue: async (payload) => {
    const issue = await issueApi.create(payload);
    await get().fetchIssues();
    return issue;
  },

  updateIssue: async (id, payload) => {
    const issue = await issueApi.update(id, payload);
    set({ currentIssue: issue });
    await get().fetchIssues();
    return issue;
  },

  deleteIssue: async (id) => {
    await issueApi.remove(id);
    await get().fetchIssues();
  },

  resetCurrentIssue: () => set({ currentIssue: null }),
}));
