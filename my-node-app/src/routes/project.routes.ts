import { Router } from "express"; /* Load Express Module */
import projectController from "../controller/project.controller"; /* Import the Controller */

const router = Router(); /* Make the instance of Express Router */

/* Make the route */
router.get('/get_projects', projectController.getProjects); /* Get Project List */
router.post('/create_project', projectController.createProject); /* Create Project */
router.get('/get_projectUnassignedUsers', projectController.getProjectUnassignedUsers); 
router.get('/get_projectAvailableUsers', projectController.getProjectAvailableUsers); 
router.post('/save_projectUsers', projectController.saveProjectUsers); /* Save Project Users */
router.get('/get_projectAssignedUsers', projectController.getProjectAssignedUsers); 
router.post('/remove_allProjectUsers', projectController.removeAllProjectUsers);

// router.get('/get_allProjectUsers', apiController.getAllProjectUsers); /* Get All Project Users */

export default router; /* Exporting the Router */