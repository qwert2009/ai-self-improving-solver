from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator, Field
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        extra='ignore',
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=True
    )

    DEEPSEEK_API_KEY: str = Field(..., min_length=1, description="DeepSeek API key")
    GEMINI_API_KEY: str = Field(..., min_length=1, description="Google Gemini API key")
    SECRET_KEY: str = Field(..., min_length=10, description="Secret key for sessions")

    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com/v1"
    GEMINI_BASE_URL: str = "https://generativelanguage.googleapis.com/v1beta"

    MODEL_TEMPERATURE: float = Field(default=0.7, ge=0.0, le=2.0)
    MODEL_MAX_TOKENS: int = Field(default=4096, ge=1, le=32000)
    DEEPSEEK_MODEL: str = "deepseek-reasoner"
    GEMINI_MODEL: str = "gemini-2.5-flash"

    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    DATABASE_URL: str = "sqlite+aiosqlite:///./senior_project.db"

    HTTP_PROXY: Optional[str] = None
    HTTPS_PROXY: Optional[str] = None

    REDIS_URL: Optional[str] = None

    @field_validator('DEEPSEEK_API_KEY', 'GEMINI_API_KEY')
    @classmethod
    def validate_api_keys(cls, v, info):
        if not v or len(v) < 10:
            logger.warning(f"API key '{info.field_name}' may be invalid (too short)")
        return v

    @field_validator('LOG_LEVEL')
    @classmethod
    def validate_log_level(cls, v):
        valid_levels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']
        if v.upper() not in valid_levels:
            logger.warning(f"Invalid LOG_LEVEL '{v}', using INFO")
            return 'INFO'
        return v.upper()

    def validate_connection(self) -> dict:
        issues = []
        warnings = []

        if not self.DEEPSEEK_API_KEY or self.DEEPSEEK_API_KEY.startswith('change-me'):
            issues.append("DeepSeek API key is not configured")
        if not self.GEMINI_API_KEY or self.GEMINI_API_KEY.startswith('change-me'):
            issues.append("Gemini API key is not configured")

        if self.SECRET_KEY.startswith('change-me'):
            warnings.append("SECRET_KEY should be changed in production")

        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "warnings": warnings,
            "debug_mode": self.DEBUG
        }


try:
    settings = Settings()
except Exception as e:
    logger.error(f"Failed to load settings: {e}")
    settings = Settings(
        DEEPSEEK_API_KEY="",
        GEMINI_API_KEY="",
        SECRET_KEY="change-me-in-production-123"
    )
