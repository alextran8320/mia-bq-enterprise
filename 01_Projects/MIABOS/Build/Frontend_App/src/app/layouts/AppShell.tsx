import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar />
        <main
          style={{
            flex: 1,
            overflow: "auto",
            background: "var(--color-bg-page)",
            padding: "32px var(--space-8) 20px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
