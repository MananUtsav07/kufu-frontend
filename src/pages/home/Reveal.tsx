import { useEffect, useRef, useState } from "react";
import type { RevealHookReturn, RevealProps } from "./HomeTypes";

function useScrollReveal(): RevealHookReturn {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const [ref, visible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
