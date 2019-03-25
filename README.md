# Facial Recognition Demo
## Welcome to my facial recognition demo app
The server backend is a Python flask app, data storage is in the form of a mongo database, and the frontend a React app.

Structure:
* server
    * server.py - Flask-based API
    * facial_recognition.py - Class for DB access and face_recognition methods
* build:
    * webpack compiled React app
* schedule
    * scheduling python script to wipe database nightly
* public
    * index.html
* src
    * React App & Components JS

## Running
This repository includes 2 Dockerfiles as well as a docker-compose.yml for container orchestration. To user, ensure Docker/Docker-Compose is configured to run on your machine.

1. Fork the repository
2. `cd` into the local folder
3. `$ docker-compose up`

The first build make take a while. If all goes well, the 3 images should be running and the app will be accessible on port [5000](http://localhost:5000)

#### The API has two main actions.

The first is adding a face encoding and a name to a user's DB collection, this means a name and a face photo need to be supplied. This action can be done in bulk.

The second action is comparing a face encoding (derived from a supplied photo) to all encodings in the user's DB collection.

#### React App

The demo app provides an interface for uploading image-name pairs. This can be done by entering a **new user** name and **submitting** a photo taken on-the-fly by the app. Bulk upload of images is also possible. Prior to upload, ensure the **filename** of each face image corresponds to the face in the image (ex: "SpongeBob.jpeg")

The demo app also lets you upload an image to compare against known faces. This can be done via an upload or on-the-fly photo taken by the app via the camera button.