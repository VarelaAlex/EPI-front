import {useCallback} from "react";

export const useExerciseProgressUpdater = () => {
    return useCallback(async (representation, networkType) => {
        try {
            const token = localStorage.getItem("accessToken");

            const completedRes = await fetch(
                `${process.env.REACT_APP_USERS_SERVICE_URL}/students/completedExercises`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!completedRes.ok) return;

            const completedData = await completedRes.json();
            const completedIds = completedData.map((item) => item.exercise_id);

            const idsRes = await fetch(
                `${process.env.REACT_APP_EXERCISES_SERVICE_URL}/exercises/ids`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({representation, networkType}),
                }
            );

            if (!idsRes.ok) return;
            const idsData = await idsRes.json();
            const expectedIds = idsData.map((item) => item._id);

            const allCompleted =
                expectedIds.every((id) => completedIds.includes(id));

            if (allCompleted) {
                await fetch(
                    `${process.env.REACT_APP_USERS_SERVICE_URL}/students/updateEnabledExercise`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
        } catch (e) {
            console.error("Error actualizando ejercicio habilitado:", e);
        }
    }, []);
};