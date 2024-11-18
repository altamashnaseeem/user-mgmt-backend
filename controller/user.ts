import { Request, Response } from "express";
import { db } from "../firebase";
import Joi from 'joi';
import bcrypt from 'bcrypt';


const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(3),
});

export const registerUser = async (req: Request, res: Response) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  try {
    const { name, email, password } = req.body;
    const user = await db.collection("users").where("email", "==", email).get();

    if (!user.empty) {
  
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = { name, email, password: hashedPassword };
    const userRef = await db.collection("users").add(data);

    res.status(201).send({ id: userRef.id, name, email });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  try {
    const user = await db.collection("users").doc(userId).get();

    if (!user.exists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userData = user.data();

    // Exclude the password from the response
    const { password, ...userWithoutPassword } = userData || {};

    res.status(200).send({ id: user.id, ...userWithoutPassword });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const usershot = await db.collection("users").get();

    if (usershot.empty) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    // Map all users, excluding their password field
    const users = usershot.docs.map((doc) => {
      const { password, ...userWithoutPassword } = doc.data();
      return { id: doc.id, ...userWithoutPassword };
    });

    res.status(200).send(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  try {
    
    const user = await db.collection("notes").where("userId", "==", userId).get();

    if (!user.empty) {
      const batch = db.batch(); 

      user.docs.forEach((noteDoc) => {
        batch.delete(noteDoc.ref); 
      });

      await batch.commit();
    }

    
    await db.collection("users").doc(userId).delete();

    res.status(200).json({ message: "User and their notes deleted successfully", id: userId });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  try {
    const { name, email, password } = req.body;
    const updatedData: Record<string, string> = {};

    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    await db.collection("users").doc(id).update(updatedData);

    res.status(200).send({ id, ...updatedData });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
};
