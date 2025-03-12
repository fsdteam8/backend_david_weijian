import express from 'express'
import { importRoute } from '../controller/importRoute.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post("/", verifyJWT, importRoute)

export default router