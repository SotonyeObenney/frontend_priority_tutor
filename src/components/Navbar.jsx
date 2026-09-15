import { useState, useRef } from "react";

import { Search, X, Menu, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

/**
 * Navbar — Priority Tutor, "Ink and Sun" palette
 * ------------------------------------------------------------
 * Responsive: single row on desktop (md+), collapses to a compact
 * bar + slide-down sheet on mobile. Search becomes a full-width
 * overlay on mobile instead of squeezing into the row.
 *
 * Deliberate departures from the original design system, called out:
 * - Search input is now rounded-full (was rounded-lg) — you asked for
 *   this specifically, it's the one input that isn't a form field, so
 *   giving it a distinct shape helps it read as "search" at a glance.
 * - The nav bar itself carries a very light shadow (shadow-sm) instead
 *   of border-only. Everywhere else "no shadows" still holds — this is
 *   the one other exception, alongside the video-card hover state,
 *   because a nav bar is persistent chrome that sits above scrolling
 *   content, not a static content surface competing for attention.
 * - Active nav link gets a small accent-yellow dot instead of the old
 *   navy underline — reads more "modern app," less "browser tab."
 *
 * Wire it up:
 *   <Navbar
 *     isAuthenticated={!!user}
 *     user={user}
 *     activePath={location.pathname}
 *     onNavigate={(path) => navigate(path)}
 *     onLogin={() => navigate("/auth/login")}
 *     onRegister={() => navigate("/auth/register")}
 *     onLogout={() => logout()}
 *     onSearch={(query) => setSearchQuery(query)}
 *   />
 */

export default function Navbar({
  isAuthenticated = {},
  user = { user },
  activePath = "/",
  onNavigate = () => {},
  onLogin = () => {
    navigate("/auth/login");
  },
  onRegister = () => {
    navigate("/auth/register");
  },
  onLogout = () => {},
  onSearch = () => {},
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Videos", path: "/videos" },
  ];

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
    // setMobileSearchOpen(false);
  };

  const navigate = (path) => {
    onNavigate(path);
    setMenuOpen(false);
  };

  const SearchField = ({ autoFocus = true, className = "" }) => (
    <form onSubmit={handleSearchSubmit} className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        autoFocus={autoFocus}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search courses, tutors..."
        className="h-10 w-full rounded-full border border-gray-300 bg-white pl-10 pr-4 text-sm text-navy placeholder:text-gray-400 outline-none transition-shadow focus:border-navy focus:ring-2 focus:ring-gold/40"
      />
    </form>
  );

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      {/* Main row */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="shrink-0 text-lg font-bold tracking-tight text-navy"
        >
          Priority Tutor
        </button>

        {/* Desktop nav links */}
        <div className="hidden shrink-0 items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = activePath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="flex items-center gap-1.5 text-sm font-medium"
              >
                <span
                  className={
                    isActive ? "text-navy" : "text-gray-400 hover:text-gray-500"
                  }
                >
                  {link.label}
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-opacity ${
                    isActive ? "bg-gold opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Desktop search — centered, rounded-full */}
        {/* <SearchField className="mx-auto  w-full max-w-md md:block" /> */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative mx-auto w-full max-w-md hidden md:block"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, tutors..."
            className="h-10 w-full rounded-full border border-gray-300 bg-white pl-10 pr-4 text-sm text-navy placeholder:text-gray-400 outline-none transition-shadow focus:border-navy focus:ring-2 focus:ring-gold/40"
          />
        </form>

        {/* Desktop auth actions */}
        <div className="ml-auto hidden shrink-0 items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-semibold text-cream ring-2 ring-gold/50">
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
                className="flex h-10 items-center rounded-full bg-navy px-5 text-sm font-semibold text-cream transition-transform hover:scale-[1.02]"
              >
                Register for free
              </button>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <button
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full text-navy hover:bg-cream"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-navy hover:bg-cream"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile search overlay row */}
      {mobileSearchOpen && (
        <div className="border-t border-gray-100 px-4 py-3 md:hidden">
          <SearchField autoFocus className="w-full" />
        </div>
      )}

      {/* Mobile menu sheet */}
      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-gray-100 px-4 py-3 md:hidden">
          {navLinks.map((link) => {
            const isActive = activePath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive ? "bg-cream text-navy" : "text-gray-500"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                )}
              </button>
            );
          })}

          <div className="my-2 border-t border-gray-100" />

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-semibold text-cream ring-2 ring-gold/50">
                  {initials}
                </span>
                <span className="text-sm font-medium text-navy">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-500"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gold"
              >
                Log in
              </button>
              <button
                onClick={onRegister}
                className="mt-1 flex h-10 items-center justify-center rounded-full bg-navy text-sm font-semibold text-cream"
              >
                Register for free
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

/* --- Demo shell (remove — just here so the preview shows every state) --- */
// export default function NavbarDemo() {
//   const [authed, setAuthed] = useState(false);
//   const [path, setPath] = useState("/");

//   return (
//     <div className="min-h-[500px] bg-cream">
//       <Navbar
//         isAuthenticated={authed}
//         user={{ name: "Chidinma Okafor" }}
//         activePath={path}
//         onNavigate={setPath}
//         onLogin={() => setAuthed(true)}
//         onRegister={() => setAuthed(true)}
//         onLogout={() => setAuthed(false)}
//         onSearch={(q) => console.log("search:", q)}
//       />
//       <div className="flex justify-center pt-6">
//         <button
//           onClick={() => setAuthed((a) => !a)}
//           className="rounded-full border border-gray-300 px-3 py-1.5 text-xs text-gray-500"
//         >
//           Toggle auth state (demo only) — resize window to test mobile
//         </button>
//       </div>
//     </div>
//   );
// }
