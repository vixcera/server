import express from 'express';
import ruser from './ruser.js';
import rproduct from "./rproduct.js"
import logger from "../utils/logger.js";
import rauthentic from './rauthentic.js';
import rcontributor from './rcontributor.js';

const router = new express.Router();

router.use(logger)
router.use(ruser)          // ==> user routes
router.use(rproduct)       // ==> product routes
router.use(rauthentic)     // ==> authentication routes 
router.use(rcontributor)   // ==> contributor routes

export default router;
