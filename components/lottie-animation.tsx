"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

interface LottieAnimationProps {
  animationPath?: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  as?: "div" | "span";
}

export default function LottieAnimation({
  animationPath = "/lottiefiles/cat-crying.json",
  className = "",
  loop = true,
  autoplay = true,
  as = "div",
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    let isMounted = true;

    import("lottie-web").then((lottieModule) => {
      const lottie = lottieModule.default || lottieModule;
      if (!isMounted || !containerRef.current) return;

      if (animRef.current) {
        animRef.current.destroy();
      }

      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop,
        autoplay,
        path: animationPath,
      });
    });

    return () => {
      isMounted = false;
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [animationPath, loop, autoplay]);

  const Tag = as;

  return (
    <Tag
      ref={containerRef as any}
      className={className}
      aria-hidden="true"
    />
  );
}
