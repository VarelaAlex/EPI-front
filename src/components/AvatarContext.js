import { createContext, useContext, useState, useRef } from "react";

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
    const [emotion, setEmotion] = useState("neutral");
    const [speech, setSpeech] = useState(null);
    const [visible, setVisible] = useState(localStorage.getItem("avatarVisible") === "true");
    const [voiceEnabled, setVoiceEnabled] = useState(localStorage.getItem("avatarVoiceEnabled") === "true");
    const audioRef = useRef(null);
    const isPlayingRef = useRef(false);

    const playAudio = (src) => {
        return new Promise(resolve => {
            if (!src || !voiceEnabled) return resolve(); // si el audio está deshabilitado, resolvemos inmediatamente

            if (audioRef.current) {
                audioRef.current.pause();
            }

            const audio = new Audio(src);
            audioRef.current = audio;

            audio.onended = () => resolve();
            audio.play();
        });
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }

        setSpeech(null);

        if (visible) {
            setEmotion("neutral");
        }

        isPlayingRef.current = false;
    };

    const changeEmotionSequence = async (sequence = []) => {
        if (!Array.isArray(sequence) || sequence.length === 0) return;

        if (isPlayingRef.current) return;
        isPlayingRef.current = true;

        for (const step of sequence) {
            if (!isPlayingRef.current) break;
            const {
                audio,
                text,
                emotionDuring = "neutral",
                emotionAfter = "neutral",
                afterDelay = 500,
                onStart,
                onEnd
            } = step;

            // Mostrar emoción y texto solo si el avatar está visible
            if (visible) setEmotion(emotionDuring);
            setSpeech(text || null);

            if (typeof onStart === "function") {
                try { onStart(); } catch (e) { console.error(e); }
            }

            await playAudio(audio);

            if (visible) setEmotion(emotionAfter);
            setSpeech(null);

            await new Promise(res => setTimeout(res, afterDelay));

            if (typeof onEnd === "function") {
                try { onEnd(); } catch (e) { console.error(e); }
            }
        }

        if (visible) setEmotion("neutral");
        isPlayingRef.current = false;
    };

    // Funciones para controlar visibilidad y voz
    const hideAvatar = () => {
        setVisible(false);
        localStorage.setItem("avatarVisible", "false");
    };
    const showAvatar = () => {
        setVisible(true);
        localStorage.setItem("avatarVisible", "true");
    };
    const disableVoice = () => {
        setVoiceEnabled(false);
        localStorage.setItem("avatarVoiceEnabled", "false");
    };
    const enableVoice = () => {
        setVoiceEnabled(true);
        localStorage.setItem("avatarVoiceEnabled", "true");
    };

    return (
        <AvatarContext.Provider value={{
            emotion,
            speech,
            changeEmotionSequence,
            visible,
            voiceEnabled,
            hideAvatar,
            showAvatar,
            disableVoice,
            enableVoice,
            stopAudio
        }}>
            {children}
        </AvatarContext.Provider>
    );
};

export const useAvatar = () => useContext(AvatarContext);