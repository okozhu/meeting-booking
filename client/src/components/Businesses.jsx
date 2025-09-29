import {api} from "../api.js";

const Businesses = ({
    setError,
    selectedDate,
    selectedTime,
    businesses,
    loading,
    getBusinesses,
    getAppointments,
}) => {
    const book = async (businessId) => {
        if (!selectedDate) { setError("Select a date first"); return; }
        if (!selectedTime) { setError("Select a time first"); return; }

        const startsAt = new Date(`${selectedDate}T${selectedTime}:00`);
        if (isNaN(startsAt.getTime())) { setError("Invalid date or time."); return; }
        if (startsAt.getTime() <= Date.now()) { setError("Please choose a future time."); return; }

        try {
            await api.book({ businessId, startsAt: startsAt.toISOString() });
            setError(null);
            await getBusinesses();
            await getAppointments();
        } catch (err) {
            setError(err.message || "Booking failed.");
        }
    }

    return (
        <div className="card stack">
            <h3>Business users</h3>
            {loading ? (
                <p className="muted">Loading…</p>
            ) : (
                <div className="scroll">
                    <ul className="list">
                        {businesses?.length === 0 && <p className="muted">No business users yet.</p>}
                        {businesses?.map((b) => (
                            <li key={b._id} className="list-item">
                                <div>
                                    <div>{b.title || b.name || b.email}</div>
                                    {b.description && <div className="muted">{b.description}</div>}
                                </div>
                                <button className="btn btn-primary" onClick={() => book(b._id)}>
                                    Book
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Businesses
