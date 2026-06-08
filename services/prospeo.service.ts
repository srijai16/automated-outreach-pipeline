import axios from "axios";
import { Contact } from "@/types/contact";
import { Company } from "@/types/company";

export async function findDecisionMakers(
  company: Company
): Promise<Contact[]> {

  try {

    console.log("================================");
    console.log("PROSPEO SEARCH START");
    console.log("Company Object:");
    console.log(JSON.stringify(company, null, 2));
    console.log("================================");

    const payload = {
      page: 1,
      filters: {
        company: {
          names: {
            include: [company.name]
          }
        }
      }
    };

    console.log("Request Payload:");
    console.log(JSON.stringify(payload, null, 2));
const response = await axios.post(
  "https://api.prospeo.io/search-person",
  payload,
  {
    headers: {
      "X-KEY": process.env.PROSPEO_API_KEY,
      "Content-Type": "application/json"
    }
  }
);

console.log("================================");
console.log("PROSPEO SUCCESS");
console.log("Results Count:", response.data.results?.length);

console.log("RATE LIMIT INFO");
console.log(
  "Minute Left:",
  response.headers["x-minute-request-left"]
);
console.log(
  "Daily Left:",
  response.headers["x-daily-request-left"]
);
console.log(
  "Minute Reset:",
  response.headers["x-minute-reset-seconds"]
);
console.log(
  "Daily Reset:",
  response.headers["x-daily-reset-seconds"]
);

console.log(
  JSON.stringify(
    response.data.results?.[0],
    null,
    2
  )
);

console.log("================================");

   return response.data.results
  .slice(0, 3)
  .map((item: any) => ({
    personId: item.person.person_id,

    name: item.person.full_name,
    title: item.person.current_job_title,

    linkedinUrl: item.person.linkedin_url,

    email: item.person.email?.email,
    emailStatus: item.person.email?.status,
    emailRevealed: item.person.email?.revealed,

    mobile: item.person.mobile?.mobile,

    companyDomain: item.company.domain
  }));

  } catch (error: any) {

  console.log("================================");
  console.log("PROSPEO ERROR");

  console.log(
    "Company Name:",
    company?.name
  );

  console.log(
    "Company Domain:",
    company?.domain
  );

  if (error.response) {

    console.log(
      "Status:",
      error.response.status
    );

    console.log(
      "Response:"
    );

    console.log(
      JSON.stringify(
        error.response.data,
        null,
        2
      )
    );

    console.log("RATE LIMIT INFO");

    console.log(
      "Minute Left:",
      error.response.headers?.[
        "x-minute-request-left"
      ]
    );

    console.log(
      "Daily Left:",
      error.response.headers?.[
        "x-daily-request-left"
      ]
    );

    console.log(
      "Minute Reset:",
      error.response.headers?.[
        "x-minute-reset-seconds"
      ]
    );

    console.log(
      "Daily Reset:",
      error.response.headers?.[
        "x-daily-reset-seconds"
      ]
    );

  } else {

    console.log(
      "Message:",
      error.message
    );
  }

  console.log("================================");

  return [];
}
}