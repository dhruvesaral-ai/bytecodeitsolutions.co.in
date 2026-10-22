import { Suspense } from "react";
import PlacedStudents from "@/components/placed-students";
import SuccessStories from "@/components/success-stories";
import Footer from "@/components/footer";
import LottieAnimation from "@/components/lottie-animation";
import HandDrawnCircle from "@/components/hand-drawn-circle";
import HomeContent from "@/components/home-content";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
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

        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <HomeContent />
        </Suspense>

        {/* Placed Students Animated Section */}
        <PlacedStudents />
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}