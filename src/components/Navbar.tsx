import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthProvider'
import { brandLogoSrc, brandName } from '../lib/brand'
import { scrollToId } from '../lib/scrollToId'
import { NavbarLinks } from './NavbarLinks'
import '../styles/components/navbar.css'

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
      <button className={loginClassName} disabled type="button">
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
  const isMainNavigation = page === 'home' || page === 'demo' || page === 'case-studies' || page === 'contact'
  const isDemoNavigation = page === 'demo'

  const handleSectionNavigation = (id: string) => {
    if (location.pathname === '/') {
      scrollToId(id)
      return
    }

    navigate('/', { state: { scrollTo: id } })
  }

  if (isMainNavigation) {
    return (
      <motion.nav
        animate={{ opacity: 1, y: 0 }}
        className={isDemoNavigation ? 'kufu-navbar-shell-demo' : 'kufu-navbar-shell'}
        initial={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="kufu-navbar-row">
          <div className="kufu-navbar-brand">
            <Link aria-label={`${brandName} Home`} className="kufu-navbar-brand-link" to="/">
              <img alt="Kufu logo" className="kufu-navbar-logo" src={brandLogoSrc} />
              <span className="kufu-navbar-brand-text">{brandName}</span>
            </Link>
          </div>

          <NavbarLinks
            className="kufu-navbar-links"
            buttonClassName={navButtonClass}
            onNavigate={handleSectionNavigation}
          />

          <div className="kufu-navbar-actions">
            <Link className={isDemoNavigation ? 'kufu-navbar-cta-demo' : 'kufu-navbar-cta'} to="/demo">
              Request a Free Demo
            </Link>
            <div className="hidden md:block">
              <AuthActions
                avatarClassName={isDemoNavigation ? 'kufu-navbar-avatar-demo' : 'kufu-navbar-avatar'}
                loginClassName={isDemoNavigation ? 'kufu-navbar-login-demo' : 'kufu-navbar-login'}
              />
            </div>
            {isDemoNavigation ? (
              <button aria-label="Open menu" className="kufu-navbar-mobile-menu" type="button">
                <span className="material-symbols-outlined">menu</span>
              </button>
            ) : null}
          </div>
        </div>
      </motion.nav>
    )
  }

  return (
    <motion.header
      animate={{ opacity: 1, y: 0 }}
      className="kufu-navbar-shell"
      initial={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="kufu-navbar-row">
        <div className="kufu-navbar-brand">
          <Link aria-label={`${brandName} Home`} className="kufu-navbar-brand-link" to="/">
            <img alt="Kufu logo" className="kufu-navbar-logo" src={brandLogoSrc} />
            <span className="kufu-navbar-brand-text">{brandName}</span>
          </Link>
        </div>

        <div className="kufu-navbar-actions">
          <button aria-label="Open menu" className="kufu-navbar-mobile-menu-icon" type="button">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </motion.header>
  )
}

