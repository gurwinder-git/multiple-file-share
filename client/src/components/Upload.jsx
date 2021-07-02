import React from 'react'
import '../css/upload.css'
import LeftDiv from './LeftDiv'
import RightDiv from './RightDiv'

function Upload() {
    return (
        <div id="uploadDiv">
            <h3 className="logo">
                <a href="/" className="logoLink">Share-Files</a> 
            </h3>
            <div className="main">
                <LeftDiv/>
                <RightDiv/>
            </div>
        </div>
    )
}

export default Upload