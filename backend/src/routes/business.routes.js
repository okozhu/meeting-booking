import { Router } from "express";
import { listBusiness } from "../controllers/business.controller.js";

const r = Router();
r.get("/", listBusiness);
export default r;
