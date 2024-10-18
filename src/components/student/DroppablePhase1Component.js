import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import './font.css'

const DroppablePhase1 = ({ id, type, ok, nexus, stop, bigStop, x, y, src, text }) => {

    let { t } = useTranslation();
    const { isOver, setNodeRef } = useDroppable({
        id,
        data: { accepts: type }
    });

    const style = isOver ? "#ea9999" : "#f8cecc";

    const getImageProps = () => {
        if (nexus) return { x: x - 15, y: y - 25, width: "3.5vmax", height: "3.5vmax" };
        if (stop) return { x: x - 15, y: y, width: "2vmax", height: "2vmax" };
        if (bigStop) return { x: x - 5, y: y - 20, width: "3vmax", height: "3vmax" };
        return { x: x - 15, y: y - 22, width: "50", height: "50" };
    };

    const getTextProps = () => {
        if (nexus) return { x: x + 10, y: y + 25, fontSize: "1vmax" };
        if (stop) return { x: x + 20, y: y + 30, fontSize: "1.7vmax" };
        if (bigStop) return { x: x + 40, y: y + 30, fontSize: "2.1vmax" };
        return { x: x + 10, y: y + 38, fontSize: "1vmax" };
    };

    const imageProps = getImageProps();
    const textProps = getTextProps();

    return (
        <g>
            {(!ok) &&
                <rect
                    ref={setNodeRef}
                    x={x}
                    y={y}
                    width="20"
                    height="20"
                    fill={style}
                    stroke-width="3"
                />
            }
            {ok &&
                <image {...imageProps} href={src} />
            }
            {ok &&
                <text {...textProps} fill="black" textAnchor="middle" style={{ fontFamily: 'Massallera' }}>
                    {t(text)}
                </text>
            }
        </g>
    );
};

export default DroppablePhase1;
