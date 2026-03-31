import { Router } from "express"; /* Load Express Module */
import targetController from "../controller/target.controller"; /* Import the Controller */

const router = Router(); /* Make the instance of Express Router */

/* Make the route */
router.get('/get_allTargetPriorities', targetController.getAllTargetPriorities); /* Get TargetPriorities List */
router.get('/get_allTargetStatus', targetController.getAllTargetStatus); /* Get TargetStatus List */
router.post('/add_UpdateTarget', targetController.addUpdateTarget); /* Get TargetStatus List */
router.get('/get_projectsTargets', targetController.getProjectsTargets); /* Get Project Targets */
router.get('/get_TargetsUsers', targetController.getTargetsUser); /* Get Targets Users */

export default router; /* Exporting the Router */