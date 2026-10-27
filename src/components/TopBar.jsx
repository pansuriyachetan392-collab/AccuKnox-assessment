import { useCallback, useRef, useState } from "react";
import { IconBell, IconChevron, IconSearch, IconUser } from "./Icons";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { useDashboardStore } from "../store/useDashboardStore";

export default function TopBar() {
  const search = useDashboardStore((state) => state.search);
  const setSearch = useDashboardStore((state) => state.setSearch);
  const closeDrawer = useDashboardStore((state) => state.closeDrawer);
  const [notesOpen, setNotesOpen] = useState(false);
  const notesRef = useRef(null);
  const dismissNotes = useCallback(() => setNotesOpen(false), []);
  useOnClickOutside(notesRef, dismissNotes, notesOpen);

  function goHome() {
    setSearch("");
    closeDrawer();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header className="topbar">
      <nav className="crumb" aria-label="Breadcrumb">
        <button type="button" onClick={goHome}>
          Home
        </button>
        <IconChevron className="crumb-chevron" />
        <span aria-current="page">Dashboard V2</span>
      </nav>

      <form className="search-form" role="search" onSubmit={(event) => event.preventDefault()}>
        <IconSearch />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search anything..."
          aria-label="Search widgets"
        />
        {search && (
          <button type="button" className="search-clear" onClick={() => setSearch("")} aria-label="Clear search">
            ×
          </button>
        )}
      </form>

      <div className="topbar-right">
        <div className="menu-wrap" ref={notesRef}>
          <button
            type="button"
            className="ghost-icon"
            aria-label="Notifications"
            aria-expanded={notesOpen}
            onClick={() => setNotesOpen((open) => !open)}
          >
            <IconBell />
          </button>
          {notesOpen && (
            <div className="menu notes-menu" role="status">
              No new notifications
            </div>
          )}
        </div>
        <span className="avatar" aria-hidden="true">
          <IconUser />
        </span>
      </div>
    </header>
  );
}
