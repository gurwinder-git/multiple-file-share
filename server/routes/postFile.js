import express from 'express'
import FileModel from '../models/fileShareModel.js'
import deleteExpiredLink from '../scripts/deleteExpiredLink.js'

const uploadFileRouter = express.Router()

uploadFileRouter.post('/uploadFile', async (req, res) => {
    const { path, uniqueName, fileSize, expireLinkTime, isItVideo } = req.body


    //validate request
    if (!path || !expireLinkTime || !uniqueName || !fileSize) {
        return res.status(400).json({ error: "Something went wrong" })
    }

    //store file in database
    const document = new FileModel({
        fileName: uniqueName,
        path: path,
        size: fileSize,
        linkExpireAt: Date.now() + (expireLinkTime * 60 * 60 * 1000),
        isVideo: isItVideo
    })

    try {
        const result = await document.save();

        //delete Expired link
        // setTimeout(() => { deleteExpiredLink(result._id) }, expireLinkTime * 60 * 60 * 1000);

        // send response
        return res.status(200).json({ downloadFileLink: `${process.env.APP_BASE_URL}/download/${result._id}` });
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ internalError: 'Internal Server error.' });
    }
})

export default uploadFileRouter;