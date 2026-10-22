import { NextResponse } from "next/server";
import { pageService } from "@/services/PageService";

export async function GET() {
  const pages = await pageService.getPages();
  return NextResponse.json({ data: pages });
}
