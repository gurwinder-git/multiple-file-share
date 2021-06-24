import React, { useState } from 'react'
import '../../css/dragdropsection.css'

function DragDropSection() {
    let [validInput, setValidInput] = useState(undefined)

    function handelDragEnter(e){
        // e.preventDefault();
        // e.stopPropagation()
        setValidInput(true)
    }
    
    function handelDragLeave(e){
        // e.preventDefault();
        // e.stopPropagation()
        setValidInput(undefined)
    }
    
    
    function handelDragOver(e){
        e.preventDefault();

    }

    function handelOnDrop(e){
        e.preventDefault();
        e.stopPropagation()
        setValidInput(undefined)
        console.log(e.dataTransfer.files)
    }
    return (
        <div className="dragDropSection">

            <div onDragEnter={handelDragEnter} 
                onDragOver={handelDragOver}
                onDragLeave={handelDragLeave}
                onDrop={handelOnDrop}
                className={` dragZone ${validInput === true?  "dragEnterStyleOnValidInput" :validInput === false? "dragEnterStyleOnInvalidValidInput": "" }`}>

                <h1 className="uploadIcon"><i className="bi bi-cloud-upload"></i></h1>
                <h3>Drag and Drop file here.</h3>

            </div>

            <span id="dragSpan"> browse files. </span>

            <h6>Delete files from cloud after
                <select name="expireLinkTime" className="expireTimeSelector">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="24">24</option>
                </select> hours
            </h6>

            {/* <div id="myProgress">
                <div id="myBar">20%</div>
            </div> */}

            <button id="uploadBtn">upload files</button>
        </div>
    )
}

export default DragDropSection
