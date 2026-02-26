/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../lib/auth-context";
import { BrandBotIcon } from "./BrandBotIcon";
import { brandName } from "../lib/brand";
import { scrollToId } from "../lib/scrollToId";
import { NavbarLinks } from "./NavbarLinks";

type NavbarProps = {
  page: "home" | "demo" | "case-studies" | "contact";
};

function AuthActions() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current) return;
      const target = event.target;
      if (target instanceof Node && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  if (loading) {
    return <div className="h-9 w-9 rounded-full bg-slate-800 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 border border-white/10 px-3 md:px-4 py-1.5 rounded-full hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all"
      >
        Login
      </Link>
    );
  }

  const avatarInitial = (user.email?.charAt(0) ?? "?").toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } finally {
      setIsMenuOpen(false);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        onClick={() => setIsMenuOpen((v) => !v)}
        className="w-9 h-9 rounded-full grad-bg flex items-center justify-center text-white text-sm font-bold shadow-[0_0_0_2px_rgba(99,102,241,0.25)] hover:scale-105 transition-transform overflow-hidden"
      >
        <span className="text-sm font-semibold">{avatarInitial}</span>
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-white/[0.08] bg-slate-900/95 backdrop-blur-xl p-1.5 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          >
            <div className="px-3 py-2 mb-1 border-b border-white/[0.07]">
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <Link
              to="/dashboard/profile"
              role="menuitem"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profile
            </Link>
            <Link
              to="/dashboard"
              role="menuitem"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              Dashboard
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex items-center gap-2 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar({ page: _page }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSectionNavigation = (id: string) => {
    if (location.pathname === "/") {
      scrollToId(id);
      return;
    }
    navigate("/", { state: { scrollTo: id } });
  };

  const handleCaseStudiesNavigation = () => {
    if (location.pathname === "/case-studies") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate("/case-studies");
  };

  const handleMobileNavigate = (id: string) => {
    setIsMobileMenuOpen(false);
    handleSectionNavigation(id);
  };

  const handleMobileCaseStudiesNavigate = () => {
    setIsMobileMenuOpen(false);
    handleCaseStudiesNavigation();
  };

  return (
    <>
      {/* CSS variables & keyframes */}
      <style>{`
        .nav-link {
          position: relative;
          transition: color 0.2s;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          transition: width 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          border-radius: 99px;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .grad-bg { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
      `}</style>

      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 w-full px-6 lg:px-10 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/90 shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-white/[0.06]"
            : "bg-slate-950/60 border-b border-transparent"
        }`}
      >
        {/* 3-column grid: brand | nav | actions — prevents overlap */}
        <div className="flex h-[62px] w-full items-center justify-between max-w-7xl mx-auto md:grid md:[grid-template-columns:1fr_auto_1fr]">
          {/* Left: Brand */}
          <Link
            to="/"
            aria-label={`${brandName} Home`}
            className="flex items-center gap-2.5 justify-self-start group"
          >
            <motion.div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl grad-bg flex items-center justify-center flex-shrink-0 shadow-[0_2px_12px_rgba(99,102,241,0.35)] group-hover:scale-105 transition-transform"
              >
                <BrandBotIcon size={18} />
              </div>

              <span
                className="font-display font-extrabold text-[1.1rem] tracking-tight text-slate-100"
              >
                {brandName}
              </span>
            </motion.div>
          </Link>

          {/* Center: Nav Links — naturally centered by grid */}
          <NavbarLinks
            className="hidden items-center gap-6 md:flex"
            buttonClassName="nav-link bg-transparent p-0 text-sm font-medium text-slate-400 hover:text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm whitespace-nowrap"
            onCaseStudiesNavigate={handleCaseStudiesNavigation}
            onNavigate={handleSectionNavigation}
          />

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 justify-self-end">
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="md:hidden w-9 h-9 rounded-xl border border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.08] transition-colors flex items-center justify-center"
            >
              {isMobileMenuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              )}
            </button>

            <Link
              to="/demo"
              className="hidden md:inline-flex items-center gap-2 grad-bg text-white text-sm font-bold px-5 py-2 rounded-full shadow-[0_2px_14px_rgba(99,102,241,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(99,102,241,0.4)] transition-all whitespace-nowrap"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90 shrink-0"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Get a Free Demo
            </Link>

            <div className="hidden md:block w-px h-5 bg-white/10" />

            <AuthActions />
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden pb-4"
            >
              <div className="max-w-7xl mx-auto rounded-2xl border border-white/[0.08] bg-slate-900/95 backdrop-blur-xl p-3">
                <NavbarLinks
                  className="flex flex-col"
                  buttonClassName="nav-link bg-transparent text-left w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-indigo-300 hover:bg-white/[0.05] transition-colors"
                  onCaseStudiesNavigate={handleMobileCaseStudiesNavigate}
                  onNavigate={handleMobileNavigate}
                />
                <div className="mt-2 pt-3 border-t border-white/[0.07] flex flex-col gap-2">
                  <Link
                    to="/demo"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 grad-bg text-white text-sm font-bold px-4 py-2.5 rounded-xl"
                  >
                    Get a Free Demo
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
