import Header from "@/components/header";
import Slider from "@/components/slider";
import CategoryBox from "@/components/category-box";
import PlacedStudents from "@/components/placed-students";
import Footer from "@/components/footer";
import coursesData from "@/coursesdata.json";
import homepageData from "@/homepage.json";
import carouselData from "@/carousal.json";
import Image from "next/image";

export default function Home() {
  const categories = coursesData.course_categorie.filter(
    (category) => category.slug !== "bootcamp-courses"
  );

  // Extract homepage slides from carousal.json
  const rawCarousal = (carouselData as any)?.carousal;
  const homepageSlides =
    rawCarousal?.position === "homepage"
      ? rawCarousal.carousal_slide_ids
      : Array.isArray(rawCarousal)
      ? rawCarousal.find((c: any) => c.position === "homepage")?.carousal_slide_ids || []
      : [];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="flex-1">
        {/* Homepage Heading & Subheading from homepage.json */}
        <section className="pt-12 pb-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight"
            dangerouslySetInnerHTML={{ __html: homepageData.heading }}
          />
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {homepageData.subheading}
          </p>
        </section>

        {/* Shared Slider Component */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Slider position="homepage" slides={homepageSlides} />
        </section>

        {/* Bootcamp course image (Responsive Desktop & Mobile) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="overflow-hidden rounded-xl">
            {/* Desktop Banner (sm screens and above) */}
            <Image
              src="/gallery/bootcamp.png"
              alt="Bootcamp"
              width={1920}
              height={1080}
              className="hidden sm:block w-full h-auto object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            {/* Mobile Banner (under sm screens) */}
            <Image
              src="/gallery/bootcamp-mobile.png"
              alt="Bootcamp"
              width={1024}
              height={1536}
              className="block sm:hidden w-full h-auto object-cover"
              sizes="100vw"
            />
          </div>
        </section>

        {/* Course Categories Sections */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {categories.map((category) => (
            <CategoryBox key={category.id} category={category} />
          ))}
        </div>

        {/* Placed Students Animated Section */}
        <PlacedStudents />
      </main>
      <Footer />
    </div>
  );
}