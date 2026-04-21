import axios from "axios";
import type {
    Issue,
    IssueListResponse,
    IssuePayload,
    IssueQuery,
} from "../types/issue";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "../types/auth";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("issue_tracker_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    register: async (payload: RegisterPayload) => {
        const { data } = await api.post<AuthResponse>("/auth/register", payload);
        return data;
    },
    login: async (payload: LoginPayload) => {
        const { data } = await api.post<AuthResponse>("/auth/login", payload);
        return data;
    },
    me: async () => {
        const { data } = await api.get<{ user: User }>("/auth/me");
        return data;
    },
};

const buildParams = (query: Partial<IssueQuery>) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
            params.set(key, String(value));
        }
    });
    return params;
};

export const issueApi = {
    list: async (query: Partial<IssueQuery>) => {
        const { data } = await api.get<IssueListResponse>(`/issues?${buildParams(query).toString()}`);
        return data;
    },
    getById: async (id: string) => {
        const { data } = await api.get<{ issue: Issue }>(`/issues/${id}`);
        return data.issue;
    },
    create: async (payload: IssuePayload) => {
        const { data } = await api.post<{ issue: Issue }>("/issues", payload);
        return data.issue;
    },
    update: async (id: string, payload: Partial<IssuePayload>) => {
        const { data } = await api.put<{ issue: Issue }>(`/issues/${id}`, payload);
        return data.issue;
    },
    remove: async (id: string) => {
        await api.delete(`/issues/${id}`);
    },
    exportList: async (format: "json" | "csv", query: Partial<IssueQuery>) => {
        const responseType = format === "json" ? "json" : "blob";
        const params = buildParams(query);
        params.set("format", format);
        const { data } = await api.get(`/issues/export?${params.toString()}`, { responseType });
        return data;
    },
};

export default api;