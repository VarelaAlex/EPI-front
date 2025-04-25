import React, { createContext, useContext, useState } from 'react';
import i18n from "../i18n";

const SessionContext = createContext();

export let SessionProvider = ({ children }) => {
    let [feedback, setFeedback] = useState({});
    let [exercise, setExercise] = useState({});
    let [login, setLogin] = useState(false);
    let [lang, setLang] = useState(i18n.language);

    return (
        <SessionContext.Provider value={{
            login,
            setLogin,
            feedback,
            setFeedback,
            exercise,
            setExercise,
            lang,
            setLang
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    return useContext(SessionContext);
};