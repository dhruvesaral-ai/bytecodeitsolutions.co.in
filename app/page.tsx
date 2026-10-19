import Header from "@/components/header";
import Slider from "@/components/slider";
import CategoryBox from "@/components/category-box";
import PlacedStudents from "@/components/placed-students";
import SuccessStories from "@/components/success-stories";
import Footer from "@/components/footer";
import LottieAnimation from "@/components/lottie-animation";
import HandDrawnCircle from "@/components/hand-drawn-circle";
import coursesData from "@/coursesdata.json";
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
        {/* Hero Section */}
        <section className="pt-8 sm:pt-12 pb-4 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left sm:text-center">
          <h1 className="text-left sm:text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white">
            We Develop Technology <br />
            <span className="text-[#F58216]">&amp;</span>{" "}
            <span className="relative inline-block px-1.5 sm:px-2.5">
              <span className="relative z-10">We Train Talent</span>
              <HandDrawnCircle color="#F58216" strokeWidth={3.5} />
            </span>
            <span className="inline-flex items-center align-middle ml-2 sm:ml-4">
              <LottieAnimation
                as="span"
                animationPath="/lottiefiles/cat-crying.json"
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 inline-block"
              />
            </span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Building digital solutions for businesses and developing the next generation of tech professionals through practical, industry-focused training.
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

        {/* Student Video Success Stories Full-Width Marquee */}
        <SuccessStories />
      </main>
      <Footer />
    </div>
  );
}