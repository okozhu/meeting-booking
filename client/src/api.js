export const auth = {
    register: (payload) => {
        return fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }).then(res => res.json());
    },
    login: (payload) => {
        return fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }).then(res => res.json());
    },
};

export const setToken = (token) => { localStorage.setItem("token", token); }
export const getToken = () => { return localStorage.getItem("token"); }
export const clearToken = () => { localStorage.removeItem("token"); }

export const getUserId = () => {
    const t = getToken();
    return t ? t.split("|")[0] || null : null;
}

export const getUserRole = () => {
    const t = getToken();
    return t ? t.split("|")[1] || null : null;
}

export const api = {
    getBusinesses: () => {
        const url = `${import.meta.env.VITE_API_URL}/api/business`;
        return fetch(url).then(res => res.json());
    },
    getAppointments: () => {
        const url = `${import.meta.env.VITE_API_URL}/api/appointments?id=${getUserId()}&role=${getUserRole()}`;
        return fetch(url).then(res => res.json());
    },
    book: ({ businessId, startsAt }) => {
        const url = `${import.meta.env.VITE_API_URL}/api/appointments`;
        const body = { businessId, startsAt, clientId: getUserId() }
        return fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }).then(res => res.json());
    },
    cancel: (id) => {
        const url = `${import.meta.env.VITE_API_URL}/api/appointments/${id}/cancel`;
        return fetch(url, {
            method: "PATCH",
        });
    },
    reschedule: (id, startsAt) => {
        const url = `${import.meta.env.VITE_API_URL}/api/appointments/${id}`;
        const body = { startsAt };
        return fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    },
};
