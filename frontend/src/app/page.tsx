"use client";

import { useEffect, useState } from "react";
import { requestFirebaseNotificationPermission, onMessageListener } from "@/utils/firebase";
import { Bell, BellOff, Activity, ExternalLink, ArrowRight } from "lucide-react";

export default function Home() {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (Notification.permission === "granted") {
      setPermissionGranted(true);
    }

    const listen = async () => {
      const payload: any = await onMessageListener();
      if (payload) {
        setNotifications((prev) => [payload, ...prev]);
        listen();
      }
    };
    listen();
  }, []);

  const handleRequestPermission = async () => {
    try {
      const token = await requestFirebaseNotificationPermission();
      if (token) {
        setPermissionGranted(true);
        setFcmToken(token);
        
        try {
          await fetch('http://localhost:3001/token/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });
          setIsConnected(true);
        } catch (err) {
          console.error("Failed to register token with backend:", err);
        }
      }
    } catch (error: any) {
      alert("Failed to enable alerts: " + (error.message || error));
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-emerald-500/30">
      {}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none"></div>

      <div className="max-w-4xl mx-auto p-6 pt-20 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Activity className="text-emerald-400 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                USDT Whale Alert
              </h1>
              <p className="text-sm text-neutral-400 mt-1">Real-time &gt; $100k Mainnet Transfers</p>
            </div>
          </div>

          <div className="flex items-center">
            {!isConnected ? (
              <button
                onClick={handleRequestPermission}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Bell className="w-4 h-4" />
                Connect Server
              </button>
            ) : (
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                <Bell className="w-4 h-4" />
                <span className="text-sm font-medium">Listening Live</span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
            )}
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2 mb-6">
            <h2 className="text-lg font-semibold text-neutral-300">Live Feed</h2>
            <span className="text-sm text-neutral-500">{notifications.length} events caught</span>
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 rounded-3xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl">
              <div className="w-16 h-16 mb-4 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-600">
                <Activity className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-neutral-400 font-medium">No large transfers yet</h3>
              <p className="text-neutral-600 text-sm mt-2 text-center max-w-sm">
                Ensure notifications are enabled. We are listening to the Ethereum mainnet for USDT transfers larger than $100,000.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {notifications.map((notif, i) => {
                const data = notif.data || {};
                const amountFormatted = parseFloat(data.amount || "0").toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                const fromShort = data.sender ? `${data.sender.slice(0, 6)}...${data.sender.slice(-4)}` : 'Unknown';
                const toShort = data.to ? `${data.to.slice(0, 6)}...${data.to.slice(-4)}` : 'Unknown';

                return (
                  <div key={i} className="group flex flex-col md:flex-row items-center justify-between p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/30 transition-all hover:bg-neutral-800/80 shadow-lg relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1">Amount</span>
                        <span className="text-2xl font-bold font-mono text-white tracking-tight">{amountFormatted}</span>
                      </div>

                      <div className="hidden md:flex items-center gap-3 text-neutral-500">
                        <div className="px-3 py-1.5 rounded-lg bg-neutral-900/50 border border-neutral-800 font-mono text-sm">
                          {fromShort}
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-600" />
                        <div className="px-3 py-1.5 rounded-lg bg-neutral-900/50 border border-neutral-800 font-mono text-sm">
                          {toShort}
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto mt-4 md:mt-0 flex justify-end">
                      {data.txHash && (
                        <a
                          href={`https://etherscan.io/tx/${data.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-400/10 hover:bg-emerald-400/20 px-4 py-2 rounded-xl"
                        >
                          View Etherscan
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
