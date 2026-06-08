import axios from "axios";
import { Contact } from "@/types/contact";

export async function enrichEmails(
  contacts: Contact[]
): Promise<Contact[]> {

  const enrichedContacts: Contact[] = [];

  for (const contact of contacts) {

    try {

      const response = await axios.post(
        "https://api.apollo.io/api/v1/people/match",
        {
          name: contact.name,
          linkedin_url: contact.linkedinUrl
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "X-Api-Key":
              process.env.APOLLO_API_KEY
          }
        }
      );

      enrichedContacts.push({
        ...contact,
        email:
          response.data.person?.email
      });
      console.log(response.data.person?.email+"333")
    } catch (error:any) {
        console.error(
    "Apollo Error:",
    error.response?.data || error.message
  );
    }
  }

  return enrichedContacts;
}