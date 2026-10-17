// AdminDashboard.jsx
// No props: the page loads its own data and sends its own approve/reject requests.
//
// ASSUMPTIONS to check against your code:
//  1. apiFetch lives in "../api" and is a named export. Adjust the import.
//  2. apiFetch(path, options) returns parsed JSON and THROWS on a non-2xx response.
//  3. The three routes below match your Flask routes. Change the constants if not.

import { useEffect, useState } from "react";
import { apiFetch } from "../api";

const LIST_URL = "/admin/applications";
const approveUrl = (id) => `admin/approve/${id}`;
const rejectUrl = (id) => `admin/reject/${id}`;

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const splitCourses = (courses = "") =>
  courses
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

function ApplicationRow({ app, status, busy, error, onApprove, onReject }) {
  return (
    <li className="py-5 first:pt-2 last:pb-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-cream">
            {initials(app.tutor_name)}
          </div>
          <div className="min-w-0">
            <p className="font-bold tracking-tight text-navy">
              {app.tutor_name}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {splitCourses(app.courses).map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-pill px-3 py-1 text-xs font-medium text-navy"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-2 break-words text-sm text-gray-500">{app.bio}</p>
            {error && <p className="mt-2 text-sm text-danger">{error}</p>}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:pt-0.5">
          {status === "pending" && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => onReject(app.tutor_id)}
                className="h-9 rounded-lg border border-gray-300 px-4 text-sm font-medium text-navy hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy disabled:opacity-50"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => onApprove(app.tutor_id)}
                className="h-9 rounded-lg bg-navy px-4 text-sm font-medium text-cream hover:bg-navy/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:opacity-50"
              >
                {busy ? "Saving…" : "Approve"}
              </button>
            </>
          )}
          {status === "approved" && (
            <span className="rounded-full bg-success/10 px-3 py-1.5 text-sm font-medium text-success">
              Approved
            </span>
          )}
          {status === "rejected" && (
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-500">
              Rejected
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0); // bump to re-run the fetch (Retry button)

  const [tab, setTab] = useState("pending");
  const [statuses, setStatuses] = useState({}); // tutor_id -> "approved" | "rejected"
  const [busyId, setBusyId] = useState(null);
  const [rowErrors, setRowErrors] = useState({});

  // Runs after the first render, and again whenever reloadKey changes.
  useEffect(() => {
    let cancelled = false; // set to true if the page unmounts before the request finishes

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await apiFetch(LIST_URL);
        if (!cancelled) setApplications(data.applications);
      } catch {
        if (!cancelled) setLoadError("Couldn't load applications.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true; // cleanup: ignore the response if we've left the page
    };
  }, [reloadKey]);

  const statusOf = (id) => statuses[id] || "pending";
  const counts = TABS.reduce(
    (acc, t) => ({
      ...acc,
      [t.key]: applications.filter((a) => statusOf(a.tutor_id) === t.key)
        .length,
    }),
    {},
  );
  const visible = applications.filter((a) => statusOf(a.tutor_id) === tab);

  async function decide(id, result) {
    setBusyId(id);
    setRowErrors((e) => ({ ...e, [id]: null }));
    try {
      await apiFetch(result === "approved" ? approveUrl(id) : rejectUrl(id), {
        method: "GET",
      });
      setStatuses((s) => ({ ...s, [id]: result }));
    } catch {
      const verb = result === "approved" ? "approve" : "reject";
      setRowErrors((e) => ({
        ...e,
        [id]: `Couldn't ${verb} this tutor. Try again.`,
      }));
    } finally {
      setBusyId(null);
    }
  }

  const emptyCopy = {
    pending:
      "No applications waiting. New tutor applications will show up here.",
    approved: "No tutors approved in this session yet.",
    rejected: "No applications rejected in this session yet.",
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-navy">
          Tutor applications
        </h1>
        <p className="mt-1 text-gray-500">
          {loading
            ? "Loading…"
            : `${counts.pending} waiting for review. Approved tutors get the Verified badge and can post videos.`}
        </p>

        <div
          className="mt-6 flex gap-6 border-b border-gray-200"
          role="tablist"
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px border-b-2 pb-3 text-sm font-medium focus:outline-none focus-visible:text-navy ${
                tab === t.key
                  ? "border-navy text-navy"
                  : "border-transparent text-gray-400 hover:text-gray-500"
              }`}
            >
              {t.label} ({counts[t.key]})
            </button>
          ))}
        </div>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          {loading ? (
            <p className="text-gray-500">Loading applications…</p>
          ) : loadError ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-danger">{loadError}</p>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="h-9 rounded-lg border border-gray-300 px-4 text-sm font-medium text-navy hover:bg-gray-50"
              >
                Retry
              </button>
            </div>
          ) : visible.length === 0 ? (
            <p className="text-gray-500">{emptyCopy[tab]}</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {visible.map((app) => (
                <ApplicationRow
                  key={app.tutor_id}
                  app={app}
                  status={statusOf(app.tutor_id)}
                  busy={busyId === app.tutor_id}
                  error={rowErrors[app.tutor_id]}
                  onApprove={(id) => decide(id, "approved")}
                  onReject={(id) => decide(id, "rejected")}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
