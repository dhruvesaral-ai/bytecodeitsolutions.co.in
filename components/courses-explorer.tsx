"use client";

import React, { useState, useMemo } from "react";
import { Search, X, SlidersHorizontal, CheckCircle2, RotateCcw } from "lucide-react";
import CourseCard from "@/components/cards";
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

  return (
    <section className="w-full space-y-8" aria-label="Course catalog">
      {/* Search and Main Controls */}
      <div className="flex flex-col gap-4">
        {/* Top Controls Row: Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course name, technology (e.g. AI, React, Java, Python)..."
              className="w-full h-11 pl-10 pr-9 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#1550A5] focus:border-transparent transition-colors"
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

          {/* Right Controls: Placement Filter & Sort */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
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

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
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
