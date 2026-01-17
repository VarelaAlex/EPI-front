import { useCallback } from "react";

export const useExerciseProgressUpdater = () => {
    return useCallback(async (index) => {
        try {
            const token = localStorage.getItem("accessToken");

            await fetch(
                `${process.env.REACT_APP_USERS_SERVICE_URL}/students/guided/progress`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ index })
                }
            );
        } catch (e) {
            console.error("Error actualizando progreso guiado:", e);
        }
    }, []);
};