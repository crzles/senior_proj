from pydantic_settings import BaseSettings, SettingsConfigDict

# #creates a class that will return DATABASE_URL variable from env
class Settings(BaseSettings):
    DATABASE_URL : str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    GOOGLE_MAPS_API_KEY: str
    VITE_GOOGLE_MAPS_API_KEY: str
    # For the AI Insights page. Optional: without a key the page says insights aren't set up.
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    model_config = SettingsConfigDict (
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
    
    
settings = Settings()