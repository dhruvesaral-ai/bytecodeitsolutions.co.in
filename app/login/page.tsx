import type { Metadata } from "next";
import LoginScreen from "@/components/auth/login-screen";
import { safeNextPath } from "@/lib/auth-flow";

export const metadata: Metadata = {
  title: "Sign in | Bytecode IT Solutions",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  return <LoginScreen nextPath={safeNextPath(next)} />;
}
