import httpx
import json
import logging
from typing import Optional, Dict, Any
from backend.config import settings

logger = logging.getLogger(__name__)


class LLMClient:
    def __init__(self, provider: str = "deepseek"):
        self.provider = provider
        if provider == "deepseek":
            self.api_key = settings.DEEPSEEK_API_KEY
            self.base_url = settings.DEEPSEEK_BASE_URL.rstrip('/')
            self.model = settings.DEEPSEEK_MODEL
            self.endpoint = "/chat/completions"
        else:
            self.api_key = settings.GEMINI_API_KEY
            self.base_url = settings.GEMINI_BASE_URL.rstrip('/')
            self.model = settings.GEMINI_MODEL
            self.endpoint = f"/models/{self.model}:generateContent"

    async def chat(self, messages: list, temperature: float = None, max_tokens: int = None) -> str:
        temperature = temperature if temperature is not None else settings.MODEL_TEMPERATURE
        max_tokens = max_tokens or settings.MODEL_MAX_TOKENS

        # For deepseek-reasoner, don't override temperature
        if self.provider == "deepseek" and self.model == "deepseek-reasoner":
            temperature = None  # Reasoner model uses its own reasoning temperature

        client_kwargs = {
            "timeout": httpx.Timeout(120.0, connect=30.0),
            "limits": httpx.Limits(max_keepalive_connections=5, max_connections=10),
        }

        if settings.HTTP_PROXY or settings.HTTPS_PROXY:
            proxy_url = settings.HTTP_PROXY or settings.HTTPS_PROXY
            client_kwargs["proxy"] = proxy_url

        async with httpx.AsyncClient(**client_kwargs) as client:
            if self.provider == "deepseek":
                return await self._call_deepseek(client, messages, temperature, max_tokens)
            else:
                return await self._call_gemini(client, messages, temperature, max_tokens)

    async def _call_deepseek(self, client: httpx.AsyncClient, messages: list, temperature: float, max_tokens: int) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": max_tokens
        }

        if temperature is not None:
            payload["temperature"] = temperature

        try:
            response = await client.post(f"{self.base_url}{self.endpoint}", headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            
            # Handle deepseek-reasoner response format
            if self.model == "deepseek-reasoner":
                choice = data["choices"][0]["message"]
                # Reasoner model returns both reasoning and content
                return choice.get("content", "")
            
            return data["choices"][0]["message"]["content"]
        except httpx.HTTPStatusError as e:
            logger.error(f"DeepSeek API error: {e.response.status_code} - {e.response.text}")
            raise RuntimeError(f"DeepSeek API error: {e.response.status_code}")
        except httpx.RequestError as e:
            logger.error(f"DeepSeek request error: {str(e)}")
            raise RuntimeError(f"Failed to connect to DeepSeek: {str(e)}")
        except KeyError as e:
            logger.error(f"Unexpected DeepSeek response format: {e}")
            raise RuntimeError(f"Invalid response from DeepSeek")

    async def _call_gemini(self, client: httpx.AsyncClient, messages: list, temperature: float, max_tokens: int) -> str:
        prompt = ""
        system_instruction = ""
        
        for msg in messages:
            if msg["role"] == "system":
                system_instruction = msg["content"]
            elif msg["role"] == "user":
                prompt += msg["content"] + "\n"

        headers = {
            "Content-Type": "application/json"
        }

        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "maxOutputTokens": max_tokens
            }
        }

        if temperature is not None:
            payload["generationConfig"]["temperature"] = temperature

        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        try:
            response = await client.post(
                f"{self.base_url}{self.endpoint}?key={self.api_key}",
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except httpx.HTTPStatusError as e:
            logger.error(f"Gemini API error: {e.response.status_code} - {e.response.text}")
            raise RuntimeError(f"Gemini API error: {e.response.status_code}")
        except httpx.RequestError as e:
            logger.error(f"Gemini request error: {str(e)}")
            raise RuntimeError(f"Failed to connect to Gemini: {str(e)}")
        except (KeyError, IndexError) as e:
            logger.error(f"Unexpected Gemini response format: {e}")
            raise RuntimeError(f"Invalid response from Gemini")

    async def list_models(self) -> Dict[str, Any]:
        """Get available models from the provider"""
        client_kwargs = {
            "timeout": httpx.Timeout(30.0, connect=10.0),
        }

        async with httpx.AsyncClient(**client_kwargs) as client:
            if self.provider == "deepseek":
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                try:
                    response = await client.get(f"{self.base_url}/models", headers=headers)
                    response.raise_for_status()
                    return {"models": response.json().get("data", [])}
                except Exception as e:
                    return {"error": str(e)}
            else:
                try:
                    response = await client.get(f"{self.base_url}/models?key={self.api_key}")
                    response.raise_for_status()
                    return {"models": response.json().get("models", [])}
                except Exception as e:
                    return {"error": str(e)}
