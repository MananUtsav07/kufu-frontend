import { motion } from 'framer-motion'

import { brandLogoSrc, brandName } from '../lib/brand'

type FooterProps = {
  variant: 'home' | 'demo'
}

export function Footer({ variant }: FooterProps) {
  if (variant === 'home') {
    return (
      <motion.footer
        className="border-t border-slate-800 py-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2">
              <img
                alt="Kufu logo"
                className="h-5 w-auto shrink-0"
                src={brandLogoSrc}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              <a className="hover:text-white" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-white" href="#">
                Terms of Service
              </a>
              <a className="hover:text-white" href="#">
                Cookies
              </a>
              <a className="hover:text-white" href="#">
                Security
              </a>
            </div>
            <div className="text-sm text-slate-500">&copy; 2026 {brandName} Inc. All rights reserved.</div>
          </div>
        </div>
      </motion.footer>
    )
  }

  return (
    <motion.footer
      className="mt-auto border-t border-slate-200 py-8 text-center dark:border-slate-800"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-xs text-slate-500">
        &copy; 2026 {brandName}. AI-powered customer inquiry automation.
      </p>
    </motion.footer>
  )
}
