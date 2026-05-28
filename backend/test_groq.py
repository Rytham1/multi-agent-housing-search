from groq_client import chat

if __name__ == "__main__":
    reply = chat("What is the best college near sacramento, respond in one short sentence.")
    print(reply)