import React, { Component } from 'react';
import './App.css';
import NewUser from './New_User.js';
import Upload from './Upload.js';
import Description from './Description.js';

class App extends Component {
  constructor(props) {
    super(props);
    // State
    this.state = {
      photoURL: '',
      user: undefined
    }
    // Bind Class Methods Here
    this.handleVideo = this.handleVideo.bind(this);
    this.handleTakePhoto = this.handleTakePhoto.bind(this);
    this.checkIdentity = this.checkIdentity.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleDeleteAllUsers = this.handleDeleteAllUsers.bind(this);
    this.handleBulkUpload = this.handleBulkUpload.bind(this);
  }

  componentDidMount() {
    this.handleVideo();
  }

  handleBulkUpload(e) {
    e.preventDefault();
    console.log("POST to /register")
    const name = e.target.name, 
          files = e.target.files
    console.log("Name:", name, "Files:", files)
    const form = new FormData();
    for (let key in files) form.append(name, files[key])
    const success = () => {
      alert(req.responseText)
      console.log("Response:", req.responseText)
    }
    let req = new XMLHttpRequest();
    req.open('POST', "/register");
    req.onload = success;
    req.send(form);
  }

  handleUserChange(e) {
    this.setState({user: e.target.value})
  }

  handleVideo() {
    console.log("Starting Video Stream From Media Device")
    const success = stream => {
      const vid = document.getElementById('camera-display');
      window.stream = stream;
      vid.srcObject = stream;
      let tracks = stream.getVideoTracks();
      console.log('Track 0: ', tracks[0]);
      let trackCapabilities = tracks[0].getCapabilities();
      console.log('Capabilities: ', trackCapabilities);
    }
    const error = err => {
      alert("Can't Get Video!");
      console.log('getUserMedia Error: ', err);
    }
    navigator.mediaDevices
              .getUserMedia({video: true})
              .then(success)
              .catch(error);
  }

  handleTakePhoto(callback) {
    console.log("Taking Photo From Media Device")
    const success = stream => {
      const track = stream.getVideoTracks()[0];
      const imgCapture = new ImageCapture(track);
      imgCapture.takePhoto()
                .then(blob => {
                  callback(blob);
                })
    }
    const error = err => {
      alert("Can't Take Photo!");
      console.log("getUserMedia Error:", err);
    };

    navigator.mediaDevices
              .getUserMedia({video: true})
              .then(success)
              .catch(error);
  }

  checkIdentity(img) {
    console.log("POST to /identify")
    const success = () => {
      const d = JSON.parse(req.response);
      if (this.state.photoURL) URL.revokeObjectURL(this.state.photoURL)
      this.setState({photoURL: URL.createObjectURL(img)})
      if (d.length) {
        const new_users = d.map(user => user.user)
        console.log("Response:", d);
        console.log('New Users:', new_users);
        this.setState({user: new_users, showRegistration: false});
      }
      else {
        this.setState({user: "Unknown User(s)"})
        console.log("Response", d);
      }
    }
    let form = new FormData();
    form.append('image', img, 'user-image.jpeg');

    let req = new XMLHttpRequest();
    req.open("POST", "/identify");
    req.onload = success;
    req.send(form);
  }

  registerUser(img) {
    console.log("POST to /register")
    const success = () => {
      console.log('Response:', req.responseText);
      alert(req.responseText);
    }

    let form = new FormData();
    form.append('user', this.state.user);
    form.append('image', img, 'user-image.jpeg');

    let req = new XMLHttpRequest();
    req.open('POST', "/register");
    req.onload = success;
    req.send(form);
  }

  handleDeleteAllUsers() {
    const success = () => {
      console.log('Response:', req.responseText);
      alert(req.responseText);
    }

    let req = new XMLHttpRequest();
    req.open('GET', "/delete");
    req.onload = success;
    req.send();
  }

  render() {
    const imgAlt = "https://via.placeholder.com/500x400?text=Take+A+Picture!"
  
    return (
      <div className="App">
        <div id='photo-container'>
          <h3 id="users">Users In This Photo:<br/>{this.state.user}</h3>
          <img id="photo" src={this.state.photoURL || imgAlt} />
        </div>
        <NewUser user={this.state.user}
                 userChange={this.handleUserChange}
                 click={(e) => {
                  e.preventDefault();
                  this.handleTakePhoto(this.registerUser);
                 }}
        />
        <Upload upload={this.handleBulkUpload} compare={this.checkIdentity}/>
        <button className='button' onClick={() => this.handleTakePhoto(this.checkIdentity)}><i className="fas fa-camera"></i></button>
        <video id='camera-display' autoPlay playsInline>
          Your browser does not support the media tag
        </video>
        <h1 id="title" className="title">Facial Recognition API Demo</h1>
        <h2 id="subtitle" className="title">Powered by Python & ReactJS</h2>
        <Description />
        <button id="delete-db" onClick={this.handleDeleteAllUsers}><strong>Erase User Facial Recognition Data</strong></button>
      </div>
    );
  }
}

export default App;
