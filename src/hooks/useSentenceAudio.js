import { useRef } from 'react';

export const useSentenceAudio = () => {
    const audioRefs = useRef({
        success: new Audio('/sounds/correct.mp3'),
        error: new Audio('/sounds/error.mp3')
    });

    const playSound = (soundKey) => {
        const audio = audioRefs.current[soundKey];
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(err => console.log('Error playing sound:', err));
        }
    };

    const play = (audio) => {
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    };

    return {
        playSound,
        play,
        handleDropSuccess: () => playSound('success'),
        handleDropError: () => playSound('error')
    };
};