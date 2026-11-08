export interface CheckoutIntent {
  courseId: string;
  courseName: string;
  bookingAmount: number | null;
  planLabel: string | null;
}

export interface PaymentResult {
  status: "success" | "failed";
  courseName: string;
  registrationNo: string;
  amountLabel: string;
  message: string;
  paymentId?: string;
}

const STORAGE_KEYS = {
  checkoutIntent: "bytecode_checkout_intent",
  pendingMobile: "bytecode_otp_mobile",
  paymentResult: "bytecode_payment_result",
};

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function safeNextPath(
  value: string | string[] | undefined,
  fallback = "/profile"
): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return fallback;
  }
  if (raw.includes("\\") || raw.includes("://")) {
    return fallback;
  }
  return raw;
}

export function savePendingMobile(mobile: string): void {
  if (!canUseStorage()) return;
  sessionStorage.setItem(STORAGE_KEYS.pendingMobile, mobile);
}

export function readPendingMobile(): string | null {
  if (!canUseStorage()) return null;
  const mobile = sessionStorage.getItem(STORAGE_KEYS.pendingMobile);
  return mobile && /^\d{10}$/.test(mobile) ? mobile : null;
}

export function clearPendingMobile(): void {
  if (!canUseStorage()) return;
  sessionStorage.removeItem(STORAGE_KEYS.pendingMobile);
}

function isCheckoutIntent(value: unknown): value is CheckoutIntent {
  if (typeof value !== "object" || value === null) return false;
  const intent = value as CheckoutIntent;
  return (
    typeof intent.courseId === "string" &&
    intent.courseId.length > 0 &&
    typeof intent.courseName === "string" &&
    (intent.bookingAmount === null ||
      (typeof intent.bookingAmount === "number" &&
        Number.isFinite(intent.bookingAmount))) &&
    (intent.planLabel === null || typeof intent.planLabel === "string")
  );
}

export function saveCheckoutIntent(intent: CheckoutIntent): void {
  if (!canUseStorage()) return;
  sessionStorage.setItem(STORAGE_KEYS.checkoutIntent, JSON.stringify(intent));
}

export function readCheckoutIntent(): CheckoutIntent | null {
  if (!canUseStorage()) return null;
  const raw = sessionStorage.getItem(STORAGE_KEYS.checkoutIntent);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isCheckoutIntent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearCheckoutIntent(): void {
  if (!canUseStorage()) return;
  sessionStorage.removeItem(STORAGE_KEYS.checkoutIntent);
}

function isPaymentResult(value: unknown): value is PaymentResult {
  if (typeof value !== "object" || value === null) return false;
  const result = value as PaymentResult;
  return (
    (result.status === "success" || result.status === "failed") &&
    typeof result.courseName === "string" &&
    typeof result.registrationNo === "string" &&
    typeof result.amountLabel === "string" &&
    typeof result.message === "string"
  );
}

export function savePaymentResult(result: PaymentResult): void {
  if (!canUseStorage()) return;
  sessionStorage.setItem(STORAGE_KEYS.paymentResult, JSON.stringify(result));
}

export function readPaymentResult(): PaymentResult | null {
  if (!canUseStorage()) return null;
  const raw = sessionStorage.getItem(STORAGE_KEYS.paymentResult);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isPaymentResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearPaymentResult(): void {
  if (!canUseStorage()) return;
  sessionStorage.removeItem(STORAGE_KEYS.paymentResult);
}
