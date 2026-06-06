import axios from "axios";
import { Contact } from "@/types/contact";
import { Company } from "@/types/company";
// export async function findDecisionMakers(
//   domain: string
// ): Promise<Contact[]> {
export async function findDecisionMakers(company: Company){
  const response = await axios.post(
    "https://api.prospeo.io/search-person",
    {
      page: 1,
      filters: {
        company: {
          names: {
            include: [company.name]
          }
        }
      }
    },
    {
      headers: {
        "X-KEY": process.env.PROSPEO_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.results.map((item: any) => ({
    name: item.person.full_name,
    title: item.person.current_job_title,
    linkedinUrl: item.person.linkedin_url,
    companyDomain: item.company.domain
  }));
}