import React from 'react'
import '../../css/dragdropsection.css'

function DragDropSection() {
    return (
        <div className="dragDropSection">
            <h1 className="uploadIcon"><i className="bi bi-cloud-upload"></i></h1>

            <h3>Drag and Drop or, <span id="dragSpan"> browse. </span></h3>

            <h6>Delete files from cloud after
                <select name="expireLinkTime" className="expireTimeSelector">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="24">24</option>
                </select> hours
            </h6>

            <div id="myProgress">
                <div id="myBar">20%</div>
            </div>

            <button id="uploadBtn">upload files</button>
        </div>
    )
}

export default DragDropSection
