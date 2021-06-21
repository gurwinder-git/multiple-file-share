import express from 'express'

const downloadRouter = express.Router()

downloadRouter.get('/:id', (req, res) => {
    // console.log(req.params.id)
    res.send(req.params.id)
})
export {downloadRouter};