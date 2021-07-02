import React ,{useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import '../css/download.css'
import axios from 'axios'

function Download() {
    const {id} = useParams()
    let [response, setResponse] = useState({})
    let [error, setError] = useState(false)
    let [videoPlayer, setVideoPlayer] = useState(false)

    async function fetchdata(){
        try {
            const res = await axios.get(`/download/${id}`)
            if(res.status === 200){
                // console.log(res.data)
                let {downloadLink, fileName, linkWillExpireAt, size, timeLeftToExpireLink, isVideo} = res.data

                linkWillExpireAt = new Date(linkWillExpireAt).toLocaleString()

                if(timeLeftToExpireLink > 3600000){
                    let hours = timeLeftToExpireLink / (1000 * 60 * 60)
                    timeLeftToExpireLink = `${hours.toFixed(2)} hours`
                }
                if(timeLeftToExpireLink > 60000 && timeLeftToExpireLink < 3600000){
                    let mint = timeLeftToExpireLink / (1000 * 60)
                    timeLeftToExpireLink = `${mint.toFixed(2)} minutes`
                }
                
                if(timeLeftToExpireLink < 60000){
                    let sec = timeLeftToExpireLink / 1000
                    timeLeftToExpireLink = `${sec.toFixed(2)} seconds`
                }

                size = `${Math.ceil(size / (1024 * 1024))} MB`

                setResponse({ downloadLink, fileName, linkWillExpireAt, size, timeLeftToExpireLink, isVideo })
            }
            if(res.status === 202){
                console.log(res.data)
                setError(true)
            }
            if(res.status === 500){
                console.log('Internal Server error')
            }
            
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        fetchdata()
    }, [])
    return (
        <>
            <h3 className="logo">
                <a href="/" className="logoLink">Share-Files</a> 
            </h3>
            { Object.keys(response).length !== 0?
            <div id="downloadDiv">
                <h1><i className="bi bi-download"></i></h1>
                <h3>Your file is ready to download</h3>

                <div className="timeDetailes">
                    <small><b>Link expire at: {`${response.linkWillExpireAt}`}</b></small>
                    <small>Time left to expire link <b>{`${response.timeLeftToExpireLink}`}</b></small>
                </div>

                <h5><b>{`${response.fileName}`}</b></h5>
                <small>Size: <b>{`${response.size}`}</b></small>

                <div className="btns">
                    {response.isVideo? <button onClick={() => setVideoPlayer(true)}>Play online</button>: null}
                    <a href={`${response.downloadLink}`} download><button>Download files</button></a>
                </div>
                {videoPlayer? <div className="video">
                    <div className="close">
                        <i className="bi bi-x-lg" onClick={() => setVideoPlayer(false)}></i>
                    </div>
                    <video controls>
                        <source src={`${response.downloadLink}`} type="video/mp4"/>
                        <source src={`${response.downloadLink}`} type="video/ogg"/>
                        Your browser does not support the video tag.
                    </video>
                </div>: ''}
                
            </div>: !error? 'Please wait...': ''}

            {error? <div className='errorDiv'>
                <i className="bi bi-exclamation-octagon-fill"></i>
                <h3 className="errorMessage">Link Expired !</h3>
            </div>: null}
        </>
    )
}

export default Download
