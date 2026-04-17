import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "./layouts/AppShell";
import { DashboardPage } from "@/modules/crm-workspace/pages/DashboardPage";
import { CustomerListPage } from "@/modules/crm-workspace/pages/CustomerListPage";
import { CustomerProfilePage } from "@/modules/crm-workspace/pages/CustomerProfilePage";
import { LeadListPage } from "@/modules/crm-workspace/pages/LeadListPage";
import { InternalAIChatPage } from "@/modules/ai-workspace/pages/InternalAIChatPage";
import { CatalogModuleLayout } from "@/modules/catalog-and-commerce/components/CatalogModuleLayout";
import { InventoryAvailabilityPage } from "@/modules/catalog-and-commerce/pages/InventoryAvailabilityPage";
import { PricingCenterPage } from "@/modules/catalog-and-commerce/pages/PricingCenterPage";
import { ProductCatalogPage } from "@/modules/catalog-and-commerce/pages/ProductCatalogPage";
import { PromotionCenterPage } from "@/modules/catalog-and-commerce/pages/PromotionCenterPage";
import { OperationsModuleLayout } from "@/modules/operations-and-governance/components/OperationsModuleLayout";
import { EscalationQueuePage } from "@/modules/operations-and-governance/pages/EscalationQueuePage";
import { IntegrationOpsPage } from "@/modules/operations-and-governance/pages/IntegrationOpsPage";
import { ScopeAndSensitivityRulesPage } from "@/modules/operations-and-governance/pages/ScopeAndSensitivityRulesPage";
import { SourceOfTruthAndMappingPage } from "@/modules/operations-and-governance/pages/SourceOfTruthAndMappingPage";
import { UsersAndRolesPage } from "@/modules/operations-and-governance/pages/UsersAndRolesPage";
import { OrderSummaryPage } from "@/modules/orders-and-service/pages/OrderSummaryPage";
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
    path: "/orders",
    element: <AppShell />,
    children: [{ index: true, element: <OrderSummaryPage /> }],
  },
  {
    path: "/catalog",
    element: <AppShell />,
    children: [
      {
        element: <CatalogModuleLayout />,
        children: [
          { index: true, element: <Navigate to="/catalog/products" replace /> },
          { path: "products", element: <ProductCatalogPage /> },
          { path: "inventory", element: <InventoryAvailabilityPage /> },
          { path: "pricing", element: <PricingCenterPage /> },
          { path: "promotions", element: <PromotionCenterPage /> },
        ],
      },
    ],
  },
  {
    path: "/operations",
    element: <AppShell />,
    children: [
      {
        element: <OperationsModuleLayout />,
        children: [
          { index: true, element: <Navigate to="/operations/escalations" replace /> },
          { path: "escalations", element: <EscalationQueuePage /> },
          { path: "users-roles", element: <UsersAndRolesPage /> },
          { path: "scope-rules", element: <ScopeAndSensitivityRulesPage /> },
          { path: "integration-ops", element: <IntegrationOpsPage /> },
          { path: "source-mapping", element: <SourceOfTruthAndMappingPage /> },
        ],
      },
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
      {
        path: "executive",
        element: <BusinessAnalyticsPage view="executive" />,
      },
      {
        path: "performance",
        element: <BusinessAnalyticsPage view="performance" />,
      },
      { path: "funnel", element: <BusinessAnalyticsPage view="funnel" /> },
      { path: "ai-roi", element: <BusinessAnalyticsPage view="ai-roi" /> },
    ],
  },
]);
