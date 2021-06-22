import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    linkExpireAt: {
        type: Number,
        required: true
    },
    sender: {
        type: String,
        required: false
    },
    receiver: {
        type: String,
        required: false
    }

}, {timestamps: true})

const FileModel = new mongoose.model('FileCollection', fileSchema);

export default FileModel