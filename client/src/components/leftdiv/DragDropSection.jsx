import React, { useState, useEffect, useContext } from 'react'
import '../../css/dragdropsection.css'
import axios from 'axios'
import { responseContext } from '../../App'
import JsZip from 'jszip'
// import UserMessage from '../messages/UserMessage'


function DragDropSection() {
    let [validInput, setValidInput] = useState(undefined)
    let [files, setFiles] = useState([])
    let [filesSize, setFilesSize] = useState(0)
    let [fileSizeError, setFileSizeError] = useState(false)
    let [exipreTime, setExipreTime] = useState(1)
    let [progress, setProgress] = useState(0)

    //response context
    let { setResponse } = useContext(responseContext);

    function handelDragEnter(e) {
        e.preventDefault()
        setValidInput(true)
    }

    function handelDragLeave(e) {
        e.preventDefault();
    }

    function handelDragOver(e) {
        e.preventDefault();
    }

    function traverseFileTree(item, path) {
        path = path || "";
        if (item.isFile) {
            // Get file
            item.file(function (file) {
                // console.log("File:", path + file.name);
                // console.log('inside for loop')
                setFiles(pre => [...pre, file])
                // setFilesSize(pre => pre + file.size)
            })
        } else if (item.isDirectory) {
            // Get folder contents
            let dirReader = item.createReader();
            dirReader.readEntries(function (entries) {
                for (let i = 0; i < entries.length; i++) {
                    traverseFileTree(entries[i], path + item.name + "/");
                }
            })
        }
    }

    function handelOnDrop(e) {
        e.preventDefault()
        setFiles([])
        setFilesSize(0)

        let items = e.dataTransfer.items
        for (let i = 0; i < items.length; i++) {
            // webkitGetAsEntry is where the magic happens
            let item = items[i].webkitGetAsEntry();
            if (files.length > 20) break
            if (item) {
                traverseFileTree(item)
            } else {
                setValidInput(false)
                break
            }
        }

        // console.log('inside on drop after for loop')
        // setValidInput(undefined)
    }

    function handelSelection(e) {
        setExipreTime(e.target.value)
    }

    // useEffect(() => {

    // }, [files])

    useEffect(() => {
        let filesSizeVar = 0
        for (let i = 0; i < files.length; i++) {
            filesSizeVar += files[i].size
        }
        setFilesSize(filesSizeVar)

        if (filesSizeVar > (100 * 1024 * 1024)) {
            setFileSizeError(true)
            setValidInput(false)
        } else {
            setFileSizeError(false)
        }
    }, [files])

    async function fileInputHandeler(e) {
        setValidInput(undefined)
        setFilesSize(0)
        setFiles([])
        setFileSizeError(false)




        // let filesArray = Array.from(e.target.files)
        // if (filesArray.length !== 0) {
        setFiles(e.target.files)
        setValidInput(true)
        // } else {
        //     setValidInput(undefined)
        // }

        // console.log('input file', filesArray)
    }

    async function handelBtnClick(e) {
        setResponse({})
        let formData = new FormData()

        if (files.length === 0) {
            return alert('Please select minimum 1 file.')
        }

        if (files.length > 20) {
            return alert('Maximum 20 files are allowed')
        }

        if (filesSize > 100 * 1024 * 1024) {
            setFileSizeError(true)
            setValidInput(false)
            return alert('Upload Error: Files size greater than 100 MB')
        }

        document.getElementById('disabledDiv').classList.add('disablesDivStyle')

        if (Object.keys(files).length > 1) {
            // formData.append('expireLinkTime', exipreTime)

            const zip = new JsZip();

            console.log(files)
            for (let i = 0; i < files.length; i++) {
                zip.file(files[i].name, files[i])
            }

            const content = await zip.generateAsync({ type: "blob" })

            // formData.append('userFiles', file)
            // console.log(files, "files")
            // console.log(content, "content")
            formData.append("file", content, "gndec.zip");
            formData.append("api_key", "295952167159356");
            formData.append('upload_preset', 'shareData')

            try {

                let cloudRes = await axios.post('https://api.cloudinary.com/v1_1/ergurwindercloud/raw/upload', formData, {
                    onUploadProgress: progressEvent => setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
                })
                console.log(cloudRes)

                /////////////////////////////////////////

                // if (res.status === 200) {
                //     setProgress(0)
                document.getElementById('disabledDiv').classList.remove('disablesDivStyle')
                //     setResponse(res.data)
                // setFiles([])
                //     setValidInput(undefined)
                // }


            } catch (err) {
                console.log(err)
            }

        } else {
            // formData.append('expireLinkTime', exipreTime)


            formData.append("file", files[0]);
            formData.append("api_key", "295952167159356");
            formData.append('upload_preset', 'shareData')

            try {


                let cloudRes = await axios.post('https://api.cloudinary.com/v1_1/ergurwindercloud/raw/upload', formData, {
                    onUploadProgress: progressEvent => setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
                })

                console.log(cloudRes)

                //////////////////////////////////////////////////////////////////////////


                // if (res.status === 200) {
                setProgress(0)
                document.getElementById('disabledDiv').classList.remove('disablesDivStyle')
                // setResponse(res.data)
                setFiles([])
                setValidInput(undefined)
                // }

            } catch (err) {
                console.log(err, "catch")
            }
        }
    }










    return (
        <div className="dragDropSection" id="disabledDiv">

            <div onDragEnter={handelDragEnter}
                onDragOver={handelDragOver}
                onDragLeave={handelDragLeave}
                onDrop={handelOnDrop}
                className={` dragZone ${validInput === true ? "dragEnterStyleOnValidInput" : validInput === false ? "dragEnterStyleOnInvalidValidInput" : ""}`}>

                <h1 className="uploadIcon"><i className="bi bi-cloud-upload"></i></h1>
                <h3>Drag & Drop files here.</h3>
                {fileSizeError ? <small style={{ color: 'red' }}>Upload Error: file Size Greater than 100 MB</small> : ''}

                {!fileSizeError && validInput && files.length !== 0 ? <small>Total Files are <b>{files.length} </b>Maximun allowed <b>20</b></small> : ''}

                {validInput === false && !fileSizeError ? <small style={{ color: 'red' }}>Upload Error: Please Select files only</small> : ''}
            </div>

            <input type="file" name="userFiles" id="fileInput" hidden multiple onChange={fileInputHandeler} />
            <span id="dragSpan" onClick={() => document.getElementById("fileInput").click()}> Browse files. </span>

            <h6>Delete files from cloud after
                <select name="expireLinkTime" value={exipreTime} onChange={handelSelection} className="expireTimeSelector">
                    <option value="1">1</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="24">24</option>
                </select> hours
            </h6>

            {progress !== 0 ? <div id="myProgress">
                <div className="myBar" style={{ width: `${progress}%` }}>{`${progress}%`}</div>
            </div> : ''}

            <button id="uploadBtn" disabled={validInput && !fileSizeError ? false : true} onClick={handelBtnClick}>upload files</button>
        </div>
    )
}

export default DragDropSection
