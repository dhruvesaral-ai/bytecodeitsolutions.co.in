import type { Metadata } from "next";
import VerifyOtpScreen from "@/components/auth/verify-otp-screen";
import { safeNextPath } from "@/lib/auth-flow";

export const metadata: Metadata = {
  title: "Verify OTP | Bytecode IT Solutions",
  robots: { index: false, follow: false },
};

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  return <VerifyOtpScreen nextPath={safeNextPath(next)} />;
}
