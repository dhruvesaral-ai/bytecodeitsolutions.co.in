"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  SettingData,
  SettingAddress,
  DEFAULT_SETTINGS,
  settingService,
} from "@/services/SettingService";

export interface SettingContextType {
  settings: SettingData;
  companyName: string;
  companyAddress: string;
  formattedAddress: string;
  companyWhatsappNumber: string;
  cleanWhatsappNumber: string;
  companyPrimaryContactNumber: string;
  companySecondaryContactNumber?: string;
  phoneNumbers: string[];
  address: SettingAddress | null | undefined;
  email: string;
  isLoading: boolean;
  getWhatsappUrl: (message?: string) => string;
  formatPhoneNumber: (phone: string) => string;
  refreshSettings: () => Promise<void>;
}

export const SettingContext = createContext<SettingContextType | undefined>(
  undefined
);

export function formatAddress(address?: SettingAddress | null): string {
  if (!address) return "";
  const parts: string[] = [];
  if (address.addressLine) parts.push(address.addressLine);
  if (address.city) parts.push(address.city);
  if (address.state && address.pincode) {
    parts.push(`${address.state} - ${address.pincode}`);
  } else {
    if (address.state) parts.push(address.state);
    if (address.pincode) parts.push(address.pincode);
  }
  if (address.country) parts.push(address.country);
  return parts.join(", ");
}

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
  initialSettings,
}: SettingsProviderProps) {
  const [settings, setSettings] = useState<SettingData>(
    initialSettings || DEFAULT_SETTINGS
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialSettings);

  const refreshSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await settingService.getSettings();
      setSettings(data);
    } catch {
      // Retain existing settings if network fails
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // If no initial settings were provided from server, fetch on client mount
    if (!initialSettings) {
      refreshSettings();
    }
  }, [initialSettings, refreshSettings]);

  const companyName = settings.companyName || DEFAULT_SETTINGS.companyName;
  const companyWhatsappNumber =
    settings.companyWhatsappNumber || DEFAULT_SETTINGS.companyWhatsappNumber;
  const companyPrimaryContactNumber =
    settings.companyPrimaryContactNumber ||
    DEFAULT_SETTINGS.companyPrimaryContactNumber;
  const companySecondaryContactNumber = settings.companySecondaryContactNumber;

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
    return numbers.length > 0
      ? numbers
      : [DEFAULT_SETTINGS.companyPrimaryContactNumber];
  }, [companyPrimaryContactNumber, companySecondaryContactNumber]);

  const address = settings.address;

  const companyAddress = useMemo(() => {
    if (settings.companyAddress && settings.companyAddress.trim()) {
      return settings.companyAddress;
    }
    if (address) {
      return formatAddress(address);
    }
    return DEFAULT_SETTINGS.companyAddress;
  }, [settings.companyAddress, address]);

  const formattedAddress = companyAddress;

  const email = settings.email || DEFAULT_SETTINGS.email || "contact@bytecode.co.in";

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
      companyAddress,
      formattedAddress,
      companyWhatsappNumber,
      cleanWhatsappNumber,
      companyPrimaryContactNumber,
      companySecondaryContactNumber,
      phoneNumbers,
      address,
      email,
      isLoading,
      getWhatsappUrl,
      formatPhoneNumber,
      refreshSettings,
    }),
    [
      settings,
      companyName,
      companyAddress,
      formattedAddress,
      companyWhatsappNumber,
      cleanWhatsappNumber,
      companyPrimaryContactNumber,
      companySecondaryContactNumber,
      phoneNumbers,
      address,
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
