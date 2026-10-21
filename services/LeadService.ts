import { post } from "@/lib/api-method";

export interface CreateWebLeadInput {
  firstName: string;
  lastName: string;
  username: string;
  utmSource: string;
  courseId: string;
  hasBeenCalled: boolean;
  nextCallDate: string | null;
  status: string;
  generatedSource: string;
  leadRemark: string;
  message: string;
}

export function createWebLead(lead: CreateWebLeadInput): Promise<unknown | null> {
  return post<unknown>("leads", lead);
}
