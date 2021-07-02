import express from 'express'
import FileModel from '../models/fileShareModel.js'
import deleteExpiredLink from '../scripts/deleteExpiredLink.js'
import path from 'path'

const uploadFileRouter = express.Router()

uploadFileRouter.post('/uploadFile', async (req, res) => {
    // console.log(req.files.userFile)

    const userFile = req.files.userFile;
    const expireLinkTime = req.body.expireLinkTime
    // console.log(req.files.userFile)
    // console.log(req.body.expireLinkTime)

    //validate request
    if(!userFile || !expireLinkTime){
        return res.status(422).json({error: "input required fields."})
    }

    let fileSize = userFile.size
    let fileType = userFile.mimetype.split('/')
    let fileExtension = path.extname(userFile.name)
    let uniqueName = ''
    let filePath = ''
    let isItVideo = undefined
    if(fileType.includes('video') || fileExtension === '.mp4' || fileExtension === '.3gp' || fileExtension === '.mkv' || fileExtension === '.MKV' || fileExtension === '.mp3'){
        uniqueName = `${Date.now()}_${userFile.name}`;
        filePath = uniqueName;
        isItVideo = true
    }else{
        uniqueName = `${Date.now()}_${userFile.name}`;
        filePath = uniqueName;
        isItVideo = false
    }

    // store file on server
    userFile.mv(`uploads/${uniqueName}`, (err) => {if(err) console.log(err)} )
    
    //store file in database
    const document = new FileModel({
        fileName: uniqueName,
        path: filePath,
        size: fileSize,
        linkExpireAt: Date.now() + ( expireLinkTime * 60 * 60 * 1000 ),
        isVideo: isItVideo
    })

    try{
        const result = await document.save();
        
        //delete Expired link
        setTimeout(() => {deleteExpiredLink(result._id)}, expireLinkTime * 60 * 60 * 1000);
            
        // send response
        res.status(200).json({downloadFileLink: `${process.env.APP_BASE_URL}/download/${result._id}`});
    }catch(err){
        console.log(err.message)
        res.status(500).json({internalError: 'Internal Server error.'});
    }
})

export default uploadFileRouter;