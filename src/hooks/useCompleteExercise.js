import { useState } from "react";

export const useCompleteExercise = () => {
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const completeExercise = async (exerciseId) => {
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/students/completeExercise`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({ exercise_id: exerciseId }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error?.message || "Failed to complete exercise");

            setMessage(data.message || "Exercise marked as completed");
        } catch (err) {
            setError(err.message);
        }
    };

    return { completeExercise, message, error };
};