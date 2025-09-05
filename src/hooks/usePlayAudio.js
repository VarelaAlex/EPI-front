import { useRef } from "react";

export function usePlayAudio() {
	const audioRef = useRef(null);

	return (src) => {
		if ( !src ) return;

		if ( !audioRef.current || audioRef.current.src !== window.location.origin + src ) {
			audioRef.current = new Audio(src);
		}

		audioRef.current.currentTime = 0;
		audioRef.current.play().catch((err) => {
			console.warn(`Cannot play audio (${ src }):`, err.message);
		});
	};
}