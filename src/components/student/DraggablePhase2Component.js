import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';

const DraggablePhase2 = ({ id, type, ok, shape, src, stop, bigStop, nexus, text, x, y }) => {

    let { t } = useTranslation();

    const getImageProps = () => {
        if (nexus) return { x: x - 2, y: y - 5, width: "25", height: "25" };
        if (stop) return { x: x - 15, y: y, width: "2vmax", height: "2vmax" };
        if (bigStop) return { x: x - 5, y: y - 20, width: "35", height: "35" };
        return { x: x - 15, y: y - 20, width: "50", height: "50" };
    };

    const getTextProps = () => {
        if (nexus) return { x: x + 10, y: y + 30, fontSize: "1vmax" };
        if (stop) return { x: x + 20, y: y + 30, fontSize: "1.7vmax" };
        if (bigStop) return { x: x + 35, y: y + 20, fontSize: "2.1vmax" };
        return { x: x + 10, y: y + 43, fontSize: "1vmax" };
    };

    const imageProps = getImageProps();
    const textProps = getTextProps();

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: { type, src, imageProps, text: t(text), textProps, stop, bigStop, nexus, ok, shape },
        disabled: ok
    });

    return (
        <g style={ok ? { visibility: "hidden" } : transform && { visibility: "hidden" }} ref={setNodeRef} {...listeners} {...attributes}>
            {shape === "rect" &&
                <rect x={x - 50} y={y - 25} width="120" height="70" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" />
            }
            {shape === "ellipse" &&
                <ellipse
                    cx={x + 10}
                    cy={y + 12}
                    rx="60"
                    ry="40"
                    fill="white"
                    stroke="black"
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
