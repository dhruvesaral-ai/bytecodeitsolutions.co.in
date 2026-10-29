import { post } from "@/lib/api-method";

export type LeadStatus = "hot" | "medium" | "cold" | "converted";
export type LeadGeneratedSource = "online" | "offline";

export interface CreateWebLeadInput {
  firstName: string;
  lastName?: string | null;
  username: string;
  utmSource?: string | null;
  courseId?: string | null;
  hasBeenCalled?: boolean;
  nextCallDate?: string | null;
  status?: LeadStatus;
  generatedSource?: LeadGeneratedSource;
  leadRemark?: string | null;
  message?: string | null;
}

export function createWebLead(lead: CreateWebLeadInput): Promise<unknown | null> {
  return post<unknown>("leads", lead);
}
