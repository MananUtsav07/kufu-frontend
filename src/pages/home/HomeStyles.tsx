export function HomeStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800;900&display=swap');
      body { font-family: 'DM Sans', sans-serif; }
      .font-display { font-family: 'Syne', sans-serif; }
      .grad-text {
        background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 50%, #818cf8 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      }
      .grad-bg { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
      @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
      @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.4)} 70%{box-shadow:0 0 0 10px transparent} 100%{box-shadow:0 0 0 0 transparent} }
      .float-anim { animation: float 5s ease-in-out infinite; }
      .dot-blink   { animation: blink 1.2s ease-in-out infinite; }
      .dot-blink-2 { animation: blink 1.2s ease-in-out 0.2s infinite; }
      .dot-blink-3 { animation: blink 1.2s ease-in-out 0.4s infinite; }
      .badge-shimmer { background: linear-gradient(135deg, #6366f1, #8b5cf6, #6366f1); background-size: 200% auto; animation: shimmer 3s linear infinite; }
      .pulse-dot { animation: pulse-ring 2s infinite; }
      .hero-enter { animation: hero-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
      @keyframes hero-up { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    `}</style>
  );
}
