import { Router } from "express";
import {
    createAppointment,
    cancelAppointment,
    rescheduleAppointment,
    getAppointments
} from "../controllers/appointments.controller.js";

const r = Router();

r.get("/", getAppointments);
r.post("/", createAppointment);
r.patch("/:id/cancel", cancelAppointment);
r.patch("/:id", rescheduleAppointment);

export default r;
