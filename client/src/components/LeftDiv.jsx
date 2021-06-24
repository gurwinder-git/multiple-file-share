import React from 'react'
import '../css/leftdiv.css'
import DragDropSection from './leftdiv/DragDropSection'
import EmailSection from './leftdiv/EmailSection'

function LeftDiv() {
    return (
        <div className="leftDiv">
            <div className="fileShareAndEmail">
                <DragDropSection/>
                {/* <EmailSection/> */}
            </div>
        </div>
    )
}

export default LeftDiv