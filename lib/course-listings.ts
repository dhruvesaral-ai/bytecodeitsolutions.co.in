import type { Course, CourseCategory } from "@/services/CourseService";

/** Categories hidden from marketing course listings (home + /courses). */
export const HIDDEN_LISTING_CATEGORY_SLUGS = new Set<string>([
  "bootcamp-courses",
  "100%-placement-opportunity-guaranteed-courses",
  "bsep",
]);

export function isHiddenListingCategory(category: Pick<CourseCategory, "slug">): boolean {
  return HIDDEN_LISTING_CATEGORY_SLUGS.has(category.slug);
}

export function hiddenListingCategoryIds(
  categories: CourseCategory[]
): Set<string> {
  return new Set(
    categories.filter(isHiddenListingCategory).map((category) => category.id)
  );
}

export function filterCategoriesForListing(
  categories: CourseCategory[]
): CourseCategory[] {
  return categories.filter((category) => !isHiddenListingCategory(category));
}

export function filterCoursesForListing(
  courses: Course[],
  categories: CourseCategory[]
): Course[] {
  const hiddenIds = hiddenListingCategoryIds(categories);
  return courses.filter((course) => !hiddenIds.has(course.courseCategorieId));
}