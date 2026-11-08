import type { Metadata } from "next";
import CheckoutScreen from "@/components/checkout/checkout-screen";

export const metadata: Metadata = {
  title: "Checkout | Bytecode IT Solutions",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutScreen />;
}
