from flask import Flask, render_template, request, jsonify, session
from flask_bcrypt import Bcrypt
from facial_recognition import FacialRecognition
import re
import os

# Instantiate App & Get Configurations
app = Flask(__name__, static_folder="../build/static", template_folder="../build")
app.config.from_object(__name__)
app.config.from_envvar('APP_SETTINGS', silent=True)
app.config['DATABASE_URI'] = os.environ["DATABASE_URI"]
app.config['FACE_TOLERANCE'] = float(os.environ["FACE_TOLERANCE"])
app.secret_key = os.urandom(16)
fr = FacialRecognition(app)
bcrypt = Bcrypt(app)

# ---- App Routes ----- #
def handle_error(error):
    print(error)
    return error.__str__()

@app.route("/")
def index():
    """Sends the ReactJS App Webpack Bundle"""
    return render_template("index.html")


@app.route("/identify", methods=['POST'])
def identify():
    """ Route for identifying a previously identified user. Takes a supplied image
       and compares it's encoding to encodings in the database. Returns the user if
       a match is found.
    """
    if "user" not in session:
        session["user"] = str(bcrypt.generate_password_hash(request.remote_addr)).replace('$','').replace('.', '')
    user = session["user"]
    print(f"User: {user}")
    if 'image' in request.files:
        img = request.files['image']
        unk_encodings = fr.encode_face(img)
        users = [fr.compare_faces(encoding, app.config['FACE_TOLERANCE'], user) for encoding in unk_encodings]
        users = [{'user': entry['user'], 'distance': entry['distance']} for entry in users if entry]
        return jsonify(users)
    else:
        error = "No Image Found In Request Files"
    return handle_error(error)

@app.route("/register", methods=['POST'])
def register_new_users():
    """ Route for registering a new user. Takes a supplied image and user name
       and inserts a new user in the DB """
    error = []
    if "user" not in session:
        session["user"] = str(bcrypt.generate_password_hash(request.remote_addr)).replace('$','').replace('.', '')
    user = session["user"]
    print(f"User: {user}")
    if 'image' in request.files and 'user' in request.form:
        img = request.files['image']
        name = request.form['user']
        success = fr.add_user(name, img, user)
        if success: return "New User Added"
        else: return "Failed To Find Face, User Not Added"

    elif 'bulk' in request.files:
        images = request.files.getlist("bulk")
        users_added = []
        users_failed = []
        for image in images:
            fn = image.filename
            name = re.search(r".+(?=\.[^.]+$)", fn)[0]
            success = fr.add_user(name, image, user)
            if success: users_added.append(name)
            else: users_failed.append(name)
        if not users_failed:
            return f"Added {len(users_added)} user(s) to session collection"
        else:
            if users_added:
                return f"Failed to add {len(users_failed)} user(s): {users_failed}\n{len(users_added)} user(s) added to session collection"
            else:
                error.append("Failed To add any users to session collection")
    else: error.append("No 'bulk' file, or 'image' file & 'user' name submitted")

    return handle_error(error)

@app.route("/delete", methods=["GET"])
def delete_collection():
    """ Route for removing all user data from the database storage """
    if 'user' in session:
        user = session["user"]
        db = fr.get_db()
        if user in db.list_collection_names():
            db.drop_collection(user)
    return "User Collection Has Been Reset"


if __name__ == "__main__":
    app.run(host="0.0.0.0")
