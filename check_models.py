"""
Script to check available models from DeepSeek and Gemini APIs
"""
import asyncio
import httpx

async def check_deepseek_models(api_key: str):
    """Check available DeepSeek models"""
    print("\n=== DeepSeek Models ===")
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.get(
                "https://api.deepseek.com/models",
                headers={"Authorization": f"Bearer {api_key}"}
            )
            if response.status_code == 200:
                data = response.json()
                models = data.get("data", [])
                print(f"Found {len(models)} models:")
                for model in models:
                    print(f"  - {model.get('id', 'unknown')}")
                    print(f"    Created: {model.get('created', 'N/A')}")
                    print(f"    Description: {model.get('description', 'N/A')}")
            else:
                print(f"Error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Error: {e}")

async def check_gemini_models(api_key: str):
    """Check available Gemini models"""
    print("\n=== Gemini Models ===")
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.get(
                f"https://generativelanguage.googleapis.com/v1/models?key={api_key}"
            )
            if response.status_code == 200:
                data = response.json()
                models = data.get("models", [])
                # Filter for generative models
                gen_models = [m for m in models if 'generateContent' in m.get('supportedGenerationMethods', [])]
                print(f"Found {len(gen_models)} generative models:")
                for model in gen_models:
                    name = model.get('name', 'unknown').replace('models/', '')
                    display_name = model.get('displayName', 'N/A')
                    print(f"  - {name} ({display_name})")
            else:
                print(f"Error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    # Load API keys from .env
    import os
    from dotenv import load_dotenv
    load_dotenv()
    
    deepseek_key = os.getenv("DEEPSEEK_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    if not deepseek_key:
        print("DEEPSEEK_API_KEY not found in .env")
    else:
        asyncio.run(check_deepseek_models(deepseek_key))
    
    if not gemini_key:
        print("GEMINI_API_KEY not found in .env")
    else:
        asyncio.run(check_gemini_models(gemini_key))
