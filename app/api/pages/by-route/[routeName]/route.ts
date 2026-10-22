import { NextResponse } from "next/server";
import { pageService } from "@/services/PageService";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ routeName: string }> }
) {
  const { routeName } = await params;
  const page = await pageService.getPageByRoute(routeName);

  if (!page) {
    return NextResponse.json(
      { error: `Page with route "${routeName}" not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: page });
}
