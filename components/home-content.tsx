import Slider from "@/components/slider";
import CategoryBox from "@/components/category-box";
import { carousalSliderService } from "@/services/CarousalSliderService";
import { courseService } from "@/services/CourseService";
import { successStoriesService } from "@/services/SuccessStoriesService";
import SuccessStories from "@/components/success-stories";
import PlacementGuaranteedSection from "@/components/placement-guaranteed-section";

export default async function HomeContent() {
  const [categoriesData, courses, carousals, successStoryVideoIds] = await Promise.all([
    courseService.getCourseCategories(),
    courseService.getCourses(),
    carousalSliderService.getCarousals(),
    successStoriesService.getVideoIds(),
  ]);

  const placementCategory = categoriesData.find(
    (category) =>
      category.slug === "100%-placement-opportunity-guaranteed-courses" ||
      category.slug === "bootcamp-courses"
  );

  const placementCourses = courses.filter(
    (course) =>
      (course.isPlacementGurranted ||
        (placementCategory && course.courseCategorieId === placementCategory.id)) &&
      course.status === "active"
  );

  const categories = categoriesData.filter(
    (category) =>
      category.slug !== "bootcamp-courses" &&
      category.slug !== "100%-placement-opportunity-guaranteed-courses"
  );

  const homepageCarousel = carousals.find(
    (carousel) => carousel.position === "homepage"
  );
  const homepageSlides = homepageCarousel
    ? await Promise.all(
        homepageCarousel.carousalSlideIds.map((id) =>
          carousalSliderService.getCarouselSlide(id)
        )
      )
    : [];
  homepageSlides.sort((a, b) => a.order - b.order);

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Slider slides={homepageSlides} />
      </section>

      {/* Student Video Success Stories Full-Width Marquee */}
      <SuccessStories videoIds={successStoryVideoIds} />

      {/* Placement Guaranteed Courses With Stacking Cards Effect */}
      <PlacementGuaranteedSection courses={placementCourses} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {categories.map((category) => (
          <CategoryBox
            key={category.id}
            category={category}
            courses={courses.filter(
              (course) =>
                course.courseCategorieId === category.id &&
                course.status === "active"
            )}
          />
        ))}
      </div>
    </>
  );
}
