import { Suspense } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/context/theme-context";
import { SettingsProvider } from "@/context/setting-context";
import { AuthProvider } from "@/context/auth-context";
import { EnquiryProvider } from "@/context/enquiry-context";
import { SidebarProvider } from "@/context/sidebar-context";
import AppSidebar from "@/components/sidebar";
import SmoothScroll from "@/components/smooth-scroll";
import Header from "@/components/header";
import { pageService } from "@/services/PageService";
import { getCachedSettings } from "@/lib/cached-settings";
import "./globals.css";
import Footer from "@/components/footer";
import AnimatedBanner from "@/components/animated-banner";
import ScrollToTop from "@/components/scroll-to-top";
async function HeaderSlot() {
  const pages = await pageService.getPages();
  console.log("Pages :", pages);
  return <Header initialPages={pages} />;
}

const neueMachina = localFont({
  src: [
    {
      path: "../public/fonts/NeueMachina-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueMachina-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueMachina-Regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueMachina-Ultrabold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueMachina-Ultrabold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueMachina-Ultrabold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueMachina-Ultrabold.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-neue-machina",
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bytecode IT Solutions",
  description: "Innovative software solutions, training, and programs.",
  icons: {
    icon: [
      { url: "/favicons/favicon.ico" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/favicons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/favicons/favicon.ico",
    apple: [
      {
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getCachedSettings();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${neueMachina.variable} ${poppins.variable} font-sans antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('bytecode_theme');
                var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'dark' || (!stored && systemDark) || (stored === 'system' && systemDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <ThemeProvider>
          <SettingsProvider initialSettings={settings}>
            <AuthProvider>
              <EnquiryProvider>
                <SidebarProvider>
                  <div id="main-sticky-header" className="sticky top-0 z-40 w-full">
                  <AnimatedBanner />
                  <Suspense
                    fallback={
                      <div
                        className="h-16 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black"
                        aria-busy="true"
                      />
                    }
                  >
                    <HeaderSlot />
                  </Suspense>
                </div>
                <SmoothScroll>{children}</SmoothScroll>
                <Suspense fallback={null}>
                  <Footer />
                </Suspense>
                  <Suspense fallback={null}>
                    <AppSidebar />
                  </Suspense>
                </SidebarProvider>
              </EnquiryProvider>
            </AuthProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
