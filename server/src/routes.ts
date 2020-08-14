import express from "express";

import ClassesController from "./controllers/ClassesController";
import ConnectionsController from "./controllers/ConnectionsController";

const routes = express.Router();

const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

routes.get("/", (request, response) => {
    return response.json({ message: "Hello, TypeScript!" });
});

routes.post("/users", (request, response) => {
    return response.json({ message: "Hello, TypeScript!" });
});

routes.get("/connections", connectionsController.index);
routes.post("/connections", connectionsController.create);

routes.get("/classes", classesController.index);
routes.post("/classes", classesController.create);

export default routes;
