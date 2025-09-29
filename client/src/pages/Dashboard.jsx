import {useEffect, useState} from "react";

import {api, getToken, getUserRole} from "../api.js";
import Appointments from "../components/Appointments.jsx";
import Businesses from "../components/Businesses.jsx";
import DateSelection from "../components/DateSelection.jsx";

import ErrorBanner from "../components/ErrorBanner.jsx";

export default function Dashboard() {
    const [error, setError] = useState(null);

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("09:00");
    const [businessesLoading, setBusinessesLoading] = useState(true);
    const [businesses, setBusinesses] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(false);

    const getBusinesses =async () => {
        setBusinessesLoading(true);
        try {
            const businessesResponse = await api.getBusinesses();

            setBusinesses(businessesResponse || []);
        } catch (e) {
            setError(e.message || "Failed to load data.");
        } finally {
            setBusinessesLoading(false);
        }
    }

    const getAppointments =async () => {
        setAppointmentsLoading(true);
        try {
            const appointmentsResponse = await api.getAppointments();

            setAppointments(appointmentsResponse || []);
        } catch (e) {
            setError(e.message || "Failed to load data.");
        } finally {
            setAppointmentsLoading(false);
        }
    }

    useEffect(() => {
        const token = getToken();

        if (token) {
            getBusinesses()
            getAppointments()
        }
    }, [])

    const role = getUserRole();

    return (
        <div className="stack">
            {error && (
                <ErrorBanner error={error} setError={setError} />
            )}

            <section className="stack">
                <DateSelection
                    selectedTime={selectedTime}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    setSelectedTime={setSelectedTime}
                />
                <div className="grid grid-2">
                    {role === "CLIENT" && (
                        <Businesses
                            loading={businessesLoading}
                            businesses={businesses}
                            setError={setError}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            getBusinesses={getBusinesses}
                            getAppointments={getAppointments}
                        />
                    )}
                    <Appointments
                        businesses={businesses}
                        setError={setError}
                        appointments={appointments}
                        getAppointments={getAppointments}
                        loading={appointmentsLoading}
                    />
                </div>
            </section>
        </div>
    );
}
