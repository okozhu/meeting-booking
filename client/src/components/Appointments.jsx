import {useState} from "react";
import {api, getUserId} from "../api.js";
import {getBusinessLabel} from "../utils/helpers.js";
import AppointmentsEdit from "./AppointmentsEdit.jsx";

const Appointments = ({
  setError,
  businesses,
  appointments,
  loading,
  getAppointments
}) => {
    const [editId, setEditId] = useState(null);

    const userId = getUserId();

    const cancelAppointment = async (_id) => {
        try {
            await api.cancel(_id);
            setError(null);
            await getAppointments();
        } catch (err) {
            setError(err.message || "Cancel failed.");
        }
    }

    const startEdit = async ({ id }) => {
        setEditId(id);
    }

    return (
            <div className="card stack">
                <h3>Appointments</h3>
                {loading ? (
                    <p className="muted">Loading…</p>
                ) : (
                    <div className="scroll">
                        <ul className="list">
                            {appointments.length === 0 && <p className="muted">No appointments yet.</p>}
                            {appointments.map(({
                               _id: appointmentId,
                               status,
                               client_id,
                               business_id,
                               starts_at,
                               ends_at,
                               ...appointment
                            }) => (
                    <li key={appointmentId} className="list-item">
                        <div>
                            <div>
                                <span className={`badge ${
                                    status === "BOOKED"
                                        ? "success"
                                        : status === "CANCELLED"
                                            ? "warn"
                                            : "completed"
                                }`}
                                >
                                    {status}
                                </span>
                            </div>

                            {client_id === userId && (
                                <div className="muted">
                                    Business: {getBusinessLabel(business_id, businesses)}
                                </div>
                            )}

                            <div className="muted">
                                {new Date(starts_at).toLocaleDateString()}{" "}
                                {new Date(starts_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                                {" — "}
                                {new Date(ends_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div>

                            {editId === appointmentId && client_id === userId && status === "BOOKED" && (
                                <AppointmentsEdit
                                    appointment={appointment}
                                    setEditId={setEditId}
                                    setError={setError}
                                    onSave={getAppointments}
                                    starts_at={starts_at}
                                    id={appointmentId}
                                />
                            )}
                        </div>

                        {status === "BOOKED" && client_id === userId && (
                            <div className="row">
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => startEdit({ id: appointmentId, starts_at })}
                                >
                                    Reschedule
                                </button>
                                <button className="btn btn-danger" onClick={() => cancelAppointment(appointmentId)}>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )}
</div>
    )
}

export default Appointments;
