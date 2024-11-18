import { Router } from "express";
import { registerUser, getUser,getUsers, updateUser, deleteUser } from "../controller/user";

const router = Router();

router.post("/register", registerUser);
router.get("/all",getUsers);
router.get("/:userId", getUser);

router.put("/:id", updateUser);
router.delete("/:userId", deleteUser);

export default router;
