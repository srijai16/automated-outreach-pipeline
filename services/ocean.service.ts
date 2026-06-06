export async function findSimilarCompanies(domain: string) {
  console.log(`Searching similar companies for ${domain}`);

  return [
    { domain: "netflix.com" },
    { domain: "spotify.com" }
  ];
}