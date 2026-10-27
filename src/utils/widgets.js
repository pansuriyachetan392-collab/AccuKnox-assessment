export function widgetMatches(widget, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const parts = [
    widget.name,
    widget.text,
    widget.summaryValue,
    widget.summaryLabel,
    ...(widget.segments || []).flatMap((segment) => [segment.label, String(segment.value)]),
  ];

  return parts.filter(Boolean).join(" ").toLowerCase().includes(q);
}

export function createWidgetId() {
  return `widget-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
