import { useCallback, useEffect } from "react";

const useFullscreen = (shouldStayFullscreen = false) => {
	useEffect(() => {
		const enterFullscreen = () => {
			if ( document.fullscreenEnabled && !document.fullscreenElement ) {
				document.documentElement.requestFullscreen().catch((err) => {
					console.error(`Error entering fullscreen: ${ err.message }`);
				});
			}
		};

		const exitFullscreen = () => {
			if ( document.fullscreenElement ) {
				document.exitFullscreen().catch((err) => {
					console.error(`Error exiting fullscreen: ${ err.message }`);
				});
			}
		};

		// Enter fullscreen on mount
		enterFullscreen();

		// Exit fullscreen on unmount, unless `shouldStayFullscreen` is true
		return () => {
			if ( !shouldStayFullscreen ) {
				exitFullscreen();
			}
		};
	}, [shouldStayFullscreen]); // Dependency ensures this works correctly across transitions

	// Manual fullscreen exit function
	return useCallback(() => {
		document.exitFullscreen().catch((err) => {
			console.error(`Error exiting fullscreen: ${ err.message }`);
		});
	}, []);
};

export default useFullscreen;