from pymongo import MongoClient
import face_recognition as fr
import pickle
from PIL import Image, ImageDraw
import numpy as np


class FacialRecognition:
    def __init__(self, app):
        self.app = app

    def get_db(self):
        """ Returns a MongoPy MongoDB database connection """
        client = MongoClient(self.app.config['DATABASE_URI'])
        return client['face-recognition-demo']

    def encode_face(self, img):
        """ Creates facial encodings for a supplied image. Returns the encoding
        if any faces were encoded from the image """
        img = fr.load_image_file(img)
        img = fr.face_encodings(img)
        if len(img) > 0:
            print("Successfully Encoded Face")
            return img
        else:
            print("Failed To Find Face")
            return [False]

    def compare_faces(self, unknown_encoding, tolerance, user):
        """ Compares an unknown facial encoding to encodings in the database
        and looks for a match. Returns DB user entry if found, else an empyt dict """
        if unknown_encoding is not False:
            db = self.get_db()
            users = db[user]
            cursor = users.find()
            all = [user.copy() for user in cursor]
            #db.close()
            print(f"Comparing {len(all)} faces to unknown face")
            distances = fr.face_distance([pickle.loads(user['encoding']) for user in all], unknown_encoding)
            matches = []
            for dist, user in zip(distances, all):
                user['distance'] = dist
                if user['distance'] <= tolerance: matches.append(user)
            if len(matches) > 0:
                    matches.sort(key=lambda x: x['distance'])
                    print(f"{len(matches)} Matche(s) Found")
                    print(f"Returning Match {matches[0]['user']}")
                    return matches[0]
        return False

    def add_user(self, name, img, user):
        """ Inserts a new user document with fields "user" & "encoding"
        into the database if a face is found. Returns True/False for success """
        db = self.get_db()
        users = db[user]
        encoding = self.encode_face(img)
        if encoding[0] is not False and len(encoding) == 1:
            users.insert_one({"user": name, "encoding": pickle.dumps(encoding[0])})
            print(f"Inserted User, {name}, in face-recognition-demo collection {user}")
            #db.close()
            return True
        return False