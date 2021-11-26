import mongoose from 'mongoose'


function connectDB() {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }).then(() => console.log('connection Successfull')).catch((err) => console.log(err.message))
}

export default connectDB;