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
    let [isFiles, setIsFiles] = useState(true)
    let [anotherInfo, setAnotherInfo] = useState("")

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

    function resetPage() {
        setFilesSize(0)
        setFileSizeError(false)
        setFiles([])
        setProgress(0)
        setValidInput(undefined)
        setIsFiles(true)
    }


    function handelOnDrop(e) {
        e.preventDefault()
        resetPage()

        const filesObj = {}
        filesObj.length = 0

        let items = e.dataTransfer.items

        for (let i = 0; i < items.length; i++) {

            // webkitGetAsEntry is where the magic happens
            let item = items[i].webkitGetAsEntry();
            if (item) {
                if (item.isFile) {
                    // Get file
                    item.file(file => {
                        filesObj[filesObj.length] = file
                        filesObj.length += 1
                    })
                }

            } else {
                setIsFiles(false)
                setValidInput(false)
                return
            }
        }

        setTimeout(() => {
            setFiles(filesObj)
            setValidInput(true)
        }, 400);
    }

    function handelSelection(e) {
        setExipreTime(e.target.value)
    }


    useEffect(() => {
        let sizeOFFiles = 0;

        for (let i = 0; i < files.length; i++) {
            sizeOFFiles += files[i].size
        }

        if (sizeOFFiles > (100 * 1024 * 1024)) {
            setFileSizeError(true)
            setValidInput(false)
        } else {
            setFileSizeError(false)
            setFilesSize(sizeOFFiles)
        }
    }, [files])

    function fileInputHandeler(e) {
        resetPage();

        if (e.target.files.length > 0) {
            setFiles(e.target.files)
            setValidInput(true)
        } else {
            resetPage()
            setValidInput(undefined)
        }
    }

    async function handelBtnClick(e) {
        setResponse({})
        const formData = new FormData()

        if (files.length === 0) {
            return alert('Please select minimum 1 file.')
        }

        if (files.length > 20) {
            return alert('Maximum 20 files are allowed')
        }

        if (filesSize > 100 * 1024 * 1024) {
            return alert('Upload Error: Files size greater than 100 MB')
        }

        document.getElementById('disabledDiv').classList.add('disablesDivStyle')

        if (files.length > 1) {
            setAnotherInfo("Zipping your files...")

            const zip = new JsZip();

            console.log(files)
            for (let i = 0; i < files.length; i++) {
                zip.file(files[i].name, files[i])
            }

            const content = await zip.generateAsync({ type: "blob" })

            setAnotherInfo("uploading...")

            formData.append("file", content, "gndec.zip");
            formData.append("api_key", "295952167159356");
            formData.append('upload_preset', 'shareData')

            try {
                //uploading meadia on cloudinary
                let cloudRes = await axios.post('https://api.cloudinary.com/v1_1/ergurwindercloud/raw/upload', formData, {
                    onUploadProgress: progressEvent => setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
                })
                console.log(cloudRes)


                if (cloudRes.status === 200) {
                    setAnotherInfo("please wait...")
                    const formDataForBackend = {}
                    formDataForBackend['isItVideo'] = false
                    formDataForBackend['expireLinkTime'] = exipreTime
                    formDataForBackend['fileSize'] = filesSize
                    formDataForBackend['uniqueName'] = cloudRes.data.public_id
                    formDataForBackend['path'] = cloudRes.data.secure_url


                    //uploading on node server
                    const nodeRes = await axios.post('files/uploadFiles', formDataForBackend)

                    if (nodeRes.status === 200) {
                        setResponse(nodeRes.data)
                        setAnotherInfo("")
                    } else {
                        throw new Error("something went wrong.")
                    }
                }
                else {
                    throw new Error("something went wrong.")
                }

                document.getElementById('disabledDiv').classList.remove('disablesDivStyle')

                resetPage()

            } catch (err) {
                console.log(err)
                setAnotherInfo("")
                alert("Something went wrong")
                document.getElementById('disabledDiv').classList.remove('disablesDivStyle')
            }

        } else {
            console.log(files[0])

            formData.append("file", files[0]);
            formData.append("api_key", "295952167159356");
            formData.append('upload_preset', 'shareData')

            try {
                setAnotherInfo("uploading...")
                //cloudinary request
                let cloudRes = await axios.post('https://api.cloudinary.com/v1_1/ergurwindercloud/raw/upload', formData, {
                    onUploadProgress: progressEvent => setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
                })

                console.log(cloudRes)

                if (cloudRes.status === 200) {
                    setAnotherInfo("please wait...")
                    const formDataForBackend = {}

                    if (files[0].type.includes('audio') || files[0].type.includes('video')) {
                        formDataForBackend['isItVideo'] = true
                    }
                    else {
                        formDataForBackend['isItVideo'] = false
                    }

                    formDataForBackend['expireLinkTime'] = exipreTime
                    formDataForBackend['fileSize'] = filesSize
                    formDataForBackend['uniqueName'] = cloudRes.data.public_id
                    formDataForBackend['path'] = cloudRes.data.secure_url

                    const nodeRes = await axios.post('file/uploadFile', formDataForBackend)

                    if (nodeRes.status === 200) {
                        setResponse(nodeRes.data)
                        setAnotherInfo("")
                    } else {
                        throw new Error("something went wrong.")
                    }
                }
                else {
                    throw new Error("something went wrong.")
                }

                document.getElementById('disabledDiv').classList.remove('disablesDivStyle')
                resetPage()

            } catch (err) {
                setAnotherInfo("")
                alert("Something went wrong")
                document.getElementById('disabledDiv').classList.remove('disablesDivStyle')
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
                className={` dragZone ${validInput === true ? "dragEnterStyleOnValidInput" : validInput === false ? "dragEnterStyleOnInvalidValidInput" : ""}`}
            >

                <h1 className="uploadIcon"><i className="bi bi-cloud-upload"></i></h1>
                <h3>Drag & Drop files here.</h3>
                {fileSizeError ? <small style={{ color: 'red' }}>Upload Error: file Size Greater than 100 MB</small> : ''}

                {files.length > 0 ? <small>Total Files are <b>{files.length} </b>Maximun allowed <b>20</b></small> : ''}

                {isFiles === false ? <small style={{ color: 'red' }}>Upload Error: Please Select files only</small> : null}

                {anotherInfo ? <small style={{ color: 'white' }}>{anotherInfo}</small> : null}
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

            {progress > 0 ? <div id="myProgress">
                <div className="myBar" style={{ width: `${progress}%` }}>{`${progress}%`}</div>
            </div> : ''}

            <button id="uploadBtn" disabled={!validInput || fileSizeError || files.length <= 0 ? true : false} onClick={handelBtnClick}>upload files</button>
        </div>
    )
}

export default DragDropSection
