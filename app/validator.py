import os
import sys
from typing import Optional, List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def validate_environment() -> bool:
    """
    Validates all required environment variables.
    Returns True if validation passes, exits with error if it fails.
    """
    errors : List[str] = []
    
    
    # Required environment variables
    required_vars = {
        "DATABASE_URL",
        "SECRET_KEY",
        "ALGORITHM",
        "ACCESS_TOKEN_EXPIRE_MINUTES"
    }  
    
    
    # Check if all required variables are set
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            errors.append(f"Missing required environment variable: {var}")
            
    # Validate SECRET_KEY is not the default/example value
    secret_key = os.getenv("SECRET_KEY", "")
    if secret_key and secret_key in ["replace_with_a_long_random_secret", "test-secret-key", ""]:
        errors.append("SECRET_KEY must be set to a secure random value, not the default/example")
        
    # Validate DATABASE_URL format
    database_url = os.getenv("DATABASE_URL", "")
    if database_url and not database_url.startswith(("postgresql://", "postgresql+psycopg2://")):
        errors.append(f"DATABASE_URL must start with 'postgresql://' or 'postgresql+psycopg2://', got: {database_url[:20]}...")
        
     # Validate ACCESS_TOKEN_EXPIRE_MINUTES is a number
    token_expire = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "")
    if token_expire and not token_expire.isdigit():
        errors.append("ACCESS_TOKEN_EXPIRE_MINUTES must be a number")
        
        
    # If there are errors, print them and exit
    if errors:
        print("Environment validation failed:")
        print("\nErrors found: ")
        for error in errors:
            print(f"  - {error}")
        print("\nPlease check your .env file and ensure all required variables are set correctly.")
        print("Copy .env.example to .env and fill in the values.")
        sys.exit(1)
    
    print("Environment validation passed!")
    return True



def validation_on_startup():
    """
    Call this function in FastAPI startup event to validate environment.
    """
    
    try:
        validate_environment()
    except Exception as e:
        print(f"Unexpected error during environment validation: {e}")
        sys.exit(1)

    