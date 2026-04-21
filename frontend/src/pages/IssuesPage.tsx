import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertBanner } from "../components/AlertBanner";
import { useAuthStore } from "../store/authStore";
import { defaultIssueQuery, useIssueStore } from "../store/issueStore";
import { downloadBlob } from "../utils/download";
import { ConfirmModal } from "../components/ConfirmModal";
import { IssueFilters } from "../components/IssueFilters";
import { IssueTable } from "../components/IssueTable";
import { Pagination } from "../components/Pagination";

export const IssuesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    issues,
    query,
    pagination,
    statusCounts,
    loading,
    error,
    setQuery,
    fetchIssues,
    deleteIssue,
  } = useIssueStore();

  const [searchInput, setSearchInput] = useState(query.search);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    void fetchIssues();
  }, [query, fetchIssues]);

  // Debounce search input to limit API requests while typing.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery({ page: 1, search: searchInput.trim() });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, setQuery]);

  const cards = useMemo(
    () => [
      { label: "Open", value: statusCounts.open, color: "from-[#00279d] to-[#001e78]" },
      { label: "In Progress", value: statusCounts.in_progress, color: "from-[#784610] to-[#783e00]" },
      { label: "Resolved", value: statusCounts.resolved, color: "from-[#0a9714] to-[#007808]" },
      { label: "Closed", value: statusCounts.closed, color: "from-[#2c2c2c] to-[#252525]" },
    ],
    [statusCounts]
  );

  const csvEscape = (value: string | number | null | undefined) => {
    const text = value === null || value === undefined ? "" : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  };

  const handleExport = async (format: "csv" | "json") => {
    if (format === "csv") {
      const headers = ["Task #", "Title", "Description", "Status", "Priority", "Severity", "Created By", "Due Date", "Created At"];
      const rows = issues.map((issue) => {
        const createdBy = typeof issue.createdBy === "string" ? issue.createdBy : issue.createdBy.name;
        return [
          issue.issueNumber,
          issue.title,
          issue.description || "",
          issue.status,
          issue.priority,
          issue.severity,
          createdBy,
          issue.dueDate ? new Date(issue.dueDate).toISOString().split("T")[0] : "",
          new Date(issue.createdAt).toISOString(),
        ];
      });

      const csv = [headers.map(csvEscape).join(","), ...rows.map((row) => row.map(csvEscape).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      downloadBlob(blob, "issues.csv");
      return;
    }

    const blob = new Blob([JSON.stringify(issues, null, 2)], { type: "application/json" });
    downloadBlob(blob, "issues.json");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    await deleteIssue(deleteTarget);
    setDeleteTarget(null);
  };

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#26324A]">Issue Board</h1>
          <p className="text-sm text-[#5B6783]">Track, prioritize, and close work quickly.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setQuery(defaultIssueQuery);
              setSearchInput("");
            }}
            className="rounded-xl border border-[#C4D9FF] bg-[#FBFBFB] px-4 py-2 text-sm text-[#42506A]"
          >
            Reset
          </button>
          {user?.role !== "admin" ? (
            <button
              onClick={() => navigate("/issues/new")}
              className="rounded-xl bg-[#005500] px-4 py-2 text-sm font-semibold text-[#ffffff]"
            >
              Create Issue
            </button>
          ) : null}
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-[#C4D9FF] bg-[#E8F9FF]/70 p-4">
            <p className="text-xs uppercase tracking-wider text-[#5B6783]">{card.label}</p>
            <p className={`mt-2 inline-block bg-linear-to-r ${card.color} bg-clip-text text-3xl font-bold text-transparent`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <IssueFilters
        search={searchInput}
        query={query}
        onSearchChange={setSearchInput}
        onFilterChange={(key, value) => setQuery({ page: 1, [key]: value })}
        onExport={handleExport}
      />

      {error ? (
        <AlertBanner variant="error" className="mt-4">
          {error}
        </AlertBanner>
      ) : null}
      {loading ? <p className="mt-4 text-sm text-[#5B6783]">Loading issues...</p> : null}

      <IssueTable issues={issues} />

      <div className="mt-4 text-xs text-[#5B6783]">Total issues: {pagination.total}</div>

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setQuery({ page })}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete issue"
        message="This action cannot be undone. Are you sure?"
        confirmText="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      {user?.role === "admin" ? null : (
        <p className="mt-6 text-xs text-[#5B6783]">Users can only delete their own issues and only edit while status is Open.</p>
      )}
    </section>
  );
};
