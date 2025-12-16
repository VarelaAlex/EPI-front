import {useCallback} from "react";

export const useExerciseProgressUpdater = () => {
    return useCallback(async (closedOrder) => {
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(
                `${process.env.REACT_APP_USERS_SERVICE_URL}/students/updateEnabledExercise`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({closedOrder})
                }
            );
        } catch (e) {
            console.error("Error actualizando ejercicio habilitado:", e);
        }
    }, []);
};