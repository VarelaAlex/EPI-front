import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';

const DraggablePhase2 = ({ id, type, ok, shape, src, stop, bigStop, nexus, text, x, y }) => {

    let { t } = useTranslation();

    const getImageProps = () => {
        if (nexus) return { x: x - 15, y: y - 22, width: "3.5vmax", height: "3vmax" };
        if (stop) return { x: x - 15, y: y, width: "1.8vmax", height: "1.8vmax" };
        if (bigStop) return { x: x - 5, y: y - 20, width: "2.3vmax", height: "2.3vmax" };
        return { x: x - 15, y: y - 23, width: "3.5vmax", height: "3.5vmax" };
    };

    const getTextProps = () => {
        if (nexus) return { x: x + 10, y: y + 25, fontSize: "1.1vmax" };
        if (stop) return { x: x + 20, y: y + 28, fontSize: "1.7vmax" };
        if (bigStop) return { x: x + 35, y: y + 15, fontSize: "2.1vmax" };
        return { x: x + 10, y: y + 40, fontSize: "1vmax" };
    };

    const imageProps = getImageProps();
    const textProps = getTextProps();

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: { type, src, imageProps, text: t(text), textProps, stop, bigStop, nexus, ok, shape },
        disabled: ok
    });

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

    return (
        <g style={ok ? { visibility: "hidden" } : transform && { visibility: "hidden" }} ref={setNodeRef} {...listeners} {...attributes}>
            {shape === "rect" &&
                <rect x={x - 50}
                    y={y - 25}
                    width="120"
                    height="70"
                    fill="rgb(255, 255, 255)"
                    stroke="rgb(0, 0, 0)"
                    stroke-width="3"
                />
            }
            {shape === "ellipse" &&
                <ellipse
                    cx={x + 10}
                    cy={y + 12}
                    rx="60"
                    ry="40"
                    fill="white"
                    stroke={strokeColor()}
                    stroke-width="3"
                />
            }
            <image href={src} {...imageProps} />
            <text {...textProps} fill="black" textAnchor="middle">
                {t(text)}
            </text>
        </g>
    );
};

export default DraggablePhase2;
