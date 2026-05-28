import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

MAX_OUTPUT_TOKENS = int(os.getenv("GROQ_MAX_OUTPUT_TOKENS", "256"))
MODEL = "llama-3.1-8b-instant"


def get_groq_client() -> OpenAI:
    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        if not os.getenv("GROQ_API_KEY"):
            raise ValueError("GROQ_API_KEY missing from .env")
        api_key=os.getenv("GROQ_API_KEY"),
    )
    return client

if not os.getenv("GROQ_API_KEY"):
    raise ValueError("GROQ_API_KEY missing from .env")

def chat(user_message: str, system_message: str = "You are a helpful assistant.") -> str:
    client = get_groq_client()

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            # THE SYSTEM PROMPT (HIDDEN FROM USER)
            {"role": "system", "content": system_message},

            # THE USER MESSAGE
            {"role": "user", "content": user_message},
        ],

        max_tokens=MAX_OUTPUT_TOKENS,
        temperature=0.2,
    )

    return response.choices[0].message.content or ""