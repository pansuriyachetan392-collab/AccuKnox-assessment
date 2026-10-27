import { useEffect, useState } from "react";
import { IconClose } from "./Icons";
import { useDashboardStore } from "../store/useDashboardStore";
import { createWidgetId, widgetMatches } from "../utils/widgets";

export default function AddWidgetDrawer() {
  const open = useDashboardStore((state) => state.drawerOpen);
  const nonce = useDashboardStore((state) => state.drawerNonce);
  if (!open) return null;
  return <DrawerSession key={nonce} />;
}

function DrawerSession() {
  const categories = useDashboardStore((state) => state.categories);
  const initialCategoryId = useDashboardStore((state) => state.drawerCategoryId);
  const closeDrawer = useDashboardStore((state) => state.closeDrawer);
  const setCategories = useDashboardStore((state) => state.setCategories);
  const dashboardSearch = useDashboardStore((state) => state.search);

  const [draft, setDraft] = useState(() => structuredClone(categories));
  const [tab, setTab] = useState(initialCategoryId);
  const [listQuery, setListQuery] = useState(dashboardSearch);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event) => {
      if (event.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [closeDrawer]);

  const active = draft.find((category) => category.id === tab) || draft[0];
  const query = listQuery.trim();
  const groups = query
    ? draft
        .map((category) => ({
          ...category,
          widgets: category.widgets.filter((widget) => widgetMatches(widget, query)),
        }))
        .filter((category) => category.widgets.length > 0)
    : active
      ? [{ ...active }]
      : [];

  function toggle(categoryId, widgetId) {
    setDraft((current) =>
      current.map((category) =>
        category.id !== categoryId
          ? category
          : {
              ...category,
              widgets: category.widgets.map((widget) =>
                widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget,
              ),
            },
      ),
    );
  }

  function addWidget(event) {
    event.preventDefault();
    const nextName = name.trim();
    const nextText = text.trim();
    if (!nextName || !nextText) {
      setError("Enter a widget name and widget text.");
      return;
    }

    const widget = {
      id: createWidgetId(),
      name: nextName,
      text: nextText,
      type: "text",
      visible: true,
    };

    setDraft((current) =>
      current.map((category) =>
        category.id !== active.id ? category : { ...category, widgets: [...category.widgets, widget] },
      ),
    );
    setName("");
    setText("");
    setError("");
    setListQuery("");
  }

  function confirm() {
    setCategories(draft);
    closeDrawer();
  }

  return (
    <div
      className="overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeDrawer();
      }}
    >
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="add-widget-title">
        <header className="drawer-header">
          <h2 id="add-widget-title">Add Widget</h2>
          <button type="button" className="drawer-close" aria-label="Close" onClick={closeDrawer}>
            <IconClose />
          </button>
        </header>

        <div className="drawer-body">
          <p className="drawer-intro">Personalise your dashboard by adding the following widget</p>

          <div className="tabs" role="tablist" aria-label="Widget categories">
            {draft.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={category.id === active?.id}
                className={category.id === active?.id ? "tab active" : "tab"}
                onClick={() => setTab(category.id)}
              >
                {category.tab}
              </button>
            ))}
          </div>

          <div className="drawer-search">
            <input
              type="text"
              value={listQuery}
              onChange={(event) => setListQuery(event.target.value)}
              placeholder="Search all widgets"
              aria-label="Search all widgets"
              autoFocus
            />
          </div>

          <div className="option-list">
            {query && <p className="group-hint">Matches across every category</p>}
            {groups.length === 0 && <p className="group-hint">No widgets match your search.</p>}
            {groups.map((category) => (
              <div key={category.id} className="option-group">
                {query && <p className="group-label">{category.tab}</p>}
                {category.widgets.length === 0 && !query && (
                  <p className="group-hint">No widgets in this category yet.</p>
                )}
                {category.widgets.map((widget) => (
                  <label key={widget.id} className="option">
                    <input
                      type="checkbox"
                      checked={widget.visible}
                      onChange={() => toggle(category.id, widget.id)}
                    />
                    <span>{widget.name}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>

          <form className="create-widget" onSubmit={addWidget}>
            <h3>Add a new widget</h3>
            <p className="group-hint">
              Added to {active?.name?.replace(/:$/, "")}. Confirm to show it on the dashboard.
            </p>
            <label className="field">
              <span>Widget name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Widget name"
              />
            </label>
            <label className="field">
              <span>Widget text</span>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Widget text"
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <div className="create-actions">
              <button type="submit" className="btn-outline">
                Add Widget
              </button>
            </div>
          </form>
        </div>

        <footer className="drawer-footer">
          <button type="button" className="btn-outline" onClick={closeDrawer}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={confirm}>
            Confirm
          </button>
        </footer>
      </aside>
    </div>
  );
}
