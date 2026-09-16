import requests
import os
from io import BytesIO

clients = {
    "IIM Indore": "iimidr.ac.in",
    "Panasonic": "panasonic.com",
    "IIT Indore": "iiti.ac.in",
    "Choithram Hospital": "choithramhospital.com",
    "Choithram Schools Indore": "choithramschool.com",
    "GBL Hospital Indore": "gblhospital.com",
    "V-One Hospital Indore": "vonehospital.com",
    "CHL Care Hospital": "carehospitals.com",
    "Natural Living Pvt. Ltd. Indore": "naturalliving.co.in",
    "Balaji Hormone Pvt. Ltd.": "balajihormone.com",
    "Ralson Tyres Pvt. Ltd.": "ralson.com",
    "RRCAT Indore": "rrcat.gov.in",
    "BARC Mumbai": "barc.gov.in",
    "Heavy water plant Manuguru": "hwb.gov.in",
    "NFC Hyderabad": "nfc.gov.in",
}

os.makedirs('public/clients', exist_ok=True)

for name, domain in clients.items():
    filename = f"public/clients/{name.replace(' ', '_').replace('.', '').lower()}.png"
    if domain:
        url = f"https://logo.clearbit.com/{domain}"
        print(f"Fetching {url} for {name}...")
        try:
            res = requests.get(url, timeout=5)
            if res.status_code == 200:
                with open(filename, 'wb') as f:
                    f.write(res.content)
                print(" -> Success downloaded.")
                continue
        except Exception as e:
            pass
    print(f" -> No logo found for {name}.")
