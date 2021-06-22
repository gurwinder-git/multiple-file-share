import FileModel from '../models/fileShareModel.js'
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();

async function deleteExpiredLink(id){
    try{
        //delete zip file
        let result = await FileModel.find({_id: id})
        fs.unlinkSync(path.join('uploads', `${result[0].fileName}`));
        console.log('file deleted')
        
        //delete document from database
        await FileModel.deleteOne({_id: id})
        console.log('document deleted');
    }catch(err){
        console.log(err);
    }
}

export default deleteExpiredLink;