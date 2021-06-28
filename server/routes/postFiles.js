import express from 'express';
import path from 'path';
import AdmZip from 'adm-zip';
import FileModel from '../models/fileShareModel.js';
import deleteExpiredLink from '../scripts/deleteExpiredLink.js';

const router = express.Router();

router.post('/uploadFiles', async (req, res) => {
    let zipper = new AdmZip();
    
    const userFiles = req.files.userFiles;
    const expireLinkTime = req.body.expireLinkTime
    // console.log(req.files.userFiles)
    // console.log(req.body.expireLinkTime)

    //validate request
    if(!userFiles || !expireLinkTime){
        return res.status(422).json({error: "input required fields."})
    }

    //convert files into zip and store on server
    let dataBuffer = null;
    let zipSize = 0;

    for(let i = 0; i < userFiles.length; i++){
        dataBuffer = new Buffer(userFiles[i].data, 'utf-8');
        zipper.addFile(userFiles[i].name, dataBuffer); // (name of file inside zip, buffer)
        zipSize += userFiles[i].size;
    }
    
    const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1E9)}.zip`;
    zipper.writeZip(`uploads/${uniqueName}`);

    const path = uniqueName;

    //store file path in database
    const document = new FileModel({
        fileName: uniqueName,
        path: path,
        size: zipSize,
        linkExpireAt: Date.now() + ( expireLinkTime * 60 * 60 * 1000 )
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
