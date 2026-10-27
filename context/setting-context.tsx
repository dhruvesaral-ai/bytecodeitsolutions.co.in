"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { SettingData, settingService } from "@/services/SettingService";

export interface SettingContextType {
  settings: SettingData | null;
  companyName: string;
  companyLightThemedLogoUrl: string | null;
  companyDarkThemedLogoUrl: string | null;
  companyAddress: string;
  formattedAddress: string;
  companyWhatsappNumber: string;
  cleanWhatsappNumber: string;
  companyPrimaryContactNumber: string;
  companySecondaryContactNumber?: string;
  phoneNumbers: string[];
  email: string;
  isLoading: boolean;
  getWhatsappUrl: (message?: string) => string;
  formatPhoneNumber: (phone: string) => string;
  refreshSettings: () => Promise<void>;
}

export const SettingContext = createContext<SettingContextType | undefined>(
  undefined
);

export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");

  // If standard 12 digit format starting with 91 (e.g. 919876543210)
  if (digits.startsWith("91") && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }

  // If 10 digit Indian mobile number (e.g. 9876543210)
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  // Otherwise return trimmed or ensure leading '+'
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
}

interface SettingsProviderProps {
  children: React.ReactNode;
  initialSettings?: SettingData | null;
}

export function SettingsProvider({
  children,
  initialSettings = null,
}: SettingsProviderProps) {
  const [settings, setSettings] = useState<SettingData | null>(initialSettings);
  const [isLoading, setIsLoading] = useState<boolean>(!initialSettings);

  const refreshSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await settingService.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch {
      // Backend is unavailable or error fetching settings
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const companyName = settings?.companyName || "";
  const companyLightThemedLogoUrl =
    settings?.companyLightThemedLogoUrl || null;
  const companyDarkThemedLogoUrl =
    settings?.companyDarkThemedLogoUrl || null;
  const companyWhatsappNumber = settings?.companyWhatsappNumber || "";
  const companyPrimaryContactNumber =
    settings?.companyPrimaryContactNumber || "";
  const companySecondaryContactNumber =
    settings?.companySecondaryContactNumber || undefined;

  const cleanWhatsappNumber = useMemo(() => {
    return companyWhatsappNumber.replace(/\D/g, "");
  }, [companyWhatsappNumber]);

  const phoneNumbers = useMemo(() => {
    const numbers: string[] = [];
    if (companyPrimaryContactNumber) {
      numbers.push(companyPrimaryContactNumber);
    }
    if (
      companySecondaryContactNumber &&
      companySecondaryContactNumber !== companyPrimaryContactNumber
    ) {
      numbers.push(companySecondaryContactNumber);
    }
    return numbers;
  }, [companyPrimaryContactNumber, companySecondaryContactNumber]);

  const companyAddress = settings?.companyAddress?.trim() ?? "";

  const formattedAddress = companyAddress;

  const email = settings?.email || "";

  const getWhatsappUrl = useCallback(
    (message?: string) => {
      const number = cleanWhatsappNumber;
      if (!number) return "#";
      const base = `https://wa.me/${number}`;
      return message ? `${base}?text=${encodeURIComponent(message)}` : base;
    },
    [cleanWhatsappNumber]
  );

  const value = useMemo<SettingContextType>(
    () => ({
      settings,
      companyName,
      companyLightThemedLogoUrl,
      companyDarkThemedLogoUrl,
      companyAddress,
      formattedAddress,
      companyWhatsappNumber,
      cleanWhatsappNumber,
      companyPrimaryContactNumber,
      companySecondaryContactNumber,
      phoneNumbers,
      email,
      isLoading,
      getWhatsappUrl,
      formatPhoneNumber,
      refreshSettings,
    }),
    [
      settings,
      companyName,
      companyLightThemedLogoUrl,
      companyDarkThemedLogoUrl,
      companyAddress,
      formattedAddress,
      companyWhatsappNumber,
      cleanWhatsappNumber,
      companyPrimaryContactNumber,
      companySecondaryContactNumber,
      phoneNumbers,
      email,
      isLoading,
      getWhatsappUrl,
      refreshSettings,
    ]
  );

  return (
    <SettingContext.Provider value={value}>
      {children}
    </SettingContext.Provider>
  );
}

export function useSettings(): SettingContextType {
  const context = useContext(SettingContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

// Convenient aliases for versatility
export const useSetting = useSettings;
export const SettingProvider = SettingsProvider;
