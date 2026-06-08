"use client";

import { useState } from "react";
import { Play, RefreshCw, Check, Send, Zap, Users, Mail, BarChart2, Plug, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type Stage = "idle" | "ocean" | "prospeo" | "brevo" | "done";
const ORDER: Stage[] = ["idle","ocean","prospeo","brevo","done"];

const STEPS = [
  { id: "ocean",     label: "Ocean.io",   desc: "Find lookalike companies"   },
  { id: "prospeo",   label: "Prospeo",    desc: "Extract decision-makers"    },
  { id: "brevo",     label: "Brevo",      desc: "Send personalized emails"   },
] as const;

function stageOf(current: Stage, step: string) {
  const ci = ORDER.indexOf(current), si = ORDER.indexOf(step as Stage);
  if (ci > si) return "done";
  if (ci === si) return "active";
  return "idle";
}

function initials(name: string) {
  return (name || "?").split(" ").slice(0,2).map(w => w[0]).join("").toUpperCase();
}

export default function Home() {
  const [domain, setDomain]         = useState("");
  const [stage, setStage]           = useState<Stage>("idle");
  const [result, setResult]         = useState<any>(null);
  const [loading, setLoading]       = useState(false);
  const [outreachResult, setOR]     = useState<any>(null);
  const [sending, setSending]       = useState(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const startPipeline = async () => {
    if (!domain.trim()) return;
    setLoading(true); setResult(null); setOR(null);
    setStage("ocean");     await sleep(950);
    setStage("prospeo");   await sleep(950);
    setStage("brevo");
    const res = await fetch("/api/pipeline", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });
    const data = await res.json();
    setResult(data); setStage("done"); setLoading(false);
  };

  const startOutreach = async () => {
    try {
      setSending(true);
      const sendable = result.contacts.filter((c: any) => c.email);
      const res = await fetch("/api/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacts: sendable }),
      });
      setOR(await res.json());
    } catch(e) { console.error(e); }
    finally { setSending(false); }
  };

  const emailCount = result?.contacts?.filter((c: any) => c.email).length ?? 0;

  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-56 bg-stone-900 flex flex-col flex-shrink-0 p-4">
        <div className="flex items-center gap-2 px-2 mb-6">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-stone-900" />
          </div>
          <span className="text-sm font-semibold text-white">OutreachOS</span>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 px-2 mb-2">Workspace</p>
        {[
          { icon: Play,      label: "Pipeline",     active: true  },
          { icon: Users,     label: "Contacts",     active: false },
          { icon: Mail,      label: "Campaigns",    active: false },
          { icon: BarChart2, label: "Analytics",    active: false },
        ].map(({ icon: Icon, label, active }) => (
          <div key={label} className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium cursor-pointer mb-0.5 transition-colors",
            active ? "bg-stone-800 text-white" : "text-stone-400 hover:bg-stone-800 hover:text-white"
          )}>
            <Icon className="w-4 h-4" />{label}
          </div>
        ))}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 px-2 mt-4 mb-2">Settings</p>
        {[
          { icon: Plug,     label: "Integrations" },
          { icon: Settings, label: "Settings"     },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-stone-400 hover:bg-stone-800 hover:text-white cursor-pointer mb-0.5 transition-colors">
            <Icon className="w-4 h-4" />{label}
          </div>
        ))}
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top bar */}
        <header className="h-13 bg-white border-b border-stone-200 px-7 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-sm font-semibold text-stone-900">Outreach pipeline</p>
            <p className="text-xs text-stone-400">Ocean → Prospeo → Brevo</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-[11px] font-semibold text-stone-500">JD</div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-[340px_1fr] gap-5 items-start">

            {/* Left column */}
            <div className="flex flex-col gap-4">

              {/* Domain input */}
              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-stone-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">Step 1</p>
                  <p className="text-sm font-semibold text-stone-900">Enter target domain</p>
                </div>
                <div className="p-4">
                  <div className="flex gap-2 mb-3">
                    <input
                      value={domain}
                      onChange={e => setDomain(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && !loading && startPipeline()}
                      placeholder="e.g. stripe.com"
                      className="flex-1 h-9 px-3 border border-stone-300 rounded-lg text-sm bg-stone-50 outline-none focus:border-stone-800 placeholder:text-stone-300"
                    />
                    <button
                      onClick={startPipeline}
                      disabled={loading || !domain.trim()}
                      className="h-9 px-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 disabled:opacity-40 transition-colors"
                    >
                      {loading
                        ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        : <Play className="w-3.5 h-3.5" />}
                      {loading ? "Running" : "Run"}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400">Pipeline runs fully automatically after you enter a domain.</p>
                </div>
              </div>

              {/* Stages */}
              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-stone-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">Pipeline stages</p>
                  <p className="text-sm font-semibold text-stone-900">Live progress</p>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {STEPS.map((s, i) => {
                    const status = stageOf(stage, s.id);
                    return (
                      <div key={s.id} className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm transition-all",
                        status === "active" && "bg-amber-50 border-amber-200",
                        status === "done"   && "bg-emerald-50 border-emerald-200",
                        status === "idle"   && "bg-stone-50 border-stone-200 opacity-50",
                      )}>
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0",
                          status === "active" && "bg-amber-100 text-amber-700",
                          status === "done"   && "bg-emerald-100 text-emerald-700",
                          status === "idle"   && "bg-stone-200 text-stone-400",
                        )}>
                          {status === "done"   ? <Check className="w-2.5 h-2.5" />                    :
                           status === "active" ? <RefreshCw className="w-2.5 h-2.5 animate-spin" /> :
                           i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-stone-800">{s.label}</p>
                          <p className="text-[11px] text-stone-400">{s.desc}</p>
                        </div>
                        <span className={cn(
                          "text-[10px] font-medium px-2 py-0.5 rounded-full",
                          status === "active" && "bg-amber-100 text-amber-700",
                          status === "done"   && "bg-emerald-100 text-emerald-700",
                          status === "idle"   && "bg-stone-100 text-stone-400",
                        )}>
                          {status === "active" ? "Running" : status === "done" ? "Done" : "Queued"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Metrics */}
              {result && (
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-stone-100">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">Results summary</p>
                    <p className="text-sm font-semibold text-stone-900">Pipeline output</p>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-2">
                    {[
                      { label: "Companies",       val: result.summary.companiesFound },
                      { label: "Contacts",        val: result.summary.contactsFound  },
                      { label: "Verified emails", val: result.summary.verifiedEmails, green: true },
                      { label: "Revealed emails", val: result.summary.revealedEmails },
                    ].map(m => (
                      <div key={m.label} className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-3">
                        <p className="text-[10px] text-stone-400 font-medium mb-1">{m.label}</p>
                        <p className={cn("text-xl font-semibold tracking-tight", m.green ? "text-emerald-700" : "text-stone-900")}>{m.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column — contacts table */}
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">Contacts</p>
                  <p className="text-sm font-semibold text-stone-900">Decision-makers</p>
                </div>
                <span className="text-xs text-stone-400">
                  {result ? `${result.contacts.length} found` : "Waiting for pipeline…"}
                </span>
              </div>

              {!result ? (
                <div className="flex flex-col items-center justify-center py-20 text-stone-300">
                  <Users className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm">Run the pipeline to surface contacts</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
                      <colgroup>
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "16%" }} />
                        <col style={{ width: "30%" }} />
                        <col style={{ width: "14%" }} />
                      </colgroup>
                      <thead>
                        <tr className="border-b border-stone-100">
                          {["Name","Title","Company","Email","LinkedIn"].map(h => (
                            <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-stone-400 px-4 pb-2.5">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.contacts.map((c: any) => (
                          <tr key={c.personId} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-[9px] font-semibold text-stone-500 flex-shrink-0">
                                  {initials(c.name)}
                                </div>
                                <span className="font-medium text-stone-800 text-xs truncate">{c.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-stone-500 text-xs truncate">{c.title || <span className="italic text-stone-300">Unknown</span>}</td>
                            <td className="px-4 py-3 text-stone-500 text-xs truncate">{c.companyName || "—"}</td>
                            <td className="px-4 py-3">
                              {c.email
                                ? <span className="font-mono text-[11px] text-stone-600">{c.email}</span>
                                : <span className="italic text-stone-300 text-xs">Not found</span>}
                            </td>
                            <td className="px-4 py-3">
                              {c.linkedinUrl
                                ? <a href={c.linkedinUrl} target="_blank" className="text-blue-600 hover:underline text-xs">View ↗</a>
                                : <span className="italic text-stone-300 text-xs">—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {emailCount > 0 && !outreachResult && (
                    <div className="px-4 py-3.5 border-t border-stone-100 flex items-center gap-3">
                      <button
                        onClick={startOutreach}
                        disabled={sending}
                        className="h-8 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 disabled:opacity-40 transition-colors"
                      >
                        {sending ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        {sending ? "Sending…" : `Send to ${emailCount} contact${emailCount !== 1 ? "s" : ""}`}
                      </button>
                      <span className="text-xs text-stone-400">{emailCount} verified email{emailCount !== 1 ? "s" : ""} ready</span>
                    </div>
                  )}

                  {outreachResult && (
                    <div className="mx-4 mb-4 bg-stone-50 border border-stone-200 rounded-lg p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-3">Outreach sent</p>
                      <div className="grid grid-cols-4 gap-3 text-center">
                        {[
                          { label: "Total",   val: outreachResult.summary.totalContacts },
                          { label: "Sent",    val: outreachResult.summary.sent,    green: true },
                          { label: "Failed",  val: outreachResult.summary.failed,  red: true   },
                          { label: "Skipped", val: outreachResult.summary.skipped },
                        ].map(s => (
                          <div key={s.label}>
                            <p className={cn("text-xl font-semibold", s.green ? "text-emerald-700" : s.red ? "text-red-600" : "text-stone-800")}>{s.val}</p>
                            <p className="text-[10px] text-stone-400 mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}