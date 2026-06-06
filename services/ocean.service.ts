import axios from "axios";

const OCEAN_BASE_URL = "https://api.ocean.io";
function mapOceanCompanies(data: any) {
  return data.companies.map((item: any) => ({
    name: item.company.name,
    domain: item.company.domain,
    industry: item.company.linkedinIndustry,
    size: item.company.companySize,
    country: item.company.primaryCountry,
    employees: item.company.employeeCountOcean,
    revenue: item.company.revenue,
    description: item.company.description,
  }));
}
export async function findSimilarCompanies(
  domain: string
) {
  try {
    const response = await axios.post(
    `${OCEAN_BASE_URL}/v3/search/companies`,
    {
      companiesFilters: {
        industries: {
          industries: ["SaaS"]
        },
        technologies: {
          apps: {
            anyOf: ["HubSpot"]
          }
        },
        companySizes: ["51-200"]
      },
      size: 10
    },
    {
      headers: {
        "X-Api-Token": process.env.OCEAN_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );
  return mapOceanCompanies(response.data);
  } catch (error: any) {
      console.error(
        "Ocean API Error:",
        JSON.stringify(error.response?.data, null, 2)
      );
      throw error;
    }
}