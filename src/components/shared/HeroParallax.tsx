"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps children with a parallax container.
 * Children with `.parallax-slow`, `.parallax-med`, `.parallax-fast`
 * classes will move at different speeds on scroll.
 */
export default function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          document.documentElement.style.setProperty("--scroll-y", String(scrollY));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className="relative overflow-hidden">
      {children}
    </div>
  );
}
