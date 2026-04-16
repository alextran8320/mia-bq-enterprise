import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "./layouts/AppShell";
import { DashboardPage } from "@/modules/crm-workspace/pages/DashboardPage";
import { CustomerListPage } from "@/modules/crm-workspace/pages/CustomerListPage";
import { CustomerProfilePage } from "@/modules/crm-workspace/pages/CustomerProfilePage";
import { LeadListPage } from "@/modules/crm-workspace/pages/LeadListPage";
import { InternalAIChatPage } from "@/modules/ai-workspace/pages/InternalAIChatPage";
import { SalesAdvisorPage } from "@/modules/ai-workspace/pages/SalesAdvisorPage";
import { BusinessAnalyticsPage } from "@/modules/insights-performance/pages/BusinessAnalyticsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/crm" replace />,
  },
  {
    path: "/crm",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "customers", element: <CustomerListPage /> },
      { path: "customers/:id", element: <CustomerProfilePage /> },
      { path: "leads", element: <LeadListPage /> },
    ],
  },
  {
    path: "/ai",
    element: <AppShell />,
    children: [
      { path: "chat", element: <InternalAIChatPage /> },
      { path: "sales-advisor", element: <SalesAdvisorPage /> },
    ],
  },
  {
    path: "/sales-advisor",
    element: <AppShell />,
    children: [{ index: true, element: <SalesAdvisorPage /> }],
  },
  {
    path: "/analytics",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/analytics/executive" replace /> },
      { path: "executive", element: <BusinessAnalyticsPage view="executive" /> },
      { path: "performance", element: <BusinessAnalyticsPage view="performance" /> },
      { path: "funnel", element: <BusinessAnalyticsPage view="funnel" /> },
      { path: "ai-roi", element: <BusinessAnalyticsPage view="ai-roi" /> },
    ],
  },
]);
