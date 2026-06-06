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
    {
  result && (
    <div className="mt-8">

      <h2 className="font-bold text-xl mb-4">
        Contacts Found
      </h2>

      {result.contacts.map(
              (contact: any, index: number) => (
                <div
                  key={index}
                  className="border p-3 mb-2"
                >
                  <p>{contact.name}</p>
                  <p>{contact.title}</p>
                  <p>{contact.email}</p>
                </div>
              )
            )}

          </div>
        )
      }
    </div>
    </div>
  );
}