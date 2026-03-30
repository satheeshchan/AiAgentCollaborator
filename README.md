🤖 Multi-Agent Orchestrator
An AI-powered platform for collaborative agent simulations.

This project is a sophisticated agent orchestration platform designed to bring custom AI personas into a single, collaborative discussion. Watch agents debate, brainstorm, or solve problems in real-time.

✨ Key Features
🧠 Orchestration Engine
A central "Master" agent moderates the flow. It doesn't just pass the mic; it manages conversation history and dynamically decides which agent is best suited to speak next.

🎮 Interactive Simulation
Real-time Control: Start, pause, and stop discussions on the fly.

User Intervention: Jump into the chat at any time to steer the conversation or provide new context.

👤 Configurable Agents
Custom Personas: Define unique backgrounds, tones, and expertise for every participant.

Flexible API Configs: Easily swap models or adjust parameters per agent.

🎨 Modern UI
Dark Mode by Default: A sleek, developer-focused interface.

Markdown Support: Beautifully rendered code blocks, lists, and formatting within the agent responses.

🚀 Getting Started
Follow these steps to get your own orchestration environment running locally.

1. Prerequisites
Node.js (Latest LTS recommended)

A Gemini API Key from Google AI Studio 
Or
Any local LLM

## Run Locally

**Prerequisites:**  Node.js

# Clone the repository
git clone https://github.com/....

# Navigate to the project folder
cd your-repo-name

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key or local LLM url
3. Run the app:
   `npm run dev`
Open http://localhost:3000 with your browser to see the result.

🌐 Local LLM & Offline Support
Want to run completely offline? You can point the orchestrator to a local provider (like Ollama, LM Studio, or vLLM) by overriding the base URL in your configuration.

Updated .env.local Configuration
To use a local LLM, modify your environment variables to redirect requests to your local OpenAI-compatible endpoint:
# For Google Gemini (Default)
GEMINI_API_KEY=your_gemini_api_key

# For Local LLM (OpenAI-compatible API)
NEXT_PUBLIC_BASE_URL=http://localhost:11434/v1  # Example for Ollama
OPENAI_API_KEY=not-needed-for-local             # Usually required as a placeholder
CUSTOM_MODEL_NAME=llama3                        # Specify your local model
🛠️ Built With
Google Gemini API - The brains behind the agents.

Next.js / React - For the interactive UI.

Tailwind CSS - For the dark-themed styling.

Vibe Coding - Architected and refined via Google AI Studio.
