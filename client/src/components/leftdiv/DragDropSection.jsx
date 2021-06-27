import React, { useState, useEffect } from 'react'
import '../../css/dragdropsection.css'
// import UserMessage from '../messages/UserMessage'


function DragDropSection() {
    let [validInput, setValidInput] = useState(undefined)
    let [files, setFiles] = useState([])
    let [filesSize, setFilesSize] = useState(0)
    let [fileSizeError, setFileSizeError] = useState(false)
    let [exipreTime, setExipreTime] = useState(5)

    function handelDragEnter(e){
        e.preventDefault()
        setValidInput(true)
    }
    
    function handelDragLeave(e){
        e.preventDefault();
    }
    
    function handelDragOver(e){
        e.preventDefault();
    }

    function traverseFileTree(item, path) {
        path = path || "";
        if (item.isFile) {
          // Get file
          item.file(function(file) {
            // console.log("File:", path + file.name);
            // console.log('inside for loop')
            setFiles(pre => [...pre, file])
            // setFilesSize(pre => pre + file.size)
          })
        } else if (item.isDirectory) {
          // Get folder contents
          let dirReader = item.createReader();
          dirReader.readEntries(function(entries) {
            for (let i=0; i<entries.length; i++) {
              traverseFileTree(entries[i], path + item.name + "/");
            }
          })
        }
    }

    function handelOnDrop(e){
        e.preventDefault()
        setFiles([])
        setFilesSize(0)

        let items = e.dataTransfer.items
        for (let i=0; i<items.length; i++) {
            // webkitGetAsEntry is where the magic happens
            let item = items[i].webkitGetAsEntry();
            if(files.length > 20) break
            if (item) {
                traverseFileTree(item)
            }else{
                setValidInput(false)
                break
            }
        }

        // console.log('inside on drop after for loop')
        // setValidInput(undefined)
    }

    function handelSelection(e){
        setExipreTime(e.target.value)
    }

    // useEffect(() => {
        
    // }, [files])

    useEffect(() => {
        setFilesSize(0)
        for(let i=0; i< files.length; i++){
            setFilesSize((pre) => pre + files[i].size)
        }
        if(filesSize > (100 * 1024 * 1024)){
            setFileSizeError(true)
            setValidInput(false)   
        }else{
            setFileSizeError(false)
        }
    }, [files])

    function fileInputHandeler(e){
        setValidInput(undefined)
        setFilesSize(0)
        setFiles([])
        setFileSizeError(false)

        let filesArray = Array.from(e.target.files)

        if(filesArray.length !== 0){
            setFiles(filesArray)
            setValidInput(true)
        }
        if(filesArray.length === 0){
            setValidInput(undefined)
        }
        
        // console.log('input file', filesArray)
    }

    async function handelBtnClick(e){
        let formData = new FormData()
        console.log(files)

        if(files.length === 0){
            return alert('Please select minimum 1 file.')
        }

        if(files.length > 20){
            return alert('Maximum 20 files are allowed')
        }
        
        if(files.length > 1){
            formData.append('expireLinkTime', exipreTime)

            for(let i in files){
                formData.append('userFiles', files[i])
            }
    
            let res = await fetch('files/uploadFiles', {
                method: 'POST',
                body: formData
            }) 
    
            let data = await res.json()
            
            console.log(data)
        }

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
                {fileSizeError? <small style={{color: 'red'}}>Upload Error: file Size Greater than 100 MB</small>: '' }
                <small hidden>{filesSize}</small>
                {!fileSizeError && validInput && files.length !== 0? <small>Total Files are <b>{files.length} </b>Maximun allowed <b>20</b></small>: ''}

                {validInput === false && !fileSizeError? <small style={{color: 'red'}}>Upload Error: Please Select files only</small>: ''}
            </div>

            <input type="file" name="userFiles" id="fileInput" hidden multiple onChange={fileInputHandeler}/>
            <span id="dragSpan" onClick={() => document.getElementById("fileInput").click()}> browse files. </span>

            <h6>Delete files from cloud after
                <select name="expireLinkTime" value={exipreTime} onChange={handelSelection} className="expireTimeSelector">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="24">24</option>
                </select> hours
            </h6>

            {/* <div id="myProgress">
                <div id="myBar">20%</div>
            </div> */}

            <button id="uploadBtn" disabled={validInput && !fileSizeError? false: true} onClick={handelBtnClick}>upload files</button>
        </div>
    )
}

export default DragDropSection
