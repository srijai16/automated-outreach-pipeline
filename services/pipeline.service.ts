import { findSimilarCompanies } from "./ocean.service";
import { findDecisionMakers } from "./prospeo.service";
import { enrichEmails } from "./eazyreach.service";

export async function runPipeline(
  domain: string
) {
  const companies =
    await findSimilarCompanies(domain);

  let contacts = [];

  for (const company of companies) {
    const companyContacts =
      await findDecisionMakers(company.domain);

    contacts.push(...companyContacts);
  }

  const verifiedContacts =
    await enrichEmails(contacts);

  return {
    companies,
    contacts: verifiedContacts
  };
}