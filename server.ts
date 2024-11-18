import express from "express";
import userRoutes from "./routes/user";
import notesRoutes from "./routes/notes"
const app = express();

const PORT = 3000;

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/notes",notesRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
