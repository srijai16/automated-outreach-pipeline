import { NextResponse } from "next/server";

import { findSimilarCompanies } from "@/services/ocean.service";
import { findDecisionMakers } from "@/services/prospeo.service";
import { enrichEmails } from "@/services/eazyreach.service";

export async function POST(req: Request) {

  const { domain } = await req.json();

  const companies = await findSimilarCompanies(domain);

  let contacts = [];

  for (const company of companies) {

    const companyContacts =
      await findDecisionMakers(company.domain);

    contacts.push(...companyContacts);
  }

  const verifiedContacts =
    await enrichEmails(contacts);

  return NextResponse.json({
    companies,
    contacts: verifiedContacts
  });
}