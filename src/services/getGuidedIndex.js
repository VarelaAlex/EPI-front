export const getGuidedIndex = async () => {
    try {
        const progressRes = await fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/students/guidedIndex`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!progressRes.ok) throw new Error("Error al obtener progreso");

        return await progressRes.json();
    } catch (e) {
        console.error('Error en la solicitud:', e);
        return null;
    }
};