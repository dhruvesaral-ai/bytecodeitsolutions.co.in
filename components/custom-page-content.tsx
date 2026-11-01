"use client";

import { useEffect, useRef } from "react";

interface CustomPageContentProps {
  content?: string | null;
  className?: string;
}

/**
 * CustomPageContent safely mounts dynamic HTML, applies embedded <style> tags (CSS),
 * and activates embedded <script> tags (JS) by re-creating DOM script elements so that
 * both inline and external scripts execute in order.
 */
export default function CustomPageContent({
  content,
  className = "",
}: CustomPageContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !content) return;

    try {
      const scripts = Array.from(container.querySelectorAll("script"));

      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");

        // Copy all attributes (src, type, async, defer, id, class, etc.)
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });

        // Ensure sequential execution unless explicitly marked async
        if (!oldScript.hasAttribute("async")) {
          newScript.async = false;
        }

        // Copy script content
        newScript.text = oldScript.text || oldScript.textContent || "";

        // Replace old inactive script with new executable script
        if (oldScript.parentNode) {
          oldScript.parentNode.replaceChild(newScript, oldScript);
        }
      });
    } catch (err) {
      console.error("Error executing custom page scripts:", err);
    }
  }, [content]);

  if (!content) return null;

  return (
    <div
      ref={containerRef}
      className={`custom-page-content w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

