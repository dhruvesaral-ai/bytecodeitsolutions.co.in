import { cacheLife } from "next/cache";
import { settingService, type SettingData } from "@/services/SettingService";

/**
 * Site settings are read by the root layout, so the read must be cached for the
 * app shell to prerender under Cache Components. The `minutes` profile keeps
 * admin edits visible within a minute without turning the layout into a
 * dynamic hole.
 */
export async function getCachedSettings(): Promise<SettingData | null> {
  "use cache";
  cacheLife("minutes");

  return settingService.getSettings();
}
