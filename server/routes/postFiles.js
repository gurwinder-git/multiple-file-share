import express from 'express';
import path from 'path';
import AdmZip from 'adm-zip';
import FileModel from '../models/fileShareModel.js';
import deleteExpiredLink from '../scripts/deleteExpiredLink.js';

const router = express.Router();

router.post('/uploadFiles', async (req, res) => {

    const { path, uniqueName, fileSize, expireLinkTime } = req.body


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
        isVideo: false
    })
    try {
        const result = await document.save();

        //     //delete Expired link
        //     setTimeout(() => { deleteExpiredLink(result._id) }, expireLinkTime * 60 * 60 * 1000);

        // send response
        res.status(200).json({ downloadFileLink: `${process.env.APP_BASE_URL}/download/${result._id}` });
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ internalError: 'Internal Server error.' });
    }
})


export default router;



// class A{

//     constructor(){
//         this.objArray = [];
//     }

//     set(a){
//         this.objArray.push(a);
//     }

//     funcRead(){
//         return (this.objArray)
//     }
// }

// let obj = new A();

// obj.set(2);
// obj.set(3);
// obj.set(4);
// let res = obj.funcRead();
// console.log(res)
