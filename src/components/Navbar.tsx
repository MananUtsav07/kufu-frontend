import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";
import { brandName } from "../lib/brand";
import { scrollToId } from "../lib/scrollToId";
import { NavbarLinks } from "./NavbarLinks";

type NavbarProps = {
  page: "home" | "demo" | "case-studies" | "contact";
};

type AuthActionsProps = {
  isDemo: boolean;
};

function AuthActions({ isDemo }: AuthActionsProps) {
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
    return (
      <div className="hidden md:flex items-center h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        to="/login"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.01em",
        }}
        className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5"
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
        style={{
          background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
          boxShadow: "0 0 0 2px rgba(99,102,241,0.15)",
        }}
        className={`flex items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-105 hover:shadow-lg ${
          isDemo ? "size-9" : "size-10"
        }`}
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
            style={{
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            }}
            className="absolute right-0 top-full z-50 mt-3 w-48 rounded-2xl border border-slate-100 bg-white/95 p-1.5 dark:border-slate-700/60 dark:bg-slate-900/95 backdrop-blur-xl"
          >
            <div className="px-3 py-2 mb-1 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                {user.email}
              </p>
            </div>
            <Link
              to="/demo"
              role="menuitem"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
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
              className="flex items-center gap-2 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
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
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar({ page }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isDemo = page === "demo";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <>
      {/* CSS variables & keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

        :root {
          --accent: #6366f1;
          --accent-2: #8b5cf6;
          --accent-glow: rgba(99,102,241,0.18);
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .nav-link-pill {
          position: relative;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          transition: color 0.2s ease;
          padding: 0.25rem 0;
          letter-spacing: 0.01em;
        }

        .nav-link-pill::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
          transition: width 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          border-radius: 99px;
        }

        .nav-link-pill:hover {
          color: var(--accent);
        }

        .nav-link-pill:hover::after {
          width: 100%;
        }

        .dark .nav-link-pill {
          color: #94a3b8;
        }

        .cta-btn {
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
          color: white;
          border-radius: 9999px;
          padding: 0.55rem 1.35rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 12px var(--accent-glow);
        }

        .cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px var(--accent-glow);
        }

        .cta-btn:hover::before {
          opacity: 1;
        }

        .cta-btn:active {
          transform: translateY(0);
        }

        .badge-new {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 1px 6px;
          border-radius: 99px;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
          color: white;
          line-height: 1.6;
          position: relative;
          top: -1px;
        }
      `}</style>

      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: scrolled
            ? "0 1px 0 rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)"
            : "0 1px 0 rgba(0,0,0,0.04)",
          transition: "box-shadow 0.3s ease",
        }}
        className={`sticky top-0 z-50 w-full px-6 lg:px-10 backdrop-blur-xl transition-colors duration-300 ${
          isDemo
            ? "bg-white/60 dark:bg-slate-950/60 border-b border-slate-100/80 dark:border-slate-800/60"
            : scrolled
              ? "bg-white/90 dark:bg-slate-950/90 border-b border-slate-100 dark:border-slate-800"
              : "bg-white/70 dark:bg-slate-950/70 border-b border-transparent"
        }`}
      >
        {/* 3-column grid: brand | nav | actions — prevents overlap */}
        <div
          className="grid h-[62px] w-full items-center max-w-7xl mx-auto"
          style={{ gridTemplateColumns: "1fr auto 1fr" }}
        >
          {/* Left: Brand */}
          <Link
            to="/"
            aria-label={`${brandName} Home`}
            className="flex items-center gap-2.5 shrink-0 justify-self-start"
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5"
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-2))",
                  boxShadow: "0 2px 10px var(--accent-glow)",
                }}
                className="relative flex items-center justify-center size-8 rounded-xl shrink-0"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="8"
                    width="18"
                    height="13"
                    rx="3"
                    fill="white"
                    fillOpacity="0.9"
                  />
                  <circle cx="9" cy="14" r="1.5" fill="var(--accent)" />
                  <circle cx="15" cy="14" r="1.5" fill="var(--accent)" />
                  <path
                    d="M9 18h6"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 8V5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="12"
                    cy="4"
                    r="1.5"
                    fill="white"
                    fillOpacity="0.7"
                  />
                </svg>
              </div>

              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.125rem",
                  letterSpacing: "-0.02em",
                  background:
                    "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                className="hidden sm:block dark:![-webkit-text-fill-color:#f1f5f9]"
              >
                {brandName}
              </span>
            </motion.div>
          </Link>

          {/* Center: Nav Links — naturally centered by grid */}
          <NavbarLinks
            className="hidden items-center gap-6 md:flex"
            buttonClassName="nav-link-pill bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm whitespace-nowrap"
            onCaseStudiesNavigate={handleCaseStudiesNavigation}
            onNavigate={handleSectionNavigation}
          />

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 justify-self-end">
            <Link
              to="/demo"
              className="cta-btn hidden md:inline-flex items-center gap-2 whitespace-nowrap"
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

            <div className="hidden md:block h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

            <AuthActions isDemo={isDemo} />
          </div>
        </div>
      </motion.nav>
    </>
  );
}
