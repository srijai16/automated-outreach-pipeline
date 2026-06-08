import { findSimilarCompanies } from "./ocean.service";
import { findDecisionMakers } from "./prospeo.service";
// import { enrichPerson } from "./prospeo-enrich.service";

export async function runPipeline(
  domain: string
) {
  // Limit companies to avoid rate limits
  const companies = (
    await findSimilarCompanies(domain)
  ).slice(0, 1);

  let contacts: any[] = [];

  // Step 1: Find decision makers
  for (const company of companies) {

    console.log(
      `Searching contacts for ${company.name}`
    );

    const companyContacts =
      await findDecisionMakers(company);

    contacts.push(...companyContacts);

    await sleep(1500);
  }

  console.log(
    `Found ${contacts.length} contacts`
  );

  // Limit enrichment requests
  contacts = contacts
    .filter(contact => contact.personId)
    .slice(0, 10);

  // const enrichedContacts: any[] = [];

  // // Step 2: Enrich contacts
  // for (const contact of contacts) {

  //   try {

  //     console.log(
  //       `Enriching ${contact.name}`
  //     );

  //     const enriched =
  //       await enrichPerson(
  //         contact.personId
  //       );

  //     enrichedContacts.push({
  //       ...contact,

  //       email:
  //         enriched?.person?.email?.email,

  //       emailStatus:
  //         enriched?.person?.email?.status,

  //       emailRevealed:
  //         enriched?.person?.email?.revealed,

  //       mobile:
  //         enriched?.person?.mobile?.mobile
  //     });

  //     await sleep(1500);

  //   } catch (error) {

  //     console.error(
  //       `Failed enrichment for ${contact.name}`
  //     );

  //     enrichedContacts.push(contact);
  //   }
  // }
    contacts = contacts.filter(
      (contact, index, self) =>
        index ===
        self.findIndex(
          c =>
            c.linkedinUrl ===
            contact.linkedinUrl
        )
    );
  return {
  summary: {
    companiesFound: companies.length,
    contactsFound: contacts.length,
    verifiedEmails: contacts.filter(
      c => c.emailStatus === "VERIFIED"
    ).length,

    revealedEmails: contacts.filter(
      c => c.emailRevealed === true
    ).length
  },

  companies,
  contacts
};
}

function sleep(
  ms: number
): Promise<void> {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}