import type { Metadata } from "next";
import PaymentStatusScreen from "@/components/checkout/payment-status-screen";

export const metadata: Metadata = {
  title: "Payment status | Bytecode IT Solutions",
  robots: { index: false, follow: false },
};

export default function PaymentStatusPage() {
  return <PaymentStatusScreen />;
}
