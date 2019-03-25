import React from 'react';

const NewUser = function(props) {
    return (
        <form id="registration" className="options-bar">
            <label>
                New User:
                <input type='text' name='user' value={props.user} onChange={props.userChange} required/>
            </label>
            <button onClick={props.click}>Submit</button>
        </form>
    )
}

export default NewUser;