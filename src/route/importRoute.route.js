import express from 'express'
import { importRoute } from '../controller/importRoute.controller'

const importRoutesRouter = express.Router()

importRoutesRouter.post("/", importRoute)

export default authRouter