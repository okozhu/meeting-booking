export const getBusinessLabel = (businessId, businesses) => {
    const b = businesses.find(x => x._id === businessId);
    return b?.title || b?.name || b?.email || businessId;
}

export const buildHours = (forDate) => {
    const base = [];
    for (let h = 9; h <= 17; h++) base.push(`${String(h).padStart(2, "0")}:00`);
    if (!forDate) return base;

    const todayISO = new Date().toISOString().slice(0, 10);
    if (forDate === todayISO) {
        const now = new Date();
        const curH = now.getHours();
        return base.filter((hh) => parseInt(hh.slice(0, 2), 10) > curH);
    }
    return base;
}

export const getTodayMin = () => new Date().toISOString().slice(0, 10);
