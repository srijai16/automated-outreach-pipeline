import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { domain } = await req.json();

  return NextResponse.json({
    success: true,
    message: `Pipeline started for ${domain}`,
  });
}