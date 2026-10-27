import { get } from "@/lib/api-method";

export interface SettingAddress {
  id?: string;
  addressLine: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

export interface SettingData {
  id: string;
  companyName: string;
  companyAddress: string;
  companyAddressId?: string;
  companyWhatsappNumber: string;
  companyPrimaryContactNumber: string;
  companySecondaryContactNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  address?: SettingAddress | null;
  email?: string;
}

export const DEFAULT_SETTINGS: SettingData = {
  id: "set_cm101abc",
  companyName: "Bytecode IT Solutions",
  companyAddress: "2nd Floor, MG Road, Indore, Madhya Pradesh 452001",
  companyWhatsappNumber: "+919876543210",
  companyPrimaryContactNumber: "+919876543211",
  companySecondaryContactNumber: "+919876543212",
  createdAt: "2026-10-27T12:00:00.000Z",
  updatedAt: "2026-10-27T12:00:00.000Z",
  email: "contact@bytecode.co.in",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseSettingItem(item: unknown): SettingData | null {
  if (!isRecord(item)) return null;

  const id = typeof item.id === "string" ? item.id : DEFAULT_SETTINGS.id;
  const companyName =
    typeof item.companyName === "string" && item.companyName.trim()
      ? item.companyName
      : DEFAULT_SETTINGS.companyName;

  const companyWhatsappNumber =
    typeof item.companyWhatsappNumber === "string" &&
    item.companyWhatsappNumber.trim()
      ? item.companyWhatsappNumber
      : DEFAULT_SETTINGS.companyWhatsappNumber;

  const companyPrimaryContactNumber =
    typeof item.companyPrimaryContactNumber === "string" &&
    item.companyPrimaryContactNumber.trim()
      ? item.companyPrimaryContactNumber
      : DEFAULT_SETTINGS.companyPrimaryContactNumber;

  const companySecondaryContactNumber =
    typeof item.companySecondaryContactNumber === "string" &&
    item.companySecondaryContactNumber.trim()
      ? item.companySecondaryContactNumber
      : DEFAULT_SETTINGS.companySecondaryContactNumber;

  const companyAddressId =
    typeof item.companyAddressId === "string"
      ? item.companyAddressId
      : undefined;

  const email =
    typeof item.email === "string" && item.email.trim()
      ? item.email
      : DEFAULT_SETTINGS.email;

  let address: SettingAddress | undefined = undefined;
  if (isRecord(item.address)) {
    address = {
      id: typeof item.address.id === "string" ? item.address.id : undefined,
      addressLine:
        typeof item.address.addressLine === "string"
          ? item.address.addressLine
          : "",
      pincode:
        typeof item.address.pincode === "string" ? item.address.pincode : "",
      city: typeof item.address.city === "string" ? item.address.city : "",
      state: typeof item.address.state === "string" ? item.address.state : "",
      country:
        typeof item.address.country === "string" ? item.address.country : "",
    };
  }

  let companyAddress = DEFAULT_SETTINGS.companyAddress;
  if (typeof item.companyAddress === "string" && item.companyAddress.trim()) {
    companyAddress = item.companyAddress.trim();
  } else if (address) {
    const parts = [
      address.addressLine,
      address.city,
      address.state,
      address.pincode,
      address.country,
    ].filter(Boolean);
    if (parts.length > 0) {
      companyAddress = parts.join(", ");
    }
  }

  return {
    id,
    companyName,
    companyAddress,
    companyAddressId,
    companyWhatsappNumber,
    companyPrimaryContactNumber,
    companySecondaryContactNumber,
    createdAt: typeof item.createdAt === "string" ? item.createdAt : undefined,
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : undefined,
    address,
    email,
  };
}

export class SettingService {
  async getSettings(): Promise<SettingData> {
    try {
      const response = await get<{ data?: unknown }>("settings");
      if (response && isRecord(response) && response.data !== undefined) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          const parsed = parseSettingItem(response.data[0]);
          if (parsed) return parsed;
        } else if (
          isRecord(response.data) &&
          Object.keys(response.data).length > 0
        ) {
          const parsed = parseSettingItem(response.data);
          if (parsed) return parsed;
        }
      }
    } catch {
      // Backend is unavailable or error fetching settings
    }
    return DEFAULT_SETTINGS;
  }
}

export const settingService = new SettingService();
