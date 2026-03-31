import "reflect-metadata";
import cors from "cors"; /* Create a new instance of Cross-Origin Resource Sharing */
import express from "express"; /* Load Express */
import { AppDataSource } from "./data-source"; /* Import Data Source */

import projectRoutes from "./routes/project.routes"; /* Make the instance for Project route */
import userRoutes from "./routes/user.routes";
import targetRoutes from "./routes/target.routes";
import taskRoutes from "./routes/task.routes";
import noteRoutes from "./routes/note.routes";

const PORT = process.env.APP_PORT || 5000;

const app = express(); /* Create a new instance of the express application */

app.use(cors()); // Enable CORS
app.use(express.json()); /* Use built-in middleware to parse JSON */

AppDataSource.initialize()
    .then(() => {
        console.log("📦 MySQL Database connected");

        // Define your API routes
        app.use("/api", projectRoutes);
        app.use("/api", userRoutes);
        app.use("/api", targetRoutes);
        app.use("/api", taskRoutes);
        app.use("/api", noteRoutes);

        app.listen(PORT, () =>
            console.log(`Server running at http://localhost:${PORT}`)
        );
    })
    .catch((error) => console.error("DB Connection Error:", error));