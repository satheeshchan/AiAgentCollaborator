This project is an AI-powered agent orchestration platform.
It allows you to configure multiple AI agents with custom personas and orchestrate them in a collaborative discussion. The application features:
Orchestration Engine: A central orchestrator agent that moderates the discussion, manages conversation history, and dynamically decides which agent should speak next.
Interactive Simulation: A real-time simulation environment where you can start, pause, and stop agent discussions, and intervene with your own commands at any time.
Configurable Agents: A flexible interface to add and customize agents, including their personas and API configurations.
Modern UI: A clean, dark-themed interface with Markdown support for formatted discussion output.
This App is vibe coded using Google AI studio.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
