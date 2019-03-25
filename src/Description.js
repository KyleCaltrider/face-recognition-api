import React from 'react';

const APP_DESCRIPTION = `This app needs media device access (camera) and JavaScript enabled to run.
Press the Photo Button to snap a pic and compare it to known users. Add a new known face by either filling in New User > Submit (snaps a new pic), or by using the Upload Users option.
To upload a new user(s) image, name the photo(s) after the user in the picture (1 user per photo on this step, ex: "Pickle Rick.jpg").
Use the Compare upload option to search an uploaded image for known users.
If the app knows who's in the photo it will display their user names above.`

const APP_DISCLAIMER = `** This app needs to set a cookie to keep an open user collection of facial recognition data.
Only the active browser with unique cookie has access to the users in the collection. The button bellow can be used to erase the current session
collection from the database. As a precaution, all collections in the demo database are removed nightly.`

const Description = (props) => {
    return (
        <div id="description">
        <p id="welcome">Welcome to my facial recognition demo app.</p>
        <ul>
          <strong>Highlights:</strong>
          <li>Python Backend built on Flask</li>
          <li>MongoDB Storage</li>
          <li>ReactJS Frontend</li>
          <li>Identifies users in a photo</li>
          <li>Image upload options for adding known users and comparing users</li>
          <li>Expandable but session based user collection</li>
        </ul>
        <p id="usage-info" className="text-small">{APP_DESCRIPTION}</p>
        <p id="disclaimer" className="text-small">{APP_DISCLAIMER}</p>
      </div>
    )
}

export default Description