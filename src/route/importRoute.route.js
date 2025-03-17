import express from 'express'
import { importRoute } from '../controller/importRoute.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'
import { isUser } from "../middleware/role.middleware.js"

const router = express.Router()

router.post("/", verifyJWT, isUser, importRoute)

export default router;