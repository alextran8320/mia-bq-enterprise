import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "./layouts/AppShell";
import { CustomerListPage } from "@/modules/crm-workspace/pages/CustomerListPage";
import { CustomerProfilePage } from "@/modules/crm-workspace/pages/CustomerProfilePage";
import { LeadListPage } from "@/modules/crm-workspace/pages/LeadListPage";
import { InternalAIChatPage } from "@/modules/ai-workspace/pages/InternalAIChatPage";
import { PricingCenterPage } from "@/modules/catalog-and-commerce/pages/PricingCenterPage";
import { PricingDetailPage } from "@/modules/catalog-and-commerce/pages/PricingDetailPage";
import { ProductCatalogPage } from "@/modules/catalog-and-commerce/pages/ProductCatalogPage";
import { ProductDetailPage } from "@/modules/catalog-and-commerce/pages/ProductDetailPage";
import { PromotionCenterPage } from "@/modules/catalog-and-commerce/pages/PromotionCenterPage";
import { PromotionDetailPage } from "@/modules/catalog-and-commerce/pages/PromotionDetailPage";
import { EscalationQueuePage } from "@/modules/operations-and-governance/pages/EscalationQueuePage";
import { EscalationDetailPage } from "@/modules/operations-and-governance/pages/EscalationDetailPage";
import { IntegrationOpsPage } from "@/modules/operations-and-governance/pages/IntegrationOpsPage";
import { ConnectorDetailPage } from "@/modules/operations-and-governance/pages/ConnectorDetailPage";
import { ScopeAndSensitivityRulesPage } from "@/modules/operations-and-governance/pages/ScopeAndSensitivityRulesPage";
import { RuleDetailPage } from "@/modules/operations-and-governance/pages/RuleDetailPage";
import { SourceOfTruthAndMappingPage } from "@/modules/operations-and-governance/pages/SourceOfTruthAndMappingPage";
import { MappingDetailPage } from "@/modules/operations-and-governance/pages/MappingDetailPage";
import { UsersAndRolesPage } from "@/modules/operations-and-governance/pages/UsersAndRolesPage";
import { UserDetailPage } from "@/modules/operations-and-governance/pages/UserDetailPage";
import { OrderSummaryPage } from "@/modules/orders-and-service/pages/OrderSummaryPage";
import { OrderDetailPage } from "@/modules/orders-and-service/pages/OrderDetailPage";
import { SalesAdvisorPage } from "@/modules/ai-workspace/pages/SalesAdvisorPage";
import { UnifiedInboxPage } from "@/modules/ai-workspace/pages/UnifiedInboxPage";
import { BusinessAnalyticsPage } from "@/modules/insights-performance/pages/BusinessAnalyticsPage";
import { KnowledgeHomePage } from "@/modules/knowledge-center/pages/KnowledgeHomePage";
import { KnowledgeDocumentDetailPage } from "@/modules/knowledge-center/pages/KnowledgeDocumentDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/analytics/executive" replace />,
  },
  {
    path: "/crm",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/crm/customers" replace /> },
      { path: "customers", element: <CustomerListPage /> },
      { path: "customers/:id", element: <CustomerProfilePage /> },
      { path: "leads", element: <LeadListPage /> },
    ],
  },
  {
    path: "/orders",
    element: <AppShell />,
    children: [
      { index: true, element: <OrderSummaryPage /> },
      { path: ":id", element: <OrderDetailPage /> },
    ],
  },
  {
    path: "/catalog",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/catalog/products" replace /> },
      { path: "products", element: <ProductCatalogPage /> },
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "pricing", element: <PricingCenterPage /> },
      { path: "pricing/:id", element: <PricingDetailPage /> },
      { path: "promotions", element: <PromotionCenterPage /> },
      { path: "promotions/:id", element: <PromotionDetailPage /> },
    ],
  },
  {
    path: "/operations",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/operations/escalations" replace />,
      },
      { path: "escalations", element: <EscalationQueuePage /> },
      { path: "escalations/:id", element: <EscalationDetailPage /> },
      { path: "users-roles", element: <UsersAndRolesPage /> },
      { path: "users-roles/:id", element: <UserDetailPage /> },
      { path: "scope-rules", element: <ScopeAndSensitivityRulesPage /> },
      { path: "scope-rules/:id", element: <RuleDetailPage /> },
      { path: "integration-ops", element: <IntegrationOpsPage /> },
      { path: "integration-ops/:id", element: <ConnectorDetailPage /> },
      { path: "source-mapping", element: <SourceOfTruthAndMappingPage /> },
      { path: "source-mapping/:id", element: <MappingDetailPage /> },
    ],
  },
  {
    path: "/inbox",
    element: <AppShell />,
    children: [{ index: true, element: <UnifiedInboxPage /> }],
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
  {
    path: "/knowledge",
    element: <AppShell />,
    children: [
      { index: true, element: <KnowledgeHomePage /> },
      {
        path: "create",
        element: <Navigate to="/knowledge?section=create" replace />,
      },
      {
        path: "library",
        element: <Navigate to="/knowledge?section=library" replace />,
      },
      {
        path: "publishing-queue",
        element: <Navigate to="/knowledge?section=queue" replace />,
      },
      {
        path: "sources",
        element: <Navigate to="/knowledge?section=sources" replace />,
      },
      {
        path: "freshness",
        element: <Navigate to="/knowledge?section=freshness" replace />,
      },
      { path: ":id", element: <KnowledgeDocumentDetailPage /> },
    ],
  },
]);
