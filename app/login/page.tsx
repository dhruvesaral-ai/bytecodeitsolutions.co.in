import type { Metadata } from "next";
import LoginPageClient from "@/components/auth/login-page-client";

export const metadata: Metadata = {
  title: "Sign in | Bytecode IT Solutions",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginPageClient />;
}
