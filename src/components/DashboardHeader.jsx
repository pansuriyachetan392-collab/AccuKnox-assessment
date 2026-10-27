import { useCallback, useRef, useState } from "react";
import { IconChevron, IconClock, IconDots, IconPlus, IconRefresh } from "./Icons";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { TIME_RANGES, useDashboardStore } from "../store/useDashboardStore";
import { widgetMatches } from "../utils/widgets";

export default function DashboardHeader() {
  const search = useDashboardStore((state) => state.search);
  const setSearch = useDashboardStore((state) => state.setSearch);
  const timeRange = useDashboardStore((state) => state.timeRange);
  const setTimeRange = useDashboardStore((state) => state.setTimeRange);
  const openDrawer = useDashboardStore((state) => state.openDrawer);
  const reset = useDashboardStore((state) => state.reset);
  const categories = useDashboardStore((state) => state.categories);

  const [menu, setMenu] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const timeRef = useRef(null);
  const moreRef = useRef(null);
  const closeMenu = useCallback(() => setMenu(null), []);
  useOnClickOutside(timeRef, closeMenu, menu === "time");
  useOnClickOutside(moreRef, closeMenu, menu === "more");

  const current = TIME_RANGES.find((range) => range.id === timeRange) || TIME_RANGES[0];
  const matchCount = categories.reduce(
    (count, category) =>
      count + category.widgets.filter((widget) => widget.visible && widgetMatches(widget, search)).length,
    0,
  );

  function refresh() {
    setSearch("");
    setMenu(null);
    setSpinning(true);
    window.setTimeout(() => setSpinning(false), 650);
  }

  function resetDashboard() {
    setMenu(null);
    const confirmed = window.confirm("Reset the dashboard to the original widgets?");
    if (confirmed) reset();
  }

  return (
    <div className="dash-head">
      <div>
        <h1>CNAPP Dashboard</h1>
        {search.trim() && (
          <p className="search-status">
            {matchCount} {matchCount === 1 ? "widget" : "widgets"} found
          </p>
        )}
      </div>
      <div className="dash-actions">
        <button type="button" className="btn-outline" onClick={() => openDrawer("cspm")}>
          Add Widget
          <IconPlus />
        </button>
        <button type="button" className="icon-btn" aria-label="Refresh view" title="Refresh view" onClick={refresh}>
          <span className={spinning ? "spin" : undefined}>
            <IconRefresh />
          </span>
        </button>
        <div className="menu-wrap" ref={moreRef}>
          <button
            type="button"
            className="icon-btn"
            aria-label="More options"
            aria-expanded={menu === "more"}
            onClick={() => setMenu(menu === "more" ? null : "more")}
          >
            <IconDots />
          </button>
          {menu === "more" && (
            <div className="menu" role="menu">
              <button type="button" role="menuitem" onClick={resetDashboard}>
                Reset dashboard
              </button>
            </div>
          )}
        </div>
        <div className="menu-wrap" ref={timeRef}>
          <button
            type="button"
            className="btn-primary"
            aria-haspopup="menu"
            aria-expanded={menu === "time"}
            onClick={() => setMenu(menu === "time" ? null : "time")}
          >
            <IconClock />
            {current.label}
            <IconChevron className={menu === "time" ? "chevron open" : "chevron"} />
          </button>
          {menu === "time" && (
            <div className="menu" role="menu">
              {TIME_RANGES.map((range) => (
                <button
                  key={range.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={range.id === timeRange}
                  className={range.id === timeRange ? "active" : undefined}
                  onClick={() => {
                    setTimeRange(range.id);
                    setMenu(null);
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
