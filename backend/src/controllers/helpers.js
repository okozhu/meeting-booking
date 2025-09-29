import { colAppointments } from "../connect.js";

export function isFuture(dtIso) {
    return new Date(dtIso).getTime() > Date.now();
}

export function oneHourAfter(dtIso) {
    return new Date(new Date(dtIso).getTime() + 60 * 60 * 1000).toISOString();
}

export function isWithinBusinessHours(dtIso) {
    const d = new Date(dtIso);
    const h = d.getHours();
    const m = d.getMinutes();
    return m === 0 && h >= 9 && h <= 17;
}

export async function markCompleted() {
    const appts = await colAppointments();
    await appts.updateMany(
        { status: "BOOKED", ends_at: { $lte: new Date() } },
        { $set: { status: "COMPLETED" } }
    );
}
