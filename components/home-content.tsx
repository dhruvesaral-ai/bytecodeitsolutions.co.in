import Slider from "@/components/slider";
import CategoryBox from "@/components/category-box";
import { carousalSliderService } from "@/services/CarousalSliderService";
import { courseService } from "@/services/CourseService";
import { successStoriesService } from "@/services/SuccessStoriesService";
import SuccessStories from "@/components/success-stories";

export default async function HomeContent() {
  const [categoriesData, courses, carousals, successStoryVideoIds] = await Promise.all([
    courseService.getCourseCategories(),
    courseService.getCourses(),
    carousalSliderService.getCarousals(),
    successStoriesService.getVideoIds(),
  ]);
  const categories = categoriesData.filter(
    (category) => category.slug !== "bootcamp-courses"
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
