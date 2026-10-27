import { IconPlus } from "./Icons";
import WidgetCard from "./WidgetCard";
import { useDashboardStore } from "../store/useDashboardStore";
import { widgetMatches } from "../utils/widgets";

export default function Dashboard() {
  const categories = useDashboardStore((state) => state.categories);
  const search = useDashboardStore((state) => state.search);
  const setSearch = useDashboardStore((state) => state.setSearch);
  const openDrawer = useDashboardStore((state) => state.openDrawer);
  const query = search.trim();

  const sections = categories
    .map((category) => {
      const widgets = category.widgets.filter(
        (widget) => widget.visible && widgetMatches(widget, query),
      );
      return { ...category, widgets };
    })
    .filter((category) => {
      if (query) return category.widgets.length > 0;
      return category.alwaysShow || category.widgets.length > 0;
    });

  if (query && sections.length === 0) {
    return (
      <div className="empty-page">
        <p>No widgets match “{query}”.</p>
        <button type="button" className="btn-outline" onClick={() => setSearch("")}>
          Clear search
        </button>
      </div>
    );
  }

  return (
    <div className="categories">
      {sections.map((category) => (
        <section key={category.id} className="category" aria-labelledby={`cat-${category.id}`}>
          <h2 id={`cat-${category.id}`}>{category.name}</h2>
          <div className="widget-grid">
            {category.widgets.map((widget) => (
              <WidgetCard key={widget.id} categoryId={category.id} widget={widget} />
            ))}
            {!query && (
              <div className="widget-card add-card">
                <button type="button" className="add-widget-btn" onClick={() => openDrawer(category.id)}>
                  <IconPlus />
                  Add Widget
                </button>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
