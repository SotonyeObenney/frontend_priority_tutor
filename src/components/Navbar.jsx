import { useState } from "react";
import { Search, LogOut } from "lucide-react";

/**
 * Navbar — Priority Tutor
 *
 * Drop this into your layout above the route outlet. It's stateless aside
 * from the search input, so wire it to your router / auth context via props:
 *
 *   <Navbar
 *     isAuthenticated={!!user}
 *     user={user}                    // { name: "Chidinma Okafor" }
 *     activePath={location.pathname} // "/" | "/videos"
 *     onNavigate={(path) => navigate(path)}
 *     onLogin={() => navigate("/auth/login")}
 *     onRegister={() => navigate("/auth/register")}
 *     onLogout={() => logout()}
 *     onSearch={(query) => setSearchQuery(query)}
 *   />
 *
 * Design system notes this follows:
 * - No shadows, no gradients — border-b does the separation work, same as cards.
 * - Nav links reuse the Tabs pattern (2px navy bottom border on active,
 *   gray-400 when inactive) instead of inventing a new "active link" style.
 * - Only one navy-filled button on screen at a time (Register). Login is a
 *   gold text link, matching the Links convention.
 * - Skipped the scattered course-code pill motif here on purpose — the doc
 *   calls it out as a hero/empty-state device, not for dense chrome like a navbar.
 */
export function Navbar({
  isAuthenticated = false,
  user = null,
  activePath = "/",
  onNavigate = () => {},
  onLogin = () => {},
  onRegister = () => {},
  onLogout = () => {},
  onSearch = () => {},
}) {
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Videos", path: "/videos" },
  ];

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
        {/* Logo */}
        <button
          onClick={() => onNavigate("/")}
          className="shrink-0 text-lg font-bold tracking-tight text-navy"
        >
          Priority Tutor
        </button>

        {/* Nav links */}
        <div className="flex shrink-0 items-center gap-6 border-b-0">
          {navLinks.map((link) => {
            const isActive = activePath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`h-16 border-b-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-navy text-navy"
                    : "border-transparent text-gray-400 hover:text-gray-500"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="mx-auto w-full max-w-md">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, tutors..."
              className="h-9 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-navy placeholder:text-gray-400 outline-none focus:border-navy"
            />
          </div>
        </form>

        {/* Auth actions */}
        <div className="flex shrink-0 items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-semibold text-cream">
                  {initials}
                </span>
                <span className="text-sm font-medium text-navy">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="text-sm font-medium text-gold"
              >
                Log in
              </button>
              <button
                onClick={onRegister}
                className="flex h-10 items-center rounded-lg bg-navy px-4 text-sm font-semibold text-cream"
              >
                Register for free
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

/* --- Demo shell (remove — just here so the preview shows both states) --- */
export default function NavbarDemo() {
  const [authed, setAuthed] = useState(false);
  const [path, setPath] = useState("/");

  return (
    <div className="min-h-[420px] bg-cream">
      <Navbar
        isAuthenticated={authed}
        user={{ name: "Chidinma Okafor" }}
        activePath={path}
        onNavigate={setPath}
        onLogin={() => setAuthed(true)}
        onRegister={() => setAuthed(true)}
        onLogout={() => setAuthed(false)}
        onSearch={(q) => console.log("search:", q)}
      />
      <div className="flex justify-center pt-6">
        <button
          onClick={() => setAuthed((a) => !a)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-500"
        >
          Toggle auth state (demo only)
        </button>
      </div>
    </div>
  );
}
