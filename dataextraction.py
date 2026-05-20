import json
import os

import requests
from dotenv import load_dotenv
from pathlib import Path


# https://app.rentcast.io/app/api

load_dotenv()

BASE_URL = "https://api.rentcast.io/v1"
API_KEY = os.getenv("RENTCAST_API_KEY")

params = {
    "city": "Davis",
    "state": "CA",
    "status": "Active",
    "limit": 500,
}

def fetch_listings():
    headers = {
        "Accept": "application/json",
        "X-Api-Key": API_KEY, 
    }

    # https://developers.rentcast.io/reference/rental-listings-long-term
    url = f"{BASE_URL}/listings/rental/long-term"

    response = requests.get(url, headers=headers, params=params, timeout=30)
    response.raise_for_status()
    listings = response.json()

    return listings

def save_to_json(listings, path="data/listings.json"):
    out = Path(path)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(listings, indent=2), encoding="utf-8")
    print(f"Saved {len(listings)} listings to {path}")


if __name__ == "__main__":
    listings = fetch_listings()
    save_to_json(listings)
    