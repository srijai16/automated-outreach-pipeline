import axios from "axios";

export async function enrichPerson(
  personId: string
) {
  try {
    const response = await axios.post(
      "https://api.prospeo.io/enrich-person",
      {
        only_verified_email: true,
        data: {
          person_id: personId
        }
      },
      {
        headers: {
          "X-KEY": process.env.PROSPEO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;

  } catch (error: any) {

    console.error(
      "Prospeo Enrich Error:",
      error.response?.data || error.message
    );

    return null;
  }
}