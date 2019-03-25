from pymongo import MongoClient
import schedule, time, os, datetime

def reset():
    uri = os.environ['DATABASE_URI']
    client = MongoClient(uri)
    db = client['face-recognition-demo']
    names = [n for n in db.list_collection_names() if n != 'system.indexes']
    print(f"{datetime.datetime.now()}: Removing {len(names)} collections from the database")
    for collection in names:
        db.drop_collection(collection)


def main():
    schedule.every().day.at('00:01:00').do(reset)
    print("Starting Scheduled Nightly Database Reset")
    while True:
        schedule.run_pending()
        time.sleep(1)


if __name__ == '__main__':
    main()