from pydantic_settings import BaseSettings, SettingsConfigDict

# #creates a class that will return DATABASE_URL variable from env
class Settings(BaseSettings):
    DATABASE_URL : str
    SECRET_KEY: str

    model_config = SettingsConfigDict (
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )