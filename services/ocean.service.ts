import axios from "axios";

const OCEAN_BASE_URL = "https://api.ocean.io";

export async function findSimilarCompanies(
  domain: string
) {
  try {

    const response = await axios.post(
      `${OCEAN_BASE_URL}/v3/search/companies`,
      {
        companyDomains: [domain],
        size: 10
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-token": process.env.OCEAN_API_KEY
        }
      }
    );

    return response.data;

  } catch (error) {
    console.error("Ocean API Error:", error);
    throw error;
  }
}