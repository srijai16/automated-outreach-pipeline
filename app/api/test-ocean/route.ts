import { NextResponse } from "next/server";
import { findSimilarCompanies } from "@/services/ocean.service";

export async function GET() {

  const result =
    await findSimilarCompanies("hubspot.com");

  return NextResponse.json(result);
}