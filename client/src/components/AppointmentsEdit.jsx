import {useState} from "react";
import {buildHours, getTodayMin} from "../utils/helpers.js";
import {api} from "../api.js";

const AppointmentsEdit = ({ setEditId, starts_at, id, setError, onSave }) => {
    const [editDate, setEditDate] = useState(new Date(starts_at).toISOString().slice(0, 10));
    const [editTime, setEditTime] = useState(`${String(new Date(starts_at).getHours()).padStart(2, "0")}:00`);

    const hoursForEdit = buildHours(editDate);

    const saveEdit = async () => {
        if (!editDate) { setError("Please pick a date."); return; }

        const newStarts = new Date(`${editDate}T${editTime}:00`);
        if (isNaN(newStarts.getTime())) { setError("Invalid date or time."); return; }
        if (newStarts.getTime() <= Date.now()) { setError("Please choose a future time."); return; }

        try {
            await api.reschedule(id, newStarts.toISOString());
            setEditId(null);
            setError(null);
            await onSave();
        } catch (err) {
            setError(err.message || "Reschedule failed.");
        }
    }

    return (
        <div className="row">
            <input
                type="date"
                className="input"
                min={getTodayMin()}
                value={editDate}
                onChange={(e) => {
                    setEditDate(e.target.value);
                    const list = buildHours(e.target.value);
                    if (list.length && !list.includes(editTime)) {
                        setEditTime(list[0]);
                    }
                }}
            />
            <select
                className="select"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
            >
                {hoursForEdit.map((h) => (
                    <option key={h} value={h}>
                        {h}
                    </option>
                ))}
            </select>
            <button className="btn btn-primary" onClick={saveEdit}>
                Save
            </button>
            <button className="btn btn-ghost" onClick={() => setEditId(null)}>
                Cancel
            </button>
        </div>
    )
}

export default AppointmentsEdit