"use client";
import { useEffect, useState, use } from 'react';
import { decryptData } from '@/lib/crypto';

export default function View({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); 
  const id = resolvedParams.id;

  const [note, setNote] = useState('Fetching and decrypting...');

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/notes?id=${id}`);
      
      if (!res.ok) {
        setNote("Note not found or already viewed/deleted.");
        return;
      }
      
      const { encryptedContent, iv } = await res.json();
      
      const key = window.location.hash.substring(1);
      
      if (!key) {
        setNote("Error: No decryption key found in the URL.");
        return;
      }

      try {
        const secret = await decryptData(encryptedContent, iv, key);
        setNote(secret);
      } catch (err) {
        console.error(err);
        setNote("Decryption failed. The link might be corrupted.");
      }
    }
    
    load();
  }, [id]); 

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl p-6 bg-zinc-900 rounded-lg border border-zinc-800">
        <h2 className="text-zinc-500 mb-4 uppercase text-xs font-bold">Secret Content:</h2>
        <pre className="whitespace-pre-wrap font-mono text-green-400 break-all p-4 bg-black/30 rounded">
          {note}
        </pre>
      </div>
      <p className="mt-4 text-zinc-600 text-sm italic underline">
        Note: If you refresh, this note is gone forever.
      </p>
    </div>
  );
}