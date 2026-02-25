import { BotIcon } from "./BotIcon";

export function FooterSection() {
  return (
    <footer className="border-t border-white/[0.06] py-10 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg grad-bg flex items-center justify-center"><BotIcon size={14} /></div>
          <span className="font-display font-extrabold text-slate-100">Kufu</span>
          <span className="text-sm text-slate-600 ml-2">© 2025 All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          {(["Privacy", "Terms", "Support"] as const).map((l) => (
            <a key={l} href="#" className="text-sm text-slate-500 hover:text-indigo-300 transition-colors">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
