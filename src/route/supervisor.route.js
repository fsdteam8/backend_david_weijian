import express from 'express';
import {getAllUsersForSupervisor} from "../controller/supervisor.controller.js"
import { isSupervisor } from '../middleware/role.middleware.js';
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = express.Router();

router.get('/all-user', verifyJWT, isSupervisor, getAllUsersForSupervisor)

export default router