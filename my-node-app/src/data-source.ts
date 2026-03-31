import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config(); // Load .env variables

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    /*  only in development - This tells TypeORM to automatically create (or update) database tables based on your entity classes every time the app runs
                             Never use in production, as it can drop/modify tables and data */
    synchronize: false,
    // synchronize: process.env.NODE_ENV !== "production",  /* For Production */

    /* true → logs all DB queries and actions (handy for debugging)
        false → keeps console clean (good in production) */
    logging: false,
    // logging: process.env.NODE_ENV !== "production", /* For Production */
    entities: [__dirname + "/entity/**/*.ts"]

});