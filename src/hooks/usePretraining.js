import { useState, useCallback } from "react";

export const usePretraining = () => {
    const [maxUnlocked, setMaxUnlocked] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUnlockedPhase = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/students/pretrainingPhase`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data?.error?.message || "Error al obtener la fase");

            setMaxUnlocked(data.pretrainingPhase);
        } catch (err) {
            console.error("Error al obtener la fase desbloqueada:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUnlockedPhase = useCallback(async (newPhase) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/students/pretrainingPhase`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({ pretrainingPhase: newPhase }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data?.error?.message || "Error al actualizar la fase");

            setMaxUnlocked(newPhase);
            return true;
        } catch (err) {
            console.error("Error al actualizar pretrainingPhase:", err);
            return false;
        }
    }, []);

    return { maxUnlocked, loading, error, fetchUnlockedPhase, updateUnlockedPhase };
};
