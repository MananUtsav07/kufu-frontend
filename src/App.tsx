import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { ScrollToTop } from './components/ScrollToTop'
import { DashboardKnowledgePage } from './dashboard/DashboardKnowledgePage'
import { DashboardLayout } from './dashboard/DashboardLayout'
import { DashboardLeadsPage } from './dashboard/DashboardLeadsPage'
import { DashboardOverviewPage } from './dashboard/DashboardOverviewPage'
import { DashboardPlanPage } from './dashboard/DashboardPlanPage'
import { DashboardProfilePage } from './dashboard/DashboardProfilePage'
import { ProtectedRoute } from './lib/protected-route'
import { ApiTestPage } from './pages/ApiTestPage'
import { CaseStudiesPage } from './pages/CaseStudiesPage'
import { ContactPage } from './pages/ContactPage'
import { CreateAccountPage } from './pages/CreateAccountPage'
import { DemoPage } from './pages/DemoPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { VerifyEmailPage } from './pages/VerifyEmailPage'

const defaultMeta = {
  title: 'Kufu - AI Automation for Customer Inquiries',
  description:
    'Automate customer conversations across website, WhatsApp, and Instagram using AI. Capture leads 24/7 and never miss an inquiry again with Kufu.',
}

const routeMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Kufu - AI Automation for Customer Inquiries',
    description:
      'Automate customer conversations across website, WhatsApp, and Instagram using AI. Capture leads 24/7 and never miss an inquiry again with Kufu.',
  },
  '/demo': {
    title: 'Kufu - AI Automation for Customer Inquiries',
    description:
      'Automate customer conversations across website, WhatsApp, and Instagram using AI. Capture leads 24/7 and never miss an inquiry again with Kufu.',
  },
  '/case-studies': {
    title: 'Kufu - AI Automation for Customer Inquiries',
    description:
      'Automate customer conversations across website, WhatsApp, and Instagram using AI. Capture leads 24/7 and never miss an inquiry again with Kufu.',
  },
  '/contact': {
    title: 'Kufu - AI Automation for Customer Inquiries',
    description:
      'Automate customer conversations across website, WhatsApp, and Instagram using AI. Capture leads 24/7 and never miss an inquiry again with Kufu.',
  },
  '/login': {
    title: 'Login - Kufu',
    description:
      'Log in to Kufu to manage AI-powered customer inquiry automation across website, WhatsApp, and Instagram.',
  },
  '/create-account': {
    title: 'Create Account - Kufu',
    description: 'Create your Kufu account and start automating customer conversations with AI.',
  },
  '/verify': {
    title: 'Verify Email - Kufu',
    description: 'Verify your Kufu account email address to activate sign in.',
  },
  '/dashboard': {
    title: 'Dashboard - Kufu',
    description: 'Manage leads, knowledge, and automation metrics for your Kufu workspace.',
  },
  '/dashboard/leads': {
    title: 'Leads - Kufu Dashboard',
    description: 'View and manage your captured leads in Kufu dashboard.',
  },
  '/dashboard/knowledge': {
    title: 'Knowledge - Kufu Dashboard',
    description: 'Edit assistant knowledge and FAQs for your Kufu client workspace.',
  },
  '/dashboard/profile': {
    title: 'Profile - Kufu Dashboard',
    description: 'View profile and business details for your Kufu account.',
  },
  '/dashboard/plan': {
    title: 'Plan - Kufu Dashboard',
    description: 'Review your current Kufu plan and upgrade options.',
  },
  '/dev/api-test': {
    title: 'API Test Harness - Kufu',
    description: 'Run API checks for Kufu auth and dashboard endpoints.',
  },
}

function MetaManager() {
  const location = useLocation()

  useEffect(() => {
    const meta = routeMeta[location.pathname] ?? defaultMeta
    document.title = meta.title

    const descriptionTag = document.querySelector('meta[name="description"]')
    if (descriptionTag) {
      descriptionTag.setAttribute('content', meta.description)
    }
  }, [location.pathname])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <MetaManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
        <Route path="/dev/api-test" element={<ApiTestPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverviewPage />} />
            <Route path="leads" element={<DashboardLeadsPage />} />
            <Route path="knowledge" element={<DashboardKnowledgePage />} />
            <Route path="profile" element={<DashboardProfilePage />} />
            <Route path="plan" element={<DashboardPlanPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </>
  )
}

export default App
