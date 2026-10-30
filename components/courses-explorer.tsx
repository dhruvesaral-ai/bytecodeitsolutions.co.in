"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  CheckCircle2,
  RotateCcw,
  ArrowUpDown,
} from "lucide-react";
import CourseCard from "@/components/cards";
import { useSidebar } from "@/context/sidebar-context";
import type { Course, CourseCategory } from "@/services/CourseService";

interface CoursesExplorerProps {
  initialCourses: Course[];
  categories: CourseCategory[];
}

export default function CoursesExplorer({
  initialCourses,
  categories,
}: CoursesExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [placementOnly, setPlacementOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const {
    isOpen: sidebarOpen,
    view: sidebarView,
    openFilter,
    closeSidebar,
    setFilterContent,
  } = useSidebar();
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState<number>(100);

  // Measure exact sticky header height so search bar sticks cleanly below it without overlap
  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerEl =
        document.getElementById("main-sticky-header") ||
        (document.querySelector(".sticky.top-0") as HTMLElement | null);
      if (headerEl) {
        setHeaderHeight(headerEl.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    const headerEl =
      document.getElementById("main-sticky-header") ||
      (document.querySelector(".sticky.top-0") as HTMLElement | null);
    let resizeObserver: ResizeObserver | null = null;
    if (headerEl && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateHeaderHeight();
      });
      resizeObserver.observe(headerEl);
    }

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  // Extract popular tags across courses
  const popularTags = useMemo(() => {
    const tagCountMap: Record<string, number> = {};
    initialCourses.forEach((c) => {
      c.technologyTags.forEach((tag) => {
        tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [initialCourses]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialCourses.length };
    initialCourses.forEach((c) => {
      if (c.courseCategorieId) {
        counts[c.courseCategorieId] = (counts[c.courseCategorieId] || 0) + 1;
      }
    });
    return counts;
  }, [initialCourses]);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let result = [...initialCourses];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.longDescription.toLowerCase().includes(q) ||
          c.technologyTags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategoryId !== "all") {
      result = result.filter(
        (c) => c.courseCategorieId === selectedCategoryId
      );
    }

    // Technology tag filter
    if (selectedTag !== "all") {
      result = result.filter((c) =>
        c.technologyTags.some(
          (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
        )
      );
    }

    // Placement guaranteed filter
    if (placementOnly) {
      result = result.filter((c) => c.isPlacementGurranted);
    }

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-asc":
        result.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // "featured": keep default order
        break;
    }

    return result;
  }, [
    initialCourses,
    searchQuery,
    selectedCategoryId,
    selectedTag,
    placementOnly,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategoryId !== "all" ||
    selectedTag !== "all" ||
    placementOnly ||
    sortBy !== "featured";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId("all");
    setSelectedTag("all");
    setPlacementOnly(false);
    setSortBy("featured");
  };

  useEffect(() => {
    if (!sortMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSortMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sortMenuOpen]);

  const selectedFilterCount =
    Number(selectedCategoryId !== "all") +
    Number(selectedTag !== "all") +
    Number(placementOnly);

  const filterControlsNode = (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
            Course category
          </legend>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setSelectedCategoryId("all")}
              aria-pressed={selectedCategoryId === "all"}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-sm cursor-pointer ${
                selectedCategoryId === "all"
                  ? "bg-blue-50 font-semibold text-[#1550A5] dark:bg-blue-950/40 dark:text-blue-300"
                  : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              }`}
            >
              All Courses
              <span>{categoryCounts.all || 0}</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                aria-pressed={selectedCategoryId === category.id}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-sm cursor-pointer ${
                  selectedCategoryId === category.id
                    ? "bg-blue-50 font-semibold text-[#1550A5] dark:bg-blue-950/40 dark:text-blue-300"
                    : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                {category.name}
                <span>{categoryCounts[category.id] || 0}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {popularTags.length > 0 && (
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
              Technologies
            </legend>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedTag("all")}
                aria-pressed={selectedTag === "all"}
                className={`rounded-md px-3 py-1.5 text-sm cursor-pointer ${
                  selectedTag === "all"
                    ? "bg-[#1550A5] font-semibold text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
              >
                All Tech
              </button>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setSelectedTag((selected) =>
                      selected.toLowerCase() === tag.toLowerCase()
                        ? "all"
                        : tag
                    )
                  }
                  aria-pressed={
                    selectedTag.toLowerCase() === tag.toLowerCase()
                  }
                  className={`rounded-md px-3 py-1.5 text-sm cursor-pointer ${
                    selectedTag.toLowerCase() === tag.toLowerCase()
                      ? "bg-[#1550A5] font-semibold text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <label className="flex cursor-pointer items-center gap-3 rounded-md border border-neutral-200 p-3 text-sm font-medium text-neutral-800 dark:border-neutral-800 dark:text-neutral-200">
          <input
            type="checkbox"
            checked={placementOnly}
            onChange={(event) => setPlacementOnly(event.target.checked)}
            className="size-4 accent-[#1550A5]"
          />
          Placement Assured
        </label>
      </div>

      <div className="flex gap-3 border-t border-neutral-200 p-4 dark:border-neutral-800 shrink-0">
        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-300 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
        >
          <RotateCcw className="size-4" />
          Reset
        </button>
        <button
          type="button"
          onClick={closeSidebar}
          className="h-11 flex-1 rounded-lg bg-[#1550A5] text-sm font-semibold text-white hover:bg-[#124288] cursor-pointer"
        >
          Show {filteredCourses.length}{" "}
          {filteredCourses.length === 1 ? "course" : "courses"}
        </button>
      </div>
    </div>
  );

  // Synchronize filter content to the unified sidebar
  useEffect(() => {
    if (sidebarOpen && sidebarView === "filter") {
      setFilterContent(filterControlsNode);
    }
  }, [
    sidebarOpen,
    sidebarView,
    selectedCategoryId,
    selectedTag,
    placementOnly,
    filteredCourses.length,
    categoryCounts,
    categories,
    popularTags,
    setFilterContent,
  ]);

  useEffect(() => {
    return () => {
      setFilterContent(null);
    };
  }, [setFilterContent]);

  const sortOptions = [
    { value: "featured", label: "Featured / Recommended" },
    { value: "rating", label: "Highest Rated" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name", label: "Alphabetical (A-Z)" },
  ];

  return (
    <section className="w-full space-y-8" aria-label="Course catalog">
      {/* Search and Main Controls */}
      {/* Sticky Search and Main Controls Bar (Mobile & Desktop) */}
      <div
        className="sticky top-[98px] sm:top-[100px] z-30 -mx-4 border-b border-neutral-200/80 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-neutral-800/80 dark:bg-black/95 sm:mx-0 sm:rounded-xl sm:border sm:border-neutral-200 sm:px-4 sm:py-3.5 sm:shadow-xs dark:sm:border-neutral-800"
        style={{ top: `${headerHeight}px` }}
      >
        {/* Top Controls Row: Search Bar & Sort Dropdown */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xl sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses or technologies..."
              className="h-11 w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-9 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1550A5] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              aria-label="Search courses"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter and Sort Controls */}
          <div className="flex w-full items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={() => openFilter(filterControlsNode, "Filters")}
              aria-haspopup="dialog"
              aria-expanded={sidebarOpen && sidebarView === "filter"}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
            >
              <SlidersHorizontal className="size-4" />
              Filter
              {selectedFilterCount > 0 && (
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#1550A5] text-xs text-white">
                  {selectedFilterCount}
                </span>
              )}
            </button>

            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setSortMenuOpen((open) => !open)}
                aria-expanded={sortMenuOpen}
                aria-haspopup="listbox"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <ArrowUpDown className="size-4" />
                Sort
              </button>
              {sortMenuOpen && (
                <div
                  className="absolute right-0 top-full z-40 mt-2 w-full min-w-52 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
                  role="listbox"
                  aria-label="Sort courses"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={sortBy === option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setSortMenuOpen(false);
                      }}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                        sortBy === option.value
                          ? "bg-neutral-100 font-semibold text-[#1550A5] dark:bg-neutral-800 dark:text-blue-400"
                          : "text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Placement Filter & Sort */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Placement Assured Toggle */}
            <button
              type="button"
              onClick={() => setPlacementOnly((prev) => !prev)}
              className={`h-11 px-3.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                placementOnly
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-300"
                  : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
              aria-pressed={placementOnly}
            >
              <CheckCircle2
                className={`size-3.5 ${
                  placementOnly ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400"
                }`}
              />
              <span>Placement Assured</span>
            </button>

            {/* Sort Selector */}
            <div className="relative">
              <label htmlFor="course-sort" className="sr-only">
                Sort courses by
              </label>
              <select
                id="course-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 pl-3 pr-8 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#1550A5] focus:border-transparent cursor-pointer"
              >
                <option value="featured">Featured / Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Category Tabs & Technology Filter Chips */}
      <div className="hidden flex-col gap-3 md:flex">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-3 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setSelectedCategoryId("all")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedCategoryId === "all"
                ? "bg-[#1550A5] text-white"
                : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            }`}
          >
            All Courses ({categoryCounts.all || 0})
          </button>

          {categories.map((category) => {
            const count = categoryCounts[category.id] || 0;
            const isSelected = selectedCategoryId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#1550A5] text-white"
                    : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Technology Filter Chips */}
        {popularTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-neutral-500 dark:text-neutral-400 mr-1 flex items-center gap-1 font-medium">
              <SlidersHorizontal className="size-3" />
              Technologies:
            </span>

            <button
              type="button"
              onClick={() => setSelectedTag("all")}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                selectedTag === "all"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              All Tech
            </button>

            {popularTags.map((tag) => {
              const isSelected =
                selectedTag.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setSelectedTag((prev) =>
                      prev.toLowerCase() === tag.toLowerCase() ? "all" : tag
                    )
                  }
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#1550A5] text-white font-semibold"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>



      {/* Results Bar */}
      <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
        <p>
          Showing <span className="font-semibold text-neutral-900 dark:text-white">{filteredCourses.length}</span>{" "}
          {filteredCourses.length === 1 ? "course" : "courses"}
          {initialCourses.length !== filteredCourses.length && (
            <span> of {initialCourses.length} total</span>
          )}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-medium text-[#1550A5] dark:text-blue-400 hover:underline cursor-pointer"
          >
            <RotateCcw className="size-3" />
            Reset all filters
          </button>
        )}
      </div>

      {/* Courses Grid or Empty State */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 py-16 px-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 mb-3">
            <Search className="size-6" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
            No courses found
          </h3>
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
            We could not find any courses matching your search or active filters. Try refining your keywords or clear your active filters.
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#1550A5] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#124288] cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              Reset all filters
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
