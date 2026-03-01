import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { AdminLayout } from "./admin/AdminLayout";
import { AdminMessagesPage } from "./admin/AdminMessagesPage";
import { AdminOverviewPage } from "./admin/AdminOverviewPage";
import { AdminQuotesPage } from "./admin/AdminQuotesPage";
import { AdminTicketsPage } from "./admin/AdminTicketsPage";
import { AdminUsersPage } from "./admin/AdminUsersPage";
import { ScrollToTop } from "./components/ScrollToTop";
import { DashboardCustomQuotePage } from "./dashboard/DashboardCustomQuotePage";
import { DashboardDevTestPage } from "./dashboard/DashboardDevTestPage";
import { DashboardIntegrationsPage } from "./dashboard/DashboardIntegrationsPage";
import { DashboardKnowledgePage } from "./dashboard/DashboardKnowledgePage";
import { DashboardLayout } from "./dashboard/DashboardLayout";
import { DashboardLeadsPage } from "./dashboard/DashboardLeadsPage";
import { DashboardOverviewPage } from "./dashboard/DashboardOverviewPage";
import { DashboardPlanPage } from "./dashboard/DashboardPlanPage";
import { DashboardProfilePage } from "./dashboard/DashboardProfilePage";
import { DashboardSupportPage } from "./dashboard/DashboardSupportPage";
import { DashboardUpgradePlanPage } from "./dashboard/DashboardUpgradePlanPage";
import { ProtectedRoute } from "./lib/protected-route";
import { CreateAccountPage } from "./pages/CreateAccountPage";
import { DemoPage } from "./pages/DemoPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { WidgetPage } from "./pages/WidgetPage";
import { ContactPage } from "./pages/home/ContactPage";

const defaultMeta = {
  title: "Kufu - AI Automation for Customer Inquiries",
  description:
    "Automate customer conversations across website, WhatsApp, and Instagram using AI. Capture leads 24/7 and never miss an inquiry again with Kufu.",
};

const routeMeta: Record<string, { title: string; description: string }> = {
  "/": defaultMeta,
  "/demo": defaultMeta,
  "/case-studies": defaultMeta,
  "/contact": defaultMeta,
  "/widget": {
    title: "Kufu Widget",
    description: "Embedded Kufu chatbot widget.",
  },
  "/login": {
    title: "Login - Kufu",
    description:
      "Log in to Kufu to manage AI-powered customer inquiry automation across website, WhatsApp, and Instagram.",
  },
  "/create-account": {
    title: "Create Account - Kufu",
    description:
      "Create your Kufu account and start automating customer conversations with AI.",
  },
  "/verify": {
    title: "Verify Email - Kufu",
    description: "Verify your Kufu account email address to activate sign in.",
  },
  "/dashboard": {
    title: "Dashboard - Kufu",
    description: "Manage usage, integrations, and support in Kufu dashboard.",
  },
  "/admin": {
    title: "Admin - Kufu",
    description: "Admin dashboard for Kufu SaaS operations.",
  },
  "/dev/api-test": {
    title: "API Test Harness - Kufu",
    description: "Run API checks for Kufu auth and dashboard endpoints.",
  },
};

function MetaManager() {
  const location = useLocation();

  useEffect(() => {
    const directMeta = routeMeta[location.pathname];
    const fallbackMeta = location.pathname.startsWith("/dashboard")
      ? routeMeta["/dashboard"]
      : location.pathname.startsWith("/admin")
        ? routeMeta["/admin"]
        : defaultMeta;

    const meta = directMeta ?? fallbackMeta;

    document.title = meta.title;

    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute("content", meta.description);
    }
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <MetaManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />

        <Route path="/contact" element={<ContactPage />} />
        <Route path="/widget" element={<WidgetPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverviewPage />} />
            <Route path="profile" element={<DashboardProfilePage />} />
            <Route path="plan" element={<DashboardPlanPage />} />
            <Route path="upgrade" element={<DashboardUpgradePlanPage />} />
            <Route
              path="integrations"
              element={<DashboardIntegrationsPage />}
            />
            <Route path="knowledge" element={<DashboardKnowledgePage />} />
            <Route path="support" element={<DashboardSupportPage />} />
            <Route path="custom-quote" element={<DashboardCustomQuotePage />} />
            <Route path="leads" element={<DashboardLeadsPage />} />
            {import.meta.env.DEV ? (
              <Route path="dev-test" element={<DashboardDevTestPage />} />
            ) : null}
          </Route>
        </Route>

        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="tickets" element={<AdminTicketsPage />} />
            <Route path="quotes" element={<AdminQuotesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </>
  );
}

export default App;
