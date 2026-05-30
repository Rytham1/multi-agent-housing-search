import ollama
import sys

print("Python process started...")

def run_test():
    model_name = 'llama3.1'
    
    print(f"Connecting to Ollama to find: {model_name}")
    
    # Simple list check
    try:
        models = ollama.list()
        print(f"Successfully connected! You have {len(models['models'])} models installed.")
    except Exception as e:
        print(f"ERROR: Could not connect to the Ollama server: {e}")
        print("Is the Ollama app running in your menu bar?")
        return

    print("Sending prompt...")
    
    # Using generate for a simpler test
    response = ollama.generate(model=model_name, prompt="Say 'Hello from Llama 3.1'")
    
    print("\n--- Response ---")
    print(response['response'])
    print("----------------")

if __name__ == "__main__":
    run_test()
    print("Python process finished.")