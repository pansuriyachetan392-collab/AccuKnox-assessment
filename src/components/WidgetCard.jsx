import DonutChart from "./DonutChart";
import StackedBar from "./StackedBar";
import { IconClose, IconEmptyChart } from "./Icons";
import { useDashboardStore } from "../store/useDashboardStore";

export default function WidgetCard({ categoryId, widget }) {
  const hideWidget = useDashboardStore((state) => state.hideWidget);

  return (
    <article className="widget-card">
      <header className="widget-card-head">
        <h3>{widget.name}</h3>
        <button
          type="button"
          className="widget-remove"
          aria-label={`Remove ${widget.name}`}
          title="Remove widget"
          onClick={() => hideWidget(categoryId, widget.id)}
        >
          <IconClose />
        </button>
      </header>
      <div className="widget-body">
        {widget.type === "donut" && (
          <DonutChart
            segments={widget.segments}
            center={widget.center}
            caption={widget.caption}
            startFraction={widget.startFraction || 0}
          />
        )}
        {widget.type === "bar" && (
          <StackedBar
            summaryValue={widget.summaryValue}
            summaryLabel={widget.summaryLabel}
            segments={widget.segments}
          />
        )}
        {widget.type === "empty" && (
          <div className="empty-graph">
            <IconEmptyChart />
            <p>No Graph data available!</p>
          </div>
        )}
        {widget.type === "text" && <p className="widget-text">{widget.text}</p>}
      </div>
    </article>
  );
}
