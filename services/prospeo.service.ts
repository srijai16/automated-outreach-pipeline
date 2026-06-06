import { Contact } from "@/types/contact";

export async function findDecisionMakers(
  domain: string
): Promise<Contact[]> {
  console.log(`Finding decision makers for ${domain}`);

  return [
    {
      name: "John Doe",
      title: "CTO",
      linkedinUrl: "https://linkedin.com/in/johndoe"
    }
  ];
}