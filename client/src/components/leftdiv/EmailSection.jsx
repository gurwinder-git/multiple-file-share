import React, {useContext} from 'react'
import '../../css/emailsection.css'
import {responseContext} from '../../App'

function EmailSection() {
    //response context
    let {response} = useContext(responseContext);
    return (
        Object.keys(response).length !== 0?
        <div className="emailSection">
            <small>Copy Link</small>
            <div id="linkDiv">
                <input value={response.downloadFileLink} type="text" name="dowloadLink" id="dowloadLink" disabled={true} />
                <button className="copyBtn" onClick={() =>  {navigator.clipboard.writeText(response.downloadFileLink); alert('Link copied to Clipboard')}}>copy link</button>
            </div>
                
            <small>Or Send Mail</small>
            <fieldset>
                <legend>Your Email:</legend>
                <input type="email" name="senderEmail" autoFocus={true}/>
            </fieldset>

            <fieldset>
                <legend>Receivers Email:</legend>
                <input type="email" name="receiverEmail"/>
            </fieldset>

            <button id="mailBtn">Send mail</button>
        </div>: ''
    )
}

export default EmailSection
