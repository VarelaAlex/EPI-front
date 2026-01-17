export const getNextExercise = async (index) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_EXERCISES_SERVICE_URL}/exercises/next/${index}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
        );

        if (!response.ok) {
            console.error('Error al obtener el siguiente ejercicio');
            return null;
        }

        return await response.json();
    } catch (e) {
        console.error('Error en la solicitud:', e);
        return null;
    }
};