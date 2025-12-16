export const getNextExercise = async (closedOrder) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_EXERCISES_SERVICE_URL}/exercises/next/${closedOrder}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
        );

        if (!response.ok) {
            console.error('Error al obtener ejercicios habilitados');
        }

        return await response.json();
    } catch (e) {
        console.error('Error en la solicitud:', e);
    }
}