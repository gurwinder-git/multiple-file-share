import React from 'react'
import '../../css/emailsection.css'

function EmailSection() {
    return (
        <div className="emailSection">
            <small>Copy Link</small>
            <div id="linkDiv">
                <input value="http://share-file.com/download/7b6c384765c3b6583cb "type="text" name="dowloadLink" id="dowloadLink" disabled={true} />
                <button className="copyBtn">copy link</button>
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
        </div>
    )
}

export default EmailSection
