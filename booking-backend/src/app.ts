import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import { setupSwagger } from "./config/swagger";
import cors from "cors";
import apiRouter from "./routes/apiRouter";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
    origin: 'http://localhost:3000', // Allow only this origin
    methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Allowed headers
    credentials: true, // Enable cookies
}));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use("/api", apiRouter);



setupSwagger(app);

AppDataSource.initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
    });
});