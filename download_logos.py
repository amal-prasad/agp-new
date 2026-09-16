from duckduckgo_search import DDGS
import requests
import os
import time

queries = [
    "IIM Indore", 
    "Panasonic", 
    "IIT Indore", 
    "Choithram Hospital", 
    "Choithram Schools Indore", 
    "GBL Hospital Indore", 
    "V-One Hospital Indore", 
    "CHL Care Hospital", 
    "Natural Living Pvt Ltd Indore", 
    "Balaji Hormone Pvt Ltd", 
    "Ralson Tyres", 
    "RRCAT Indore",
    "BARC Mumbai", 
    "Heavy water plant Manuguru", 
    "NFC Hyderabad"
]

os.makedirs('public/clients', exist_ok=True)

with DDGS() as ddgs:
    for q in queries:
        img_url = None
        for keyword_suffix in ["logo transparent png", "logo"]:
            try:
                print(f"Searching for {q} {keyword_suffix}...")
                results = list(ddgs.images(keywords=f"{q} {keyword_suffix}", max_results=1))
                if results and 'image' in results[0]:
                    img_url = results[0]['image']
                    break
            except Exception as e:
                print(f"Search failed for {q}: {e}")
                time.sleep(1)
                
        if img_url:
            try:
                # keep extension clean
                ext = img_url.split('.')[-1].split('?')[0].lower()
                if ext not in ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif']:
                    ext = 'png'
                
                filename = f"public/clients/{q.replace(' ', '_').lower()}.{ext}"
                print(f"Downloading {img_url} to {filename}...")
                
                # Fetch image
                headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.3'}
                response = requests.get(img_url, headers=headers, timeout=10)
                if response.status_code == 200:
                    with open(filename, 'wb') as f:
                        f.write(response.content)
                else:
                    print(f"Failed to download {q}, status {response.status_code}")
            except Exception as e:
                print(f"Download failed for {q}: {e}")
        else:
            print(f"No result found for {q}")
        time.sleep(1) # slightly rate limit
