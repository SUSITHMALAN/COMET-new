import os
from sqlalchemy import text, create_engine
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL")

if not db_url:
    print("Error: DATABASE_URL not found in .env file")
    exit(1)

print(f"Connecting to database...")

try:
    engine = create_engine(db_url)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Successfully connected to Supabase!")
        print(f"Result: {result.fetchone()}")
except Exception as e:
    print(f"Failed to connect: {e}")
