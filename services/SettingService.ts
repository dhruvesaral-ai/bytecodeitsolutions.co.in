import { MEDIA_BASE_URL } from "@/config";
import { get } from "@/lib/api-method";

export interface SettingData {
  id: string;
  companyName: string;
  companyLightThemedLogoUrl?: string | null;
  companyDarkThemedLogoUrl?: string | null;
  companyAddress: string;
  companyWhatsappNumber: string;
  companyPrimaryContactNumber: string;
  companySecondaryContactNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  email?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function resolveMediaUrl(url: string): string {
  try {
    return new URL(url, `${MEDIA_BASE_URL.replace(/\/+$/, "")}/`).toString();
  } catch {
    return url;
  }
}

function parseSettingItem(item: unknown): SettingData | null {
  if (!isRecord(item)) return null;

  const id = typeof item.id === "string" ? item.id : "";
  const companyName =
    typeof item.companyName === "string" ? item.companyName.trim() : "";

  let companyLightThemedLogoUrl: string | null = null;
  if (
    typeof item.companyLightThemedLogoUrl === "string" &&
    item.companyLightThemedLogoUrl.trim()
  ) {
    companyLightThemedLogoUrl = resolveMediaUrl(
      item.companyLightThemedLogoUrl.trim()
    );
  }

  let companyDarkThemedLogoUrl: string | null = null;
  if (
    typeof item.companyDarkThemedLogoUrl === "string" &&
    item.companyDarkThemedLogoUrl.trim()
  ) {
    companyDarkThemedLogoUrl = resolveMediaUrl(
      item.companyDarkThemedLogoUrl.trim()
    );
  }

  const companyWhatsappNumber =
    typeof item.companyWhatsappNumber === "string"
      ? item.companyWhatsappNumber.trim()
      : "";

  const companyPrimaryContactNumber =
    typeof item.companyPrimaryContactNumber === "string"
      ? item.companyPrimaryContactNumber.trim()
      : "";

  const companySecondaryContactNumber =
    typeof item.companySecondaryContactNumber === "string"
      ? item.companySecondaryContactNumber.trim()
      : undefined;

  const email =
    typeof item.email === "string" && item.email.trim()
      ? item.email.trim()
      : undefined;

  const companyAddress =
    typeof item.companyAddress === "string" ? item.companyAddress.trim() : "";

  return {
    id,
    companyName,
    companyLightThemedLogoUrl,
    companyDarkThemedLogoUrl,
    companyAddress,
    companyWhatsappNumber,
    companyPrimaryContactNumber,
    companySecondaryContactNumber,
    createdAt: typeof item.createdAt === "string" ? item.createdAt : undefined,
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : undefined,
    email,
  };
}

export class SettingService {
  async getSettings(): Promise<SettingData | null> {
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
    return null;
  }
}

export const settingService = new SettingService();
