import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: ["src/models/*.ts"],
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
});

AppDataSource.initialize()
    .then(() => console.log("Connected to SQL Server"))
    .catch((err) => console.error("Database connection failed:", err));
