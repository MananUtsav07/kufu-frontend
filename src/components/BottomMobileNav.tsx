import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

type BottomMobileNavProps = {
  variant: 'demo' | 'case-studies' | 'contact'
}

export function BottomMobileNav({ variant }: BottomMobileNavProps) {
  if (variant === 'demo') {
    return (
      <motion.div
        className="sticky bottom-0 z-50 flex gap-2 border-t border-slate-800 bg-slate-900/90 px-4 pb-4 pt-3 backdrop-blur-lg md:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link className="flex flex-1 flex-col items-center gap-1 text-primary" to="/">
          <span className="material-symbols-outlined">home</span>
          <p className="text-[10px] font-medium leading-normal">Home</p>
        </Link>
        <Link className="flex flex-1 flex-col items-center gap-1 text-slate-500" to="/demo">
          <span className="material-symbols-outlined">group</span>
          <p className="text-[10px] font-medium leading-normal">Leads</p>
        </Link>
        <Link className="flex flex-1 flex-col items-center gap-1 text-slate-500" to="/case-studies">
          <span className="material-symbols-outlined">analytics</span>
          <p className="text-[10px] font-medium leading-normal">Reports</p>
        </Link>
        <Link className="flex flex-1 flex-col items-center gap-1 text-slate-500" to="/contact">
          <span className="material-symbols-outlined">settings</span>
          <p className="text-[10px] font-medium leading-normal">Settings</p>
        </Link>
      </motion.div>
    )
  }

  if (variant === 'case-studies') {
    return (
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-slate-100 dark:border-primary/20 dark:bg-background-dark"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex h-16 max-w-5xl">
          <Link
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
            to="/"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Home</span>
          </Link>
          <Link className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" to="/case-studies">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              description
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Cases</span>
          </Link>
          <Link
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
            to="/demo"
          >
            <span className="material-symbols-outlined">bar_chart</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Stats</span>
          </Link>
          <Link
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
            to="/contact"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Profile</span>
          </Link>
        </div>
      </motion.nav>
    )
  }

  return (
    <>
      <motion.nav
        className="fixed bottom-0 z-50 w-full border-t border-slate-200 bg-background-light dark:border-slate-800 dark:bg-background-dark"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex max-w-5xl px-4 pb-6 pt-3">
          <Link
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 transition-colors hover:text-primary dark:text-slate-500"
            to="/"
          >
            <span className="material-symbols-outlined">home</span>
          </Link>
          <Link className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" to="/contact">
            <span className="material-symbols-outlined">chat_bubble</span>
          </Link>
          <Link
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 transition-colors hover:text-primary dark:text-slate-500"
            to="/case-studies"
          >
            <span className="material-symbols-outlined">group</span>
          </Link>
          <Link
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 transition-colors hover:text-primary dark:text-slate-500"
            to="/demo"
          >
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>
      </motion.nav>
      <div className="h-20" />
    </>
  )
}
