import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const DraggablePhase1 = ({ id, type, ok, shape, src, stop, bigStop, nexus, text, representation }) => {

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: { type },
        disabled: ok
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
    } : undefined;

    const getImagePosition = () => {
        if (nexus) return { x: "3vmax", y: "1.5vmax", width: "2vmax", height: "2vmax" };
        if (stop) return { x: "4vmax", y: "2.5vmax", width: "2vmax", height: "2vmax" };
        if (bigStop) return { x: "0vmax", y: " 2.5vmax", width: "3vmax", height: "3vmax" };
        if (shape === "rect") return { x: "2.5vmax", y: "0.3vmax", width: "3.25vmax", height: "3.25vmax" };
        if (shape === "ellipse") return { x: "3.4vmax", y: "0.3vmax", width: "3.25vmax", height: "3.25vmax" };
        return {};
    };

    const getTextPosition = () => {
        if (bigStop) return { x: "3.4vmax", y: "5.9vmax", fontSize: "2.3vmax" };
        if (stop) return { x: "6.2vmax", y: "5vmax", fontSize: "1.8vmax" };
        if (shape === "ellipse") return { x: "5.1vmax", y: "4.5vmax", fontSize: "1.1vmax" };
        return { x: "4vmax", y: "4.5vmax", fontSize: "1.1vmax" };
    };

    const imagePosition = getImagePosition();
    const textPosition = getTextPosition();

    return (
        <div ref={setNodeRef} style={ok ? { visibility: "hidden" } : style} {...listeners} {...attributes}>
            <svg height="6.5vmax" width="9vmax">
                {shape === "rect" &&
                    <rect
                        width="7.8vmax"
                        height="4.7vmax"
                        fill="white"
                        stroke="black"
                    />
                }
                {shape === "ellipse" &&
                    <ellipse
                        cx="5vmax"
                        cy="2.7vmax"
                        rx="3.9vmax"
                        ry="2.6vmax"
                        fill="white"
                        stroke="black"
                    />
                }
                <image
                    x={imagePosition.x}
                    y={imagePosition.y}
                    width={imagePosition.width}
                    height={imagePosition.height}
                    href={src}
                />
                <text
                    x={textPosition.x}
                    y={textPosition.y}
                    fill="black"
                    fontSize={textPosition.fontSize}
                    textAnchor="middle"
                >
                    {text}
                </text>
            </svg>
        </div>
    );
};

export default DraggablePhase1;
