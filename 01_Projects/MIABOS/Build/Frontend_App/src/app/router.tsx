import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "./layouts/AppShell";
import { DashboardPage } from "@/modules/crm-workspace/pages/DashboardPage";
import { CustomerListPage } from "@/modules/crm-workspace/pages/CustomerListPage";
import { CustomerProfilePage } from "@/modules/crm-workspace/pages/CustomerProfilePage";
import { LeadListPage } from "@/modules/crm-workspace/pages/LeadListPage";
import { InternalAIChatPage } from "@/modules/ai-workspace/pages/InternalAIChatPage";
import { OrderSummaryPage } from "@/modules/orders-and-service/pages/OrderSummaryPage";

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
      { path: "orders", element: <OrderSummaryPage /> },
      { path: "customers", element: <CustomerListPage /> },
      { path: "customers/:id", element: <CustomerProfilePage /> },
      { path: "leads", element: <LeadListPage /> },
    ],
  },
  {
    path: "/ai",
    element: <AppShell />,
    children: [{ path: "chat", element: <InternalAIChatPage /> }],
  },
]);
