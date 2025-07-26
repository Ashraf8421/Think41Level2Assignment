import os
import pandas as pd
from pymongo import MongoClient

# Configuration
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "ecommerce"
CSV_FOLDER = "csv_files"  # put your .csv files in this folder

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def load_csv_to_collection(csv_path, collection_name):
    print(f"Inserting from: {csv_path} into collection: {collection_name}")
    df = pd.read_csv(csv_path)
    records = df.to_dict(orient='records')
    if records:
        db[collection_name].delete_many({})  # Optional: clear old data
        db[collection_name].insert_many(records)
        print(f"✅ Inserted {len(records)} records into '{collection_name}' collection.")
    else:
        print(f"⚠️ No records found in {csv_path}")

def main():
    for file_name in os.listdir(CSV_FOLDER):
        if file_name.endswith(".csv"):
            collection_name = file_name.replace(".csv", "").lower()
            csv_path = os.path.join(CSV_FOLDER, file_name)
            load_csv_to_collection(csv_path, collection_name)

    print("\n🎉 All CSV files have been loaded into MongoDB.")

if __name__ == "__main__":
    main()
