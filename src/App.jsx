import AddWidgetDrawer from "./components/AddWidgetDrawer";
import Dashboard from "./components/Dashboard";
import DashboardHeader from "./components/DashboardHeader";
import TopBar from "./components/TopBar";

export default function App() {
  return (
    <div className="app">
      <TopBar />
      <main className="page">
        <DashboardHeader />
        <Dashboard />
      </main>
      <AddWidgetDrawer />
    </div>
  );
}
