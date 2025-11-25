"use client";

import { useState, useEffect } from "react";
import posthog from "posthog-js";
import { Button } from "@/components/ui/Button";

export default function PostHogDebugPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1]} - ${msg}`]);

  useEffect(() => {
    // Check if posthog is initialized
    // @ts-ignore
    if (posthog.__loaded) {
      setIsInitialized(true);
      addLog("PostHog is loaded");
    } else {
      addLog("PostHog is NOT loaded. Attempting to init...");
      const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

      if (key) {
        posthog.init(key, {
          api_host: host,
          loaded: (ph) => {
            setIsInitialized(true);
            addLog("PostHog initialized manually");
          }
        });
      } else {
        addLog("Missing NEXT_PUBLIC_POSTHOG_KEY env var");
      }
    }
  }, []);

  const fetchSurveys = () => {
    addLog("Fetching surveys...");
    posthog.getSurveys((surveys) => {
      addLog(`Fetched ${surveys.length} surveys`);
      setSurveys(surveys);
    });
  };

  const forceReload = () => {
    posthog.reloadSurveys();
    addLog("Reloading surveys...");
    setTimeout(fetchSurveys, 1000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">PostHog Debugger</h1>

      <div className="grid gap-4 p-4 border rounded bg-slate-50">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isInitialized ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-mono">{isInitialized ? "Initialized" : "Not Initialized"}</span>
        </div>

        <div className="flex gap-4">
          <Button onClick={fetchSurveys}>Get Surveys</Button>
          <Button variant="secondary" onClick={forceReload}>Force Reload Surveys</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="font-bold">Surveys Found ({surveys.length})</h2>
          <pre className="bg-slate-900 text-green-400 p-4 rounded overflow-auto h-96 text-xs">
            {JSON.stringify(surveys, null, 2)}
          </pre>
        </div>

        <div className="space-y-4">
          <h2 className="font-bold">Logs</h2>
          <div className="bg-slate-100 p-4 rounded h-96 overflow-auto font-mono text-xs space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="border-b border-slate-200 pb-1">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
