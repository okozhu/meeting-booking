import {buildHours, getTodayMin} from "../utils/helpers.js";

const DateSelection = ({
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime
}) => {
    const hoursForCreate = buildHours(selectedDate);

    return (
        <div className="row">
            <input
                type="date"
                className="input"
                min={getTodayMin()}
                value={selectedDate}
                onChange={(e) => {
                    setSelectedDate(e.target.value);
                    const list = buildHours(e.target.value);
                    if (list.length && !list.includes(selectedTime)) {
                        setSelectedTime(list[0]);
                    }
                }}
            />
            <select
                className="select"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
            >
                {hoursForCreate.map((h) => (
                    <option key={h} value={h}>
                        {h}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default DateSelection;
