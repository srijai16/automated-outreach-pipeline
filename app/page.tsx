"use client";

import { useState } from "react";

export default function Home() {
  const [domain, setDomain] = useState("");
  const [stage, setStage] = useState("idle");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const startPipeline = async () => {

  setLoading(true);

  setStage("ocean");

  await new Promise(r => setTimeout(r, 1000));

  setStage("prospeo");

  await new Promise(r => setTimeout(r, 1000));

  setStage("eazyreach");

  await new Promise(r => setTimeout(r, 1000));

  const res = await fetch("/api/pipeline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain }),
    });

    const data = await res.json();

    setResult(data);

    setStage("completed");

    setLoading(false);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Automated Outreach Pipeline
      </h1>

      <input
        className="border p-2 mt-5"
        placeholder="Enter company domain"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />

      <button
        onClick={startPipeline}
        className="ml-3 px-4 py-2 border"
      >
        Start Pipeline
      </button>
      <div className="mt-8 border rounded p-4">

      <h2 className="font-bold mb-3">
        Pipeline Status
      </h2>

      <p>
        Ocean.io:
        {stage === "ocean" || stage === "prospeo" ||
        stage === "eazyreach" || stage === "completed"
          ? " ✅"
          : " ⏳"}
      </p>

      <p>
        Prospeo:
        {stage === "prospeo" ||
        stage === "eazyreach" ||
        stage === "completed"
          ? " ✅"
          : " ⏳"}
      </p>

      <p>
        Eazyreach:
        {stage === "eazyreach" ||
        stage === "completed"
          ? " ✅"
          : " ⏳"}
      </p>
    {result && (
  <div className="mt-8">

    <h2 className="text-2xl font-bold mb-4">
      Pipeline Results
    </h2>

    <div className="grid grid-cols-4 gap-4 mb-6">

      <div className="border p-4 rounded">
        <p>Companies</p>
        <p className="text-2xl font-bold">
          {result.summary.companiesFound}
        </p>
      </div>

      <div className="border p-4 rounded">
        <p>Contacts</p>
        <p className="text-2xl font-bold">
          {result.summary.contactsFound}
        </p>
      </div>

      <div className="border p-4 rounded">
        <p>Verified Emails</p>
        <p className="text-2xl font-bold">
          {result.summary.verifiedEmails}
        </p>
      </div>

      <div className="border p-4 rounded">
        <p>Revealed Emails</p>
        <p className="text-2xl font-bold">
          {result.summary.revealedEmails}
        </p>
      </div>

    </div>

    <table className="w-full border">

      <thead>
        <tr>
          <th>Name</th>
          <th>Title</th>
          <th>Email</th>
          <th>LinkedIn</th>
        </tr>
      </thead>

      <tbody>

        {result.contacts.map(
          (contact: any) => (
            <tr key={contact.personId}>

              <td>{contact.name}</td>

              <td>{contact.title}</td>

              <td>
                {contact.email || "N/A"}
              </td>

              <td>
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                >
                  Profile
                </a>
              </td>

            </tr>
          )
        )}

      </tbody>

    </table>

    <button
      className="mt-6 bg-black text-white px-4 py-2 rounded"
    >
      Confirm & Send Emails
    </button>

  </div>
)}
    </div>
    </div>
  );
}