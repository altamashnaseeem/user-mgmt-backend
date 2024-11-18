import { Router } from "express";
import { saveNote, getNotes } from '../controller/notes';

const router = Router();


router.post('/save', saveNote);


router.get('/:userId', getNotes);

export default router;
