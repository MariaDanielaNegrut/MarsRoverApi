import {getAllRovers, getRoverPhotos} from "../controllers/rover.controllers";
import {NextFunction, Request, Response} from "express";
import { faker } from '@faker-js/faker';
import { Knex } from "knex";

const express = require("express");
const app = express();

const db = require("knex")({
   client: "pg",
   connection: {
       host: "localhost",
       user: "postgres",
       password: "ZRbH=rc0Ip",
       database: "mars"
   }
});


app.use(express.json());

const router = express.Router();
router.get('/rovers/:roverName/photos/:cameraType', getRoverPhotos);
router.get('/rovers', getAllRovers);
router.get("/seed", function(req: Request, res: Response, next: NextFunction) {
    db.schema.hasTable("users").then(function(exists: boolean) {
        if (!exists) {
            db.schema
                .createTable("users", function(table: Knex.CreateTableBuilder) {
                    table.increments("id").primary();
                    table.string("name");
                    table.string("email");
                })
                .then(function() {
                    const recordsLength = Array.from(Array(100).keys());
                    const records = recordsLength.map(rec => ({
                        name: faker.person.fullName(),
                        email: faker.internet.email()
                    }));
                    db("users")
                        .insert(records)
                        .then(() => {
                            res.send("Seeded data");
                        });
                });
        } else {
            res.send("Table exists - Seeded data");
        }
    });
});

export default router;

