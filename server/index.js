import express from 'express'
import router from './routes/postFiles.js'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import { downloadRouter } from './routes/downloadFiles.js'
import uploadFileRouter from './routes/postFile.js'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

//Database connection
connectDB();

//middleware
// app.use('/', express.static('./uploads'))
// app.use(fileUpload())
app.use(express.json())
app.use(cors())

//routes
app.get('/', (req, res) => {
    res.send("hello world")
})
app.use('/files/', router)
app.use('/file', uploadFileRouter)
app.use('/downloadApi/', downloadRouter)

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));