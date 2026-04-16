import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "./layouts/AppShell";
import { DashboardPage } from "@/modules/crm-workspace/pages/DashboardPage";
import { CustomerListPage } from "@/modules/crm-workspace/pages/CustomerListPage";
import { CustomerProfilePage } from "@/modules/crm-workspace/pages/CustomerProfilePage";
import { LeadListPage } from "@/modules/crm-workspace/pages/LeadListPage";

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
]);
