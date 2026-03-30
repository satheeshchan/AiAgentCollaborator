import React, { useState } from 'react';
import { Agent } from '../types';

interface Props {
  onSave: (agent: Omit<Agent, 'id'>) => void;
  onClose: () => void;
}

export default function AgentConfigModal({ onSave, onClose }: Props) {
  const [name, setName] = useState('');
  const [persona, setPersona] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [isOrchestrator, setIsOrchestrator] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 backdrop-blur-lg p-6 rounded-xl w-full max-w-md shadow-2xl border border-neutral-700 text-neutral-100">
        <h2 className="text-xl font-bold mb-4 text-neutral-50">Configure Agent</h2>
        <input className="w-full bg-neutral-800 border border-neutral-700 p-2 rounded mb-2 text-neutral-100" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className="w-full bg-neutral-800 border border-neutral-700 p-2 rounded mb-2 text-neutral-100" placeholder="Persona" value={persona} onChange={(e) => setPersona(e.target.value)} />
        <input className="w-full bg-neutral-800 border border-neutral-700 p-2 rounded mb-2 text-neutral-100" placeholder="API Key (optional)" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        <input className="w-full bg-neutral-800 border border-neutral-700 p-2 rounded mb-2 text-neutral-100" placeholder="Base URL (optional)" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
        <label className="flex items-center gap-2 mb-4 text-neutral-300">
          <input type="checkbox" checked={isOrchestrator} onChange={(e) => setIsOrchestrator(e.target.checked)} />
          Is Orchestrator?
        </label>
        <div className="flex gap-2">
          <button className="bg-emerald-700 text-white p-2 rounded flex-1 hover:bg-emerald-600" onClick={() => onSave({ name, persona, apiKey, baseUrl, isOrchestrator })}>Save</button>
          <button className="bg-neutral-700 text-neutral-100 p-2 rounded flex-1 hover:bg-neutral-600" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
