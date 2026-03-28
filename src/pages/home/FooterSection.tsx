import fullLogo from "../../assets/fulllogo.svg";

export function FooterSection() {
  return (
    <footer className="border-t border-white/[0.06] py-10 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <img src={fullLogo} alt="Kufu logo" className="h-9 w-auto object-contain" />
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
