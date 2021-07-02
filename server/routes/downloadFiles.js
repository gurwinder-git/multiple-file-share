import express from 'express'
import FileModel from '../models/fileShareModel.js'

const downloadRouter = express.Router()

downloadRouter.get('/:id', async (req, res) => {
    // console.log(req.params.id)
    try{
        const result = await FileModel.findOne({_id: req.params.id})

        if(!result){
            return res.status(202).json({error: 'File not found'});
        }

        let {fileName, path, size, linkExpireAt, isVideo} = result

        res.status(200).json({
            fileName: fileName,
            downloadLink: `${process.env.APP_BASE_URL}/${path}`,
            size: size,
            timeLeftToExpireLink: linkExpireAt - Date.now(),
            linkWillExpireAt: linkExpireAt,
            isVideo
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({error: 'Internal Server Error.'})
    }
})
export {downloadRouter};