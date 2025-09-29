import { Router } from "express";
import { listUsers } from "../controllers/users.controller.js";

const r = Router();
r.get("/", listUsers);

export default r;
