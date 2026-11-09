import type { Metadata } from "next";
import VerifyOtpPageClient from "@/components/auth/verify-otp-page-client";

export const metadata: Metadata = {
  title: "Verify OTP | Bytecode IT Solutions",
  robots: { index: false, follow: false },
};

export default function VerifyOtpPage() {
  return <VerifyOtpPageClient />;
}
