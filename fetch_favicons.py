import requests
import os

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
    url = f"https://www.google.com/s2/favicons?domain={domain}&sz=128"
    print(f"Fetching {url} for {name}...")
    try:
        res = requests.get(url, timeout=10)
        with open(filename, 'wb') as f:
            f.write(res.content)
        print(" -> Success.")
    except Exception as e:
        print(f" -> Failed: {e}")
