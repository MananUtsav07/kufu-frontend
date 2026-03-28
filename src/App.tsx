import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { ScrollToTop } from "./components/ScrollToTop";
import { PlanProtectedRoute } from "./lib/plan-protected-route";
import { ProtectedRoute } from "./lib/protected-route";
import { HomePage } from "./pages/HomePage";

const DemoPage = lazy(() =>
  import("./pages/DemoPage").then((module) => ({ default: module.DemoPage })),
);
const ContactPage = lazy(() =>
  import("./pages/home/ContactPage").then((module) => ({
    default: module.ContactPage,
  })),
);
const WidgetPage = lazy(() =>
  import("./pages/WidgetPage").then((module) => ({ default: module.WidgetPage })),
);
const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);
const CreateAccountPage = lazy(() =>
  import("./pages/CreateAccountPage").then((module) => ({
    default: module.CreateAccountPage,
  })),
);
const VerifyEmailPage = lazy(() =>
  import("./pages/VerifyEmailPage").then((module) => ({
    default: module.VerifyEmailPage,
  })),
);
const ForgotPasswordPage = lazy(() =>
  import("./pages/ForgotPasswordPage").then((module) => ({
    default: module.ForgotPasswordPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import("./pages/ResetPasswordPage").then((module) => ({
    default: module.ResetPasswordPage,
  })),
);
const DashboardLayout = lazy(() =>
  import("./dashboard/DashboardLayout").then((module) => ({
    default: module.DashboardLayout,
  })),
);
const DashboardOverviewPage = lazy(() =>
  import("./dashboard/DashboardOverviewPage").then((module) => ({
    default: module.DashboardOverviewPage,
  })),
);
const DashboardProfilePage = lazy(() =>
  import("./dashboard/DashboardProfilePage").then((module) => ({
    default: module.DashboardProfilePage,
  })),
);
const DashboardPlanPage = lazy(() =>
  import("./dashboard/DashboardPlanPage").then((module) => ({
    default: module.DashboardPlanPage,
  })),
);
const DashboardUpgradePlanPage = lazy(() =>
  import("./dashboard/DashboardUpgradePlanPage").then((module) => ({
    default: module.DashboardUpgradePlanPage,
  })),
);
const DashboardIntegrationsPage = lazy(() =>
  import("./dashboard/DashboardIntegrationsPage").then((module) => ({
    default: module.DashboardIntegrationsPage,
  })),
);
const DashboardKnowledgePage = lazy(() =>
  import("./dashboard/DashboardKnowledgePage").then((module) => ({
    default: module.DashboardKnowledgePage,
  })),
);
const DashboardSupportPage = lazy(() =>
  import("./dashboard/DashboardSupportPage").then((module) => ({
    default: module.DashboardSupportPage,
  })),
);
const DashboardCustomQuotePage = lazy(() =>
  import("./dashboard/DashboardCustomQuotePage").then((module) => ({
    default: module.DashboardCustomQuotePage,
  })),
);
const DashboardLeadsPage = lazy(() =>
  import("./dashboard/DashboardLeadsPage").then((module) => ({
    default: module.DashboardLeadsPage,
  })),
);
const DashboardChatHistoryPage = lazy(() =>
  import("./dashboard/DashboardChatHistoryPage").then((module) => ({
    default: module.DashboardChatHistoryPage,
  })),
);
const DashboardAnalyticsPage = lazy(() =>
  import("./dashboard/DashboardAnalyticsPage").then((module) => ({
    default: module.DashboardAnalyticsPage,
  })),
);
const DashboardChatbotSettingsPage = lazy(() =>
  import("./dashboard/DashboardChatbotSettingsPage").then((module) => ({
    default: module.DashboardChatbotSettingsPage,
  })),
);
const DashboardTestChatPage = lazy(() =>
  import("./dashboard/DashboardTestChatPage").then((module) => ({
    default: module.DashboardTestChatPage,
  })),
);
const DashboardDevTestPage = lazy(() =>
  import("./dashboard/DashboardDevTestPage").then((module) => ({
    default: module.DashboardDevTestPage,
  })),
);
const AdminLayout = lazy(() =>
  import("./admin/AdminLayout").then((module) => ({
    default: module.AdminLayout,
  })),
);
const AdminOverviewPage = lazy(() =>
  import("./admin/AdminOverviewPage").then((module) => ({
    default: module.AdminOverviewPage,
  })),
);
const AdminUsersPage = lazy(() =>
  import("./admin/AdminUsersPage").then((module) => ({
    default: module.AdminUsersPage,
  })),
);
const AdminMessagesPage = lazy(() =>
  import("./admin/AdminMessagesPage").then((module) => ({
    default: module.AdminMessagesPage,
  })),
);
const AdminTicketsPage = lazy(() =>
  import("./admin/AdminTicketsPage").then((module) => ({
    default: module.AdminTicketsPage,
  })),
);
const AdminQuotesPage = lazy(() =>
  import("./admin/AdminQuotesPage").then((module) => ({
    default: module.AdminQuotesPage,
  })),
);
const GlobalFloatingChat = lazy(() =>
  import("./components/GlobalFloatingChat").then((module) => ({
    default: module.GlobalFloatingChat,
  })),
);

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
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-[#040b36] text-sm text-slate-300">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoPage />} />

          <Route path="/contact" element={<ContactPage />} />
          <Route path="/widget" element={<WidgetPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

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
              <Route
                path="custom-quote"
                element={<DashboardCustomQuotePage />}
              />
              <Route path="leads" element={<DashboardLeadsPage />} />
              <Route
                path="chat-history"
                element={
                  <PlanProtectedRoute minPlan="starter">
                    <DashboardChatHistoryPage />
                  </PlanProtectedRoute>
                }
              />
              <Route
                path="analytics"
                element={
                  <PlanProtectedRoute minPlan="pro">
                    <DashboardAnalyticsPage />
                  </PlanProtectedRoute>
                }
              />
              <Route
                path="chatbot-settings"
                element={<DashboardChatbotSettingsPage />}
              />
              <Route path="test-chat" element={<DashboardTestChatPage />} />
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
        <GlobalFloatingChat />
      </Suspense>
    </>
  );
}

export default App;
