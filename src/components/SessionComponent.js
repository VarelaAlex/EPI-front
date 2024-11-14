import React, { createContext, useContext, useState } from 'react';

const SessionContext = createContext();

export let SessionProvider = ({ children }) => {
    let [feedback, setFeedback] = useState({});
    let [exercise, setExercise] = useState({});
    let [login, setLogin] = useState(false);

    return (
        <SessionContext.Provider value={{
            login,
            setLogin,
            feedback,
            setFeedback,
            exercise,
            setExercise
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    return useContext(SessionContext);
};