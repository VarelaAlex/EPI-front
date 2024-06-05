import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const DroppablePhase2 = ({ id, type, ok, nexus, stop, bigStop, shape, src, text }) => {

    const { isOver, setNodeRef } = useDroppable({
        id,
        data: { accepts: type }
    });

    const style = isOver ? "#ea9999" : "#f8cecc";

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
        <div >
            <svg height="6.5vmax" width="9vmax">
                {shape === "rect" &&
                    <g>
                        <rect
                            width="7.8vmax"
                            height="4.7vmax"
                            fill="white"
                            stroke="black"
                        />
                        {!ok && <rect
                            ref={setNodeRef}
                            x="3vmax"
                            y="1.75vmax"
                            width="1.5vmax"
                            height="1.5vmax"
                            fill={style}
                        />}
                    </g>
                }
                {shape === "ellipse" && <g>
                    <ellipse
                        cx="5vmax"
                        cy="2.7vmax"
                        rx="3.9vmax"
                        ry="2.6vmax"
                        fill="white"
                        stroke="black"
                    />
                    {!ok && <rect
                        ref={setNodeRef}
                        x="4.25vmax"
                        y="2vmax"
                        width="1.5vmax"
                        height="1.5vmax"
                        fill={style}
                    />}
                </g>
                }
                {!shape && !ok && <rect
                    ref={setNodeRef}
                    x="4.25vmax"
                    y="2vmax"
                    width="1.5vmax"
                    height="1.5vmax"
                    fill={style}
                />}
                {ok &&
                    <image {...imagePosition} href={src} />
                }
                {ok &&
                    <text {...textPosition} fill="black" textAnchor="middle">
                        {text}
                    </text>
                }
            </svg>
        </div>
    );
};

export default DroppablePhase2;
