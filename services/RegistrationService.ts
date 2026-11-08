const BOOKING_ORDER_URL =
  "https://admin.bytecodeitsolutions.co.in/api/registrations/booking/order";

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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(BOOKING_ORDER_URL, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({ courseId }),
  });
  const responseBody = await response.text();
  let payload: unknown;

  try {
    payload = responseBody ? JSON.parse(responseBody) : null;
  } catch {
    throw new Error("The booking service returned an invalid response.");
  }

  if (!response.ok) {
    const errorMessage =
      isRecord(payload) && typeof payload.message === "string"
        ? payload.message
        : isRecord(payload) && typeof payload.error === "string"
          ? payload.error
          : `Unable to create booking order (${response.status}).`;
    throw new Error(errorMessage);
  }

  if (!isRecord(payload) || !isBookingOrder(payload.data)) {
    throw new Error("The booking service returned incomplete order details.");
  }

  return payload.data;
}
