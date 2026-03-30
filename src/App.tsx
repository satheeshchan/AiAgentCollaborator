import { useState, useRef } from 'react';
import AgentConfigModal from './components/AgentConfigModal';
import { Agent, Message, SimulationStatus } from './types';
import { Plus, Pause, Play, StopCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<SimulationStatus | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [intervention, setIntervention] = useState('');
  const [appliedIntervention, setAppliedIntervention] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const shouldStop = useRef(false);

  const addAgent = (agent: Omit<Agent, 'id'>) => {
    setAgents([...agents, { ...agent, id: Date.now().toString() }]);
    setShowModal(false);
  };

  const runSimulation = async () => {
    const orchestrator = agents.find(a => a.isOrchestrator);
    if (!orchestrator) {
      setStatus({ message: 'No orchestrator found!' });
      return;
    }

    setStatus({ message: 'Starting simulation...' });
    shouldStop.current = false;

    // Simulation loop
    let context = '';
    while (!shouldStop.current) {
      if (isPaused) {
        await new Promise(r => setTimeout(r, 100));
        continue;
      }

      // 1. Orchestrator decides next step
      setStatus({ message: 'Orchestrator is deciding...' });
      
      const prompt = `You are the moderator of this discussion.
Task: User task
History: ${context}
User Intervention: ${appliedIntervention || 'None'}
Decide which agent should act next, or if the simulation should end.
Available agents: ${agents.map(a => a.name).join(', ')}.
Return ONLY the exact name of one of the available agents, or "END".`;
      
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
            systemInstruction: `You are a concise moderator. You MUST return ONLY the exact name of one of the available agents: ${agents.map(a => a.name).join(', ')}, or 'END'. Do not include any other text.`
          }
        });

        const nextAgentName = response.text?.trim() || '';
        
        if (nextAgentName === 'END') break;

        const nextAgent = agents.find(a => a.name === nextAgentName);
        if (!nextAgent) {
          console.error('Invalid agent chosen:', nextAgentName);
          setStatus({ message: `Orchestrator chose invalid agent: ${nextAgentName}` });
          break;
        }

        // 2. Invoke agent
        setStatus({ message: `Orchestrator invoked ${nextAgent.name}` });
        await new Promise(r => setTimeout(r, 1000)); // Delay
        
        const agentResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `${nextAgent.persona}\n\nHistory: ${context}\n\nRespond as ${nextAgent.name}.`,
        });

        const content = agentResponse.text || '...';
        setMessages(prev => [...prev, { agentName: nextAgent.name, content, timestamp: Date.now() }]);
        context += `${nextAgent.name}: ${content}\n\n`;
        setAppliedIntervention(''); // Clear intervention after use
      } catch (error) {
        console.error('Simulation error:', error);
        setStatus({ message: 'Error during simulation. Check console.' });
        break;
      }
    }
    setStatus({ message: 'Simulation ended.' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-4 flex gap-4 text-neutral-100">
      {/* Left Pane: Chat/Discussion */}
      <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-neutral-50">Discussion</h1>
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className="bg-neutral-800 p-4 rounded-xl border border-neutral-700">
              <p className="font-bold text-sm text-neutral-400">{msg.agentName}</p>
              <div className="text-neutral-200 prose prose-invert max-w-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input 
            className="flex-1 bg-neutral-800 p-2 rounded-lg border border-neutral-700 text-neutral-100" 
            placeholder="Intervene..." 
            value={intervention}
            onChange={(e) => setIntervention(e.target.value)}
          />
          <button 
            className="bg-neutral-700 p-2 rounded-lg hover:bg-neutral-600"
            onClick={() => setAppliedIntervention(intervention)}
          >Send</button>
        </div>
      </div>

      {/* Right Pane: Agent List & Status */}
      <div className="w-80 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-neutral-50">Agents</h2>
          <button className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700" onClick={() => setShowModal(true)}>
            <Plus size={20} />
          </button>
        </div>
        <div className="flex-1 space-y-2">
          {agents.map(agent => (
            <div key={agent.id} className="p-3 bg-neutral-800 rounded-lg border border-neutral-700">
              <p className="font-bold text-neutral-100">{agent.name} {agent.isOrchestrator && '(Orchestrator)'}</p>
              <p className="text-xs text-neutral-400">{agent.persona.slice(0, 30)}...</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <button className="flex-1 bg-emerald-700 p-2 rounded-lg hover:bg-emerald-600 text-neutral-50" onClick={runSimulation}>Start</button>
          <button className="bg-neutral-700 p-2 rounded-lg hover:bg-neutral-600" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          <button className="bg-red-700 p-2 rounded-lg hover:bg-red-600" onClick={() => shouldStop.current = true}><StopCircle size={20} /></button>
        </div>
        {status && (
          <div className="p-4 bg-neutral-950 rounded-lg text-sm border border-neutral-800">
            <p className="font-bold text-neutral-300">Status:</p>
            <p className="text-neutral-400">{status.message}</p>
          </div>
        )}
      </div>

      {showModal && <AgentConfigModal onSave={addAgent} onClose={() => setShowModal(false)} />}
    </div>
  );
}
