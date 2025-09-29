import { ObjectId } from "mongodb";
import {colAppointments, colUsers} from "../connect.js";
import { markCompleted, isFuture, isWithinBusinessHours, oneHourAfter } from "./helpers.js";

const BUSINESS_ROLE = "BUSINESS"

export const getAppointments = async (req, res) => {
    try {
        if (req.query.id) {
            await markCompleted();
            const appts = await colAppointments();

            const query = req.query.role === BUSINESS_ROLE ? {business_id: req.query.id} : {client_id: req.query.id}

            const appointments = await appts.find(query).sort({starts_at: -1}).toArray();

            res.json(appointments);
        }
    } catch (e) {
        console.error("getAppointments error:", e);
        res.status(500).json({ message: "Server error." });
    }
}

export const createAppointment = async (req, res) => {
    try {
        const { clientId, businessId, startsAt } = req.body;

        const user = await colUsers().then(users => users.findOne({ _id: new ObjectId(clientId) }));

        if (!user?._id) {
            return res.status(403).json({ message: "Only clients can book." });
        }

        if (!businessId || !startsAt) {
            return res.status(400).json({ message: "Please choose date and time." });
        }

        const starts = new Date(startsAt);
        if (isNaN(starts)) return res.status(400).json({ message: "Invalid date." });
        if (!isFuture(startsAt)) return res.status(400).json({ message: "Choose a future time." });
        if (!isWithinBusinessHours(startsAt)) {
            return res.status(400).json({ message: "Business hours are 09:00–18:00 (1-hour slots)." });
        }

        const appts = await colAppointments();

        const clash = await appts.findOne({
            business_id: businessId,
            starts_at: starts,
            status: "BOOKED",
        });
        if (clash) return res.status(409).json({ message: "This time slot is already booked." });

        const doc = {
            client_id: clientId,
            business_id: businessId,
            starts_at: starts,
            ends_at: new Date(oneHourAfter(startsAt)),
            status: "BOOKED",
            created_at: new Date(),
        };

        const { insertedId } = await appts.insertOne(doc);
        res.status(201).json({ ...doc, id: insertedId.toString() });
    } catch (e) {
        console.error("createAppointment error:", e);
        res.status(500).json({ message: "Failed to create appointment." });
    }
}

export const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appts = await colAppointments();

        const updatedAppointment = await appts.findOneAndUpdate(
            { _id: new ObjectId(id), status: "BOOKED" },
            { $set: { status: "CANCELLED" } },
            { returnDocument: "after" }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found or not authorized." });
        }

        res.json(updatedAppointment);
    } catch (e) {
        console.error("cancelAppointment error:", e);
        res.status(500).json({ message: "Failed to cancel." });
    }
}

export const rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { startsAt } = req.body;

        if (!startsAt) {
            return res.status(400).json({ message: "Please choose a new date and time." });
        }

        const newStart = new Date(startsAt);
        if (isNaN(newStart)) return res.status(400).json({ message: "Invalid date." });
        if (!isFuture(startsAt)) return res.status(400).json({ message: "Choose a future time." });
        if (!isWithinBusinessHours(startsAt)) {
            return res.status(400).json({ message: "Business hours are 09:00–18:00 (1-hour slots)." });
        }

        const appts = await colAppointments();

        const cur = await appts.findOne({ _id: new ObjectId(id) });
        if (!cur) return res.status(404).json({ message: "Appointment not found." });

        const clash = await appts.findOne({
            business_id: cur.business_id,
            starts_at: newStart,
            status: "BOOKED",
            _id: { $ne: cur._id },
        });
        if (clash) return res.status(409).json({ message: "This time slot is already booked." });

        const updatedAppointment = await appts.findOneAndUpdate(
            { _id: cur._id },
            { $set: { starts_at: newStart, ends_at: new Date(newStart.getTime() + 60 * 60 * 1000) } },
            { returnDocument: "after" }
        );

        res.json(updatedAppointment);
    } catch (e) {
        console.error("rescheduleAppointment error:", e);
        res.status(500).json({ message: "Failed to reschedule." });
    }
}
