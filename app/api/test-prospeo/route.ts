import { NextResponse } from "next/server";
import { findDecisionMakers } from "@/services/prospeo.service";

export async function GET() {

  const contacts =
  await findDecisionMakers("microsoft.com");
  console.log(contacts);
  return NextResponse.json(contacts)
}