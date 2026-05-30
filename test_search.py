import asyncio
import os
from openai import AsyncOpenAI
from agents import Agent, Runner, RunConfig, function_tool, OpenAIChatCompletionsModel
from ddgs import DDGS

# 1. Setup Environment & Client
os.environ["OPENAI_TRACING_ENABLED"] = "false"
os.environ["OPENAI_API_KEY"] = "ollama"

local_client = AsyncOpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

# Define the model once to share across agents
ollama_model = OpenAIChatCompletionsModel(
    model="llama3.1",
    openai_client=local_client
)

# 2. Define the Search Tool
@function_tool
def simple_search(query: str) -> str:
    """Searches DuckDuckGo for live housing and rent information."""
    print(f"🔍 [Tool] Searching web for: {query}")
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=5))
        if not results:
            return "No results found."
        return "\n\n".join([f"Source: {r['href']}\nContent: {r['body']}" for r in results])
    except Exception as e:
        return f"Search failed: {str(e)}"

# 3. Define the Search Agent
# Its only job is to use the tool and return the RAW data
search_agent = Agent(
    name="SearchAgent",
    model=ollama_model,
    instructions=(
        "You are a search specialist. Your ONLY goal is to use the 'simple_search' tool "
        "to find information about the user's query. Return the search results exactly "
        "as they appear. Do not add your own commentary."
    ),
    tools=[simple_search],
)

# 4. Define the Summarizer Agent
summarizer_agent = Agent(
    name="Summarizer",
    model=ollama_model,
    instructions="Summarize the provided search results into 3 concise bullet points with URLs."
)

# 5. The Multi-Agent Loop
async def run_housing_workflow(user_query: str):
    print(f"\n--- Starting Workflow for: {user_query} ---")
    
    # STEP 1: Let the Search Agent get the data
    search_result = await Runner.run(search_agent, user_query)
    raw_data = search_result.final_output
    
    # STEP 2: Let the Summarizer clean it up
    final_result = await Runner.run(
        summarizer_agent, 
        input=f"Summarize this data for the user's query '{user_query}':\n\n{raw_data}"
    )
    
    print("\n--- FINAL REPORT ---")
    print(final_result.final_output)

if __name__ == "__main__":
    query = input("🏠 Enter your housing query: ")
    asyncio.run(run_housing_workflow(query))