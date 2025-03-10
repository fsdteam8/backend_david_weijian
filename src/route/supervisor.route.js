import express from 'express';
import {getAllUsersForSupervisor, supervisorLogin} from "../controller/supervisor.controller.js"
import { isSupervisor } from '../middleware/role.middleware.js';
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = express.Router();

// <<<<<<<<<<<<<<<<<<<< LOGIN >>>>>>>>>>>>>>>>>>>>>>>>
router.post('/login', supervisorLogin)

// <<<<<<<<<<<<<<<<<<<< ALL USER >>>>>>>>>>>>>>>>>>>>>>>>
router.get('/all-user', verifyJWT, isSupervisor, getAllUsersForSupervisor)

export default router