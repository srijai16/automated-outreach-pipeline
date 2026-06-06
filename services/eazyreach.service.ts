import { Contact } from "@/types/contact";

export async function enrichEmails(
  contacts: Contact[]
): Promise<Contact[]> {

  return contacts.map(contact => ({
    ...contact,
    email: "john@company.com"
  }));
}