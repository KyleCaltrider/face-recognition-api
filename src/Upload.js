import React from 'react';

const Upload = function(props) {
    return(
        <div id="bulk" className="">
            <label>Upload Users:
                <input type="file" name="bulk" accept="image/*" multiple onChange={props.upload} />
            </label>
            <label>Compare:
                <input type="file" name="image" accept="image/*" onChange={(e) => props.compare(e.target.files[0])} />
            </label>
        </div>
    )
}


export default Upload