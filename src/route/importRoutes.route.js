import express from 'express'

const importRoutesRouter = express.Router()

importRoutesRouter.post("/", importRoute)

export default authRouter