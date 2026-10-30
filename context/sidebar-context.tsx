"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export type SidebarView = "nav" | "filter";

export interface NavItem {
  label: string;
  href: string;
}

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Training", href: "/training" },
  { label: "Development", href: "/development" },
];

interface SidebarContextType {
  isOpen: boolean;
  view: SidebarView;
  filterTitle: string;
  filterContent: React.ReactNode | null;
  navItems: NavItem[];
  openNav: () => void;
  openFilter: (content?: React.ReactNode, title?: string) => void;
  closeSidebar: () => void;
  toggleNav: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setView: (view: SidebarView) => void;
  setFilterContent: (content: React.ReactNode | null) => void;
  setFilterTitle: (title: string) => void;
  setNavItems: (items: NavItem[]) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
  initialNavItems,
}: {
  children: React.ReactNode;
  initialNavItems?: NavItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<SidebarView>("nav");
  const [filterTitle, setFilterTitle] = useState("Filters");
  const [filterContent, setFilterContent] = useState<React.ReactNode | null>(null);
  const [navItems, setNavItemsState] = useState<NavItem[]>(
    initialNavItems && initialNavItems.length > 0
      ? initialNavItems
      : DEFAULT_NAV_ITEMS
  );

  const openNav = useCallback(() => {
    setView("nav");
    setIsOpen(true);
  }, []);

  const openFilter = useCallback((content?: React.ReactNode, title?: string) => {
    if (content !== undefined) {
      setFilterContent(content);
    }
    if (title) {
      setFilterTitle(title);
    } else {
      setFilterTitle("Filters");
    }
    setView("filter");
    setIsOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleNav = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        setView("nav");
        return true;
      }
      return false;
    });
  }, []);

  const setNavItems = useCallback((items: NavItem[]) => {
    if (Array.isArray(items) && items.length > 0) {
      setNavItemsState(items);
    }
  }, []);

  // Support global custom events
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ view?: SidebarView; title?: string }>;
      if (customEvent.detail?.view === "filter") {
        openFilter(undefined, customEvent.detail?.title);
      } else {
        openNav();
      }
    };
    window.addEventListener("open-sidebar", handleOpen);
    return () => {
      window.removeEventListener("open-sidebar", handleOpen);
    };
  }, [openNav, openFilter]);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        view,
        filterTitle,
        filterContent,
        navItems,
        openNav,
        openFilter,
        closeSidebar,
        toggleNav,
        setIsOpen,
        setView,
        setFilterContent,
        setFilterTitle,
        setNavItems,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
