import express from 'express'
import { importRoute } from '../controller/importRoute.controller.js'

const router = express.Router()

router.post("/", importRoute)

export default router