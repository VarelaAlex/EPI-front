import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import '../../fonts/massallera.TTF'
import { useSession } from '../../SessionComponent';

const DroppablePhase2 = ({ id, type, ok, nexus, stop, bigStop, shape, src, text }) => {

    let {exercise} = useSession()
    let { t } = useTranslation();
    const { isOver, setNodeRef } = useDroppable({
        id,
        data: { accepts: type }
    });

    const style = isOver ? "#ea9999" : "#f8cecc";

    const getImagePosition = () => {
        if (nexus) return { x: "2vmax", y: exercise.representation === "ICONIC" ? "2vmax" : "1vmax", width: 60, height:40 };
        if (stop) return { x: "0.5vmax", y: "2.5vmax", width: "2vmax", height: "2vmax" };
        if (bigStop) return { x: "0vmax", y: " 2.5vmax", width: "3vmax", height: "3vmax" };
        if (shape === "rect") return { x: "2.7vmax", y: "0.6vmax", width: "4.5vmax", height: "4.5vmax" };
        if (shape === "ellipse") return { x: "3.4vmax", y: "0.3vmax", width: "4.7vmax", height: "4.7vmax" };
        return {};
    };

    const getTextPosition = () => {
        if (bigStop) return { x: "3.3vmax", y: "5.3vmax", fontSize: "3vmax" };
        if (stop) return { x: "3.2vmax", y: "4.7vmax", fontSize: "1.8vmax" };
        if (shape === "ellipse") return {x: "5.7vmax", y: "6.1vmax", fontSize: "1vmax" };
        if (shape === "rect") return { x: "5.2vmax", y: "6vmax", fontSize: "1.1vmax" };
        return { x: "3.9vmax", y: "5.3vmax", fontSize: "1.1vmax" };
    };

    const imagePosition = getImagePosition();
    const textPosition = getTextPosition();

    let strokeColor = () => {
        switch (id) {
            case "5":
                return "rgb(255, 196, 101)";
            case "8":
                return "rgb(21, 232, 223)";
            case "10":
                return "rgb(207, 143, 251)";
            default:
                return "black";
        }
    };

    let svgWidth = () => {
        if (stop) return "4vmax";
        if (nexus) return "8vmax";
        if (shape === "ellipse") return "12vmax";
        else return "10.5vmax";
    };

    return (
        <div >
            <svg height="7.5vmax" width={svgWidth()}>
                {shape === "rect" &&
                    <g>
                        <rect
                            x="0.1vmax"
                            y="0.3vmax"
                            width="10vmax"
                            height="6vmax"
                            fill="white"
                            stroke="black"
                            stroke-width="3"
                        />
                        {!ok && <rect
                            ref={setNodeRef}
                            x="4.3vmax"
                            y="2.4vmax"
                            width="1.5vmax"
                            height="1.5vmax"
                            fill={style}
                        />}
                    </g>
                }
                {shape === "ellipse" && <g>
                    <ellipse
                        cx="5.7vmax"
                        cy="3.7vmax"
                        rx="5.5vmax"
                        ry="3.5vmax"
                        fill="white"
                        stroke={strokeColor()}
                        stroke-width="3"
                    />
                    {!ok && <rect
                        ref={setNodeRef}
                        x="5vmax"
                        y="2.8vmax"
                        width="1.5vmax"
                        height="1.5vmax"
                        fill={style}
                        stroke-width="3"
                    />}
                </g>
                }
                {!shape && !ok && <rect
                    ref={setNodeRef}
                    x={stop||bigStop?"1vmax":"3vmax"}
                    y={stop||bigStop?"4vmax":"2.8vmax"}
                    width="1.5vmax"
                    height="1.5vmax"
                    fill={style}
                    stroke-width="3"
                />}
                {ok &&
                    <image {...imagePosition} href={src} />
                }
                {ok &&
                    <text {...textPosition} fill="black" textAnchor="middle" fontFamily='Massallera'>
                        {t(text)}
                    </text>
                }
            </svg>
        </div>
    );
};

export default DroppablePhase2;
