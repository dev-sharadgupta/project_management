import { Router } from "express"; /* Load Express Module */
import noteController from "../controller/note.controller"; /* Import the Controller */

const router = Router(); /* Make the instance of Express Router */

/* Make the route */
router.get('/get_allNoteTag', noteController.getAllNoteTag); /* Get NoteTag List */
router.post('/add_UpdateNote', noteController.addUpdateNote); /* Add/Update Note List */
router.get('/get_projectsNotes', noteController.getProjectsNotes); /* Get Project Notes */
// router.get('/get_allTaskStatus', taskController.getAllTaskStatus); /* Get TaskStatus List */
// router.get('/get_TasksUsers', taskController.getTasksUser); /* Get Tasks Users */

export default router; /* Exporting the Router */