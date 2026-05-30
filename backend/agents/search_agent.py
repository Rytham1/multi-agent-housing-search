from agents import Agent, WebSearchTool
from openai import OpenAI  # Use the standard OpenAI client

# 1. Setup the client to point to your LOCAL Ollama server
# No real API key is needed, but 'ollama' is a common placeholder
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

INSTRUCTIONS = (
    "You are a research assistant. Given a search term, you search the web for that term..."
)

# 2. Assign the model and the client to your agent
search_agent = Agent(
    name="Search agent",
    model="llama3.1",  # Matches the name in your 'ollama list'
    instructions=INSTRUCTIONS,
    tools=[WebSearchTool()],
    # If your Agent class accepts a custom client, pass it here:
    # client=client 
)