"use client";

import { useState } from "react";

export default function Home() {
  const [domain, setDomain] = useState("");

  const startPipeline = async () => {
    const res = await fetch("/api/pipeline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain }),
    });

    const data = await res.json();
    console.log(data);
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
    </div>
  );
}