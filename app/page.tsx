"use client";
import { useState } from 'react';
import { encryptData } from '@/lib/crypto';

export default function Home() {
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const { encryptedBase64, ivBase64, keyBase64 } = await encryptData(text);
      const res = await fetch('/api/notes', {
        method: 'POST',
        body: JSON.stringify({ encryptedContent: encryptedBase64, iv: ivBase64, ttl: 3600 }),
      });
      const { id } = await res.json();
      setLink(`${window.location.origin}/view/${id}#${keyBase64}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-black text-indigo-500 mb-2">WowBin</h1>
        <p className="text-zinc-500 mb-8">Encrypted in your browser. Burned after reading.</p>
        
        <textarea 
          className="w-full h-64 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl mb-6 outline-none focus:border-indigo-500 transition-colors resize-none font-mono"
          placeholder="Paste your secret data here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button 
          onClick={handleCreate} 
          disabled={loading || !text}
          className="w-full bg-indigo-600 py-4 rounded-xl font-bold hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Encrypting..." : "Create Secure Link"}
        </button>

        {link && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
            <p className="text-indigo-400 text-sm font-medium mb-2">Your Secret Link:</p>
            <div className="flex gap-2">
              <input 
                readOnly 
                value={link} 
                className="flex-1 p-3 bg-zinc-900 border border-indigo-500/30 rounded-lg text-sm text-zinc-300 outline-none"
              />
              <button 
                onClick={copyToClipboard}
                className={`px-6 rounded-lg font-bold transition-all ${copied ? 'bg-green-600' : 'bg-zinc-800 hover:bg-zinc-700'}`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}