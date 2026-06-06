import { NextResponse } from "next/server";
import { runPipeline } from "@/services/pipeline.service";

export async function POST(req: Request) {

  const { domain } = await req.json();

  const result =
    await runPipeline(domain);

  return NextResponse.json(result);
}