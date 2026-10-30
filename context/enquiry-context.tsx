"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { EnquiryMode } from "@/components/enquiry-modal";

interface EnquiryContextType {
  isOpen: boolean;
  mode?: EnquiryMode;
  openEnquiry: (mode?: EnquiryMode) => void;
  closeEnquiry: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<EnquiryMode | undefined>(undefined);

  const openEnquiry = useCallback((newMode?: EnquiryMode) => {
    if (newMode) setMode(newMode);
    setIsOpen(true);
  }, []);

  const closeEnquiry = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Listen to custom event so any component can trigger the modal
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode?: EnquiryMode }>;
      openEnquiry(customEvent.detail?.mode);
    };
    window.addEventListener("open-enquiry", handleOpen);
    return () => {
      window.removeEventListener("open-enquiry", handleOpen);
    };
  }, [openEnquiry]);

  return (
    <EnquiryContext.Provider
      value={{
        isOpen,
        mode,
        openEnquiry,
        closeEnquiry,
        setIsOpen,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    return {
      isOpen: false,
      mode: undefined,
      openEnquiry: (mode?: EnquiryMode) => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("open-enquiry", { detail: { mode } })
          );
        }
      },
      closeEnquiry: () => {},
      setIsOpen: () => {},
    };
  }
  return context;
}

