export const InteractionBlocker = ({ active }) => {
    if (!active) return null;



    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "transparent",
                pointerEvents: "all",
                touchAction: "none"
            }}
        />
    );
};

export default InteractionBlocker;