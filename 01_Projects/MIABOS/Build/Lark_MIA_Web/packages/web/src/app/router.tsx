import { createBrowserRouter, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { AppShell } from "./layouts/AppShell";
import {
  RequireAuth,
  RequirePermission,
} from "@/shared/auth/permission";
import { LandingRedirect } from "@/modules/auth/pages/LandingRedirect";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { LarkEntryPage } from "@/modules/auth/pages/LarkEntryPage";
import { BindPage } from "@/modules/auth/pages/BindPage";
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
import { ProfilePage } from "@/modules/settings/pages/ProfilePage";
import { RolesPage } from "@/modules/settings/pages/RolesPage";
import { PermissionProfilesPage } from "@/modules/settings/pages/PermissionProfilesPage";
import { ChannelsPage } from "@/modules/settings/pages/ChannelsPage";
import { IntegrationLogsPage } from "@/modules/settings/pages/IntegrationLogsPage";

// Wrap a page in a permission gate that redirects to "/" on miss.
const gate = (code: string | string[], element: ReactNode) => (
  <RequirePermission code={code} redirect>
    {element}
  </RequirePermission>
);

const protectedShell: ReactNode = (
  <RequireAuth>
    <AppShell />
  </RequireAuth>
);

export const router = createBrowserRouter([
  // ─── Public ─────────────────────────────────────────────────────────
  { path: "/", element: <LandingRedirect /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/lark/entry", element: <LarkEntryPage /> },
  {
    path: "/bind",
    element: (
      <RequireAuth>
        <BindPage />
      </RequireAuth>
    ),
  },

  // ─── Protected (inside AppShell) ────────────────────────────────────
  {
    path: "/crm",
    element: protectedShell,
    children: [
      { index: true, element: <Navigate to="/crm/customers" replace /> },
      { path: "customers", element: gate("customer:read", <CustomerListPage />) },
      {
        path: "customers/:id",
        element: gate("customer:read", <CustomerProfilePage />),
      },
      { path: "leads", element: gate("lead:read", <LeadListPage />) },
    ],
  },
  {
    path: "/orders",
    element: protectedShell,
    children: [
      { index: true, element: gate("order:read", <OrderSummaryPage />) },
      { path: "returns", element: gate("order:read", <OrderSummaryPage />) },
      { path: ":id", element: gate("order:read", <OrderDetailPage />) },
    ],
  },
  {
    path: "/catalog",
    element: protectedShell,
    children: [
      { index: true, element: <Navigate to="/catalog/products" replace /> },
      { path: "products", element: gate("product:read", <ProductCatalogPage />) },
      {
        path: "products/:id",
        element: gate("product:read", <ProductDetailPage />),
      },
      { path: "pricing", element: gate("pricing:read", <PricingCenterPage />) },
      {
        path: "pricing/:id",
        element: gate("pricing:read", <PricingDetailPage />),
      },
      {
        path: "promotions",
        element: gate("promotion:read", <PromotionCenterPage />),
      },
      {
        path: "promotions/:id",
        element: gate("promotion:read", <PromotionDetailPage />),
      },
    ],
  },
  {
    path: "/operations",
    element: protectedShell,
    children: [
      {
        index: true,
        element: <Navigate to="/operations/escalations" replace />,
      },
      {
        path: "escalations",
        element: gate("escalation:read", <EscalationQueuePage />),
      },
      {
        path: "escalations/:id",
        element: gate("escalation:read", <EscalationDetailPage />),
      },
      { path: "users-roles", element: gate("user:read", <UsersAndRolesPage />) },
      {
        path: "users-roles/:id",
        element: gate("user:read", <UserDetailPage />),
      },
      {
        path: "scope-rules",
        element: gate("setting:read", <ScopeAndSensitivityRulesPage />),
      },
      {
        path: "scope-rules/:id",
        element: gate("setting:read", <RuleDetailPage />),
      },
      {
        path: "integration-ops",
        element: gate("integration:read", <IntegrationOpsPage />),
      },
      {
        path: "integration-ops/:id",
        element: gate("integration:read", <ConnectorDetailPage />),
      },
      {
        path: "source-mapping",
        element: gate("integration:read", <SourceOfTruthAndMappingPage />),
      },
      {
        path: "source-mapping/:id",
        element: gate("integration:read", <MappingDetailPage />),
      },
    ],
  },
  {
    path: "/inbox",
    element: protectedShell,
    children: [
      { index: true, element: gate("inbox:read", <UnifiedInboxPage />) },
    ],
  },
  {
    path: "/ai",
    element: protectedShell,
    children: [
      { path: "chat", element: <InternalAIChatPage /> },
      { path: "sales-advisor", element: <SalesAdvisorPage /> },
    ],
  },
  {
    path: "/sales-advisor",
    element: protectedShell,
    children: [{ index: true, element: <SalesAdvisorPage /> }],
  },
  {
    path: "/analytics",
    element: protectedShell,
    children: [
      { index: true, element: <Navigate to="/analytics/executive" replace /> },
      {
        path: "executive",
        element: gate(
          "analytics:read",
          <BusinessAnalyticsPage view="executive" />,
        ),
      },
      {
        path: "performance",
        element: gate(
          "analytics:read",
          <BusinessAnalyticsPage view="performance" />,
        ),
      },
      {
        path: "funnel",
        element: gate("analytics:read", <BusinessAnalyticsPage view="funnel" />),
      },
      {
        path: "ai-roi",
        element: gate("analytics:read", <BusinessAnalyticsPage view="ai-roi" />),
      },
    ],
  },
  {
    path: "/settings",
    element: protectedShell,
    children: [
      { index: true, element: <Navigate to="/settings/profile" replace /> },
      // Profile is always accessible — user editing themselves.
      { path: "profile", element: <ProfilePage /> },
      { path: "roles", element: gate("role:read", <RolesPage />) },
      {
        path: "permission-profiles",
        element: gate("role:read", <PermissionProfilesPage />),
      },
      { path: "channels", element: gate("integration:read", <ChannelsPage />) },
      {
        path: "integration-logs",
        element: gate("integration:read", <IntegrationLogsPage />),
      },
    ],
  },
  {
    path: "/knowledge",
    element: protectedShell,
    children: [
      {
        index: true,
        element: gate("knowledge:read", <KnowledgeHomePage />),
      },
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
      { path: "rules", element: gate("knowledge:read", <KnowledgeHomePage />) },
      {
        path: ":id",
        element: gate("knowledge:read", <KnowledgeDocumentDetailPage />),
      },
    ],
  },

  // Fallback: anything unmatched → landing decides.
  { path: "*", element: <Navigate to="/" replace /> },
]);
