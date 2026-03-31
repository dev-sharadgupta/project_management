import { Router } from "express"; /* Load Express Module */
import userController from "../controller/user.controller";

const router = Router(); /* Make the instance of Express Router */

/* Make the route */
router.get('/get_allUsers', userController.getAllUsers); /* Get Users List */

export default router; /* Exporting the Router */