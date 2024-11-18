import { Request, Response } from 'express';
import { db } from '../firebase';  
import { Note } from '../note.model';
import admin from "firebase-admin";
import Joi from 'joi';


const noteSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  userId: Joi.string().required(),
});

export const saveNote = async (req: Request, res: Response): Promise<void> => {

  const { error } = noteSchema.validate(req.body);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  const { title, content, userId }: Note = req.body;
 
  try {
    const noteRef = await db.collection('notes').add({
      title,
      content,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userId,
    });

    res.status(201).send({
      id: noteRef.id,
      title,
      content,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('An unknown error occurred');
    }
  }
};

export const getNotes = async (req: Request, res: Response): Promise<void> => {

  const { userId } = req.params;
  if (!userId) {
    res.status(400).send('User ID is required');
    return;
  }

  try {
    const user = await db.collection('notes').where('userId', '==', userId).get();
    if (user.empty) {
      res.status(404).send('No notes found for this user');
      return;
    }

    const notes = user.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(notes);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send('An unknown error occurred');
    }
  }
};
