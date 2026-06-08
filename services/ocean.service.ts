import axios from "axios";

const OCEAN_BASE_URL = "https://api.ocean.io";

interface OceanCompany {
  name: string;
  domain: string;
  linkedinIndustry: string;
  companySize: string;
  primaryCountry: string;
  employeeCountOcean: number;
  revenue: string;
  description: string;
}

interface OceanCompanyItem {
  company: OceanCompany;
}

interface OceanSearchResponse {
  companies: OceanCompanyItem[];
}

export interface SimilarCompany {
  name: string;
  domain: string;
  industry: string;
  size: string;
  country: string;
  employees: number;
  revenue: string;
  description: string;
}

function mapOceanCompanies(data: OceanSearchResponse) {
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

    console.log(
      "Searching similar companies for:",
      domain
    );

    const response = await axios.post(
      `${OCEAN_BASE_URL}/v3/search/companies`,
      {
        size: 10,

        companiesFilters: {
          lookalikeDomains: [domain]
        }
      },
      {
        headers: {
          "X-Api-Token":
            process.env.OCEAN_API_KEY,
          "Content-Type":
            "application/json"
        }
      }
    );

    let companies =
      mapOceanCompanies(response.data);

    // Remove duplicates
    companies = companies.filter(
      (company, index, self) =>
        index ===
        self.findIndex(
          (c:any) => c.domain === company.domain
        )
    );

    // Remove seed company variants
    const seedKeyword =
      domain.split(".")[0].toLowerCase();

    companies = companies.filter(
      company =>
        company.domain &&
        !company.domain
          .toLowerCase()
          .includes(seedKeyword)
    );

    console.log(
      `Found ${companies.length} companies`
    );

    return companies;

  } catch (error: any) {

    console.error(
      "Ocean API Error:",
      JSON.stringify(
        error.response?.data,
        null,
        2
      )
    );

    throw error;
  }
}