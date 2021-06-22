import express from 'express'
import FileModel from '../models/fileShareModel.js'

const downloadRouter = express.Router()

downloadRouter.get('/:id', async (req, res) => {
    // console.log(req.params.id)
    try{
        const result = await FileModel.findOne({_id: req.params.id})

        let {fileName, path, size, linkExpireAt} = result

        if(!result){
            return res.status(404).json({error: 'File not found'});
        }
        res.status(200).json({
            fileName: fileName,
            downloadLink: `${process.env.APP_BASE_URL}/${path}`,
            size: size,
            timeLeftToExpireLink: linkExpireAt - Date.now(),
            linkWillExpireAt: linkExpireAt
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({error: 'Internal Server Error.'})
    }
})
export {downloadRouter};