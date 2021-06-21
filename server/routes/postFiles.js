import express from 'express';
import path from 'path';
import AdmZip from 'adm-zip';

const router = express.Router();
var zipper = new AdmZip();

router.post('/uploadFiles', (req, res) => {
    const userFiles = req.files.userFiles;
    const expireLinkTime = req.body.expireLinkTime

    //validate request
    if(!userFiles || !expireLinkTime){
        return res.status(422).json({error: "input required fields."})
    }

    //convert files into zip and store on server
    let dataBuffer = null;
    for(let i = 0; i < userFiles.length; i++){
        dataBuffer = new Buffer(userFiles[i].data, 'utf-8');
        zipper.addFile(userFiles[i].name, dataBuffer); // (name of file inside zip, buffer)
    }
    
    let uniqueName = `${Date.now()}_${Math.round(Math.random() * 1E9)}.zip`;
    zipper.writeZip(`uploads/${uniqueName}`);

    //store file path in database


    //send response
    res.send('ok')
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
