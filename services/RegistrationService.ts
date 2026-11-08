import { post } from "@/lib/api-method";

export interface BookingOrder {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  registrationId: string;
  registrationNo: string;
  courseName: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isBookingOrder(value: unknown): value is BookingOrder {
  return (
    isRecord(value) &&
    typeof value.keyId === "string" &&
    typeof value.orderId === "string" &&
    typeof value.amount === "number" &&
    Number.isFinite(value.amount) &&
    value.amount > 0 &&
    typeof value.currency === "string" &&
    typeof value.registrationId === "string" &&
    typeof value.registrationNo === "string" &&
    typeof value.courseName === "string"
  );
}

export async function createBookingOrder(
  courseId: string,
  accessToken: string | null
): Promise<BookingOrder> {
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const payload = await post<{ data?: unknown }>(
    "registrations/booking/order",
    { courseId },
    headers
  );

  if (!isRecord(payload) || !isBookingOrder(payload.data)) {
    throw new Error("The booking service returned incomplete order details.");
  }

  return payload.data;
}
