import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthProvider'
import { brandLogoSrc, brandName } from '../lib/brand'
import { scrollToId } from '../lib/scrollToId'

type NavbarProps = {
  page: 'home' | 'demo' | 'case-studies' | 'contact'
}

const navLinkClass =
  'text-sm font-medium hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark rounded-sm'

const navButtonClass = `${navLinkClass} bg-transparent p-0`

type AuthActionsProps = {
  loginClassName: string
  avatarClassName: string
}

function AuthActions({ loginClassName, avatarClassName }: AuthActionsProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { loading, user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current) {
        return
      }

      const target = event.target
      if (target instanceof Node && !menuRef.current.contains(target)) {
        setIsMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  if (loading) {
    return (
      <button
        className={loginClassName}
        disabled
        type="button"
      >
        Login
      </button>
    )
  }

  if (!user) {
    return (
      <Link className={loginClassName} to="/login">
        Login
      </Link>
    )
  }

  const avatarUrl = typeof user.user_metadata.avatar_url === 'string' ? user.user_metadata.avatar_url : ''
  const avatarInitial = (user.email?.charAt(0) ?? '?').toUpperCase()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/', { replace: true })
    } finally {
      setIsMenuOpen(false)
    }
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        className={avatarClassName}
        type="button"
        onClick={() => setIsMenuOpen((value) => !value)}
      >
        {avatarUrl ? (
          <img alt="User avatar" className="size-full rounded-full object-cover" src={avatarUrl} />
        ) : (
          <span className="text-sm font-semibold">{avatarInitial}</span>
        )}
      </button>

      {isMenuOpen ? (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          role="menu"
        >
          <Link
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            role="menuitem"
            to="/demo"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <button
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
            role="menuitem"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function Navbar({ page }: NavbarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleSectionNavigation = (id: string) => {
    if (location.pathname === '/') {
      scrollToId(id)
      return
    }

    navigate('/', { state: { scrollTo: id } })
  }

  if (page === 'home' || page === 'case-studies' || page === 'contact') {
    return (
      <motion.nav
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 w-full border-b border-slate-200 bg-background-light/80 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-background-dark/80 lg:px-10"
        initial={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative flex h-16 items-center">
          <div className="flex items-center gap-2">
            <Link aria-label={`${brandName} Home`} className="flex items-center gap-2" to="/">
              <img alt="Kufu logo" className="h-6 w-auto shrink-0 md:h-7" src={brandLogoSrc} />
              <span className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                {brandName}
              </span>
            </Link>
          </div>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            <button className={navButtonClass} type="button" onClick={() => handleSectionNavigation('home')}>
              Home
            </button>
            <button className={navButtonClass} type="button" onClick={() => handleSectionNavigation('services')}>
              Services
            </button>
            <button className={navButtonClass} type="button" onClick={() => handleSectionNavigation('pricing')}>
              Pricing
            </button>
            <button className={navButtonClass} type="button" onClick={() => handleSectionNavigation('faq')}>
              FAQ
            </button>
            <button className={navButtonClass} type="button" onClick={() => handleSectionNavigation('contact')}>
              Contact
            </button>
            <button
              className={navButtonClass}
              type="button"
              onClick={() => handleSectionNavigation('case-studies')}
            >
              Case Studies
            </button>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark"
              to="/demo"
            >
              Request a Free Demo
            </Link>
            <div className="hidden md:block">
              <AuthActions
                avatarClassName="flex size-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-white transition-colors hover:border-primary hover:text-primary dark:border-slate-600 dark:bg-slate-950"
                loginClassName="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark dark:border-slate-700 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      </motion.nav>
    )
  }

  if (page === 'demo') {
    return (
      <motion.nav
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/50 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-background-dark/50 lg:px-10"
        initial={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative flex h-16 items-center">
          <div className="flex items-center gap-2">
            <Link aria-label={`${brandName} Home`} className="flex items-center gap-2" to="/">
              <img alt="Kufu logo" className="h-6 w-auto shrink-0 md:h-7" src={brandLogoSrc} />
              <span className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                {brandName}
              </span>
            </Link>
          </div>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            <button className={navButtonClass} type="button" onClick={() => handleSectionNavigation('home')}>
              Home
            </button>
            <button className={navButtonClass} type="button" onClick={() => handleSectionNavigation('services')}>
              Services
            </button>
            <button className={navButtonClass} type="button" onClick={() => handleSectionNavigation('pricing')}>
              Pricing
            </button>
            <button className={navButtonClass} type="button" onClick={() => handleSectionNavigation('faq')}>
              FAQ
            </button>
            <button className={navButtonClass} type="button" onClick={() => handleSectionNavigation('contact')}>
              Contact
            </button>
            <button
              className={navButtonClass}
              type="button"
              onClick={() => handleSectionNavigation('case-studies')}
            >
              Case Studies
            </button>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark"
              to="/demo"
            >
              Request a Free Demo
            </Link>
            <div className="hidden md:block">
              <AuthActions
                avatarClassName="flex size-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-white transition-colors hover:border-primary hover:text-primary dark:border-slate-600 dark:bg-slate-950"
                loginClassName="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark dark:border-slate-700 dark:text-slate-100"
              />
            </div>
            <button
              aria-label="Open menu"
              className="p-2 text-slate-600 dark:text-slate-400 md:hidden"
              type="button"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </motion.nav>
    )
  }

  return (
    <motion.header
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-background-light/80 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-background-dark/80 lg:px-10"
      initial={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative flex h-16 items-center">
        <div className="flex items-center gap-2">
          <Link aria-label={`${brandName} Home`} className="flex items-center gap-2" to="/">
            <img alt="Kufu logo" className="h-6 w-auto shrink-0 md:h-7" src={brandLogoSrc} />
            <span className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
              {brandName}
            </span>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button aria-label="Open menu" className="text-slate-600 dark:text-slate-400" type="button">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </motion.header>
  )
}
