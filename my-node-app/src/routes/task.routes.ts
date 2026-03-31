import { Router } from "express"; /* Load Express Module */
import taskController from "../controller/task.controller"; /* Import the Controller */

const router = Router(); /* Make the instance of Express Router */

/* Make the route */
router.get('/get_allTaskPriorities', taskController.getAllTaskPriorities); /* Get TaskPriorities List */
router.get('/get_allTaskStatus', taskController.getAllTaskStatus); /* Get TaskStatus List */
router.post('/add_UpdateTask', taskController.addUpdateTask); /* Get TaskStatus List */
router.get('/get_projectsTasks', taskController.getProjectsTasks); /* Get Project Tasks */
router.get('/get_TasksUsers', taskController.getTasksUser); /* Get Tasks Users */

export default router; /* Exporting the Router */