import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import '../assets/styles/font.css';
import { useSession } from '../SessionComponent';

const DroppablePhase1 = ({ id, type, ok, nexus, stop, bigStop, x, y, src, text, shape }) => {

    let { exercise } = useSession();
    let { t } = useTranslation();
    const { isOver, setNodeRef } = useDroppable({
        id,
        data: { accepts: type }
    });

    const style = isOver ? "#ea9999" : "#f8cecc";

    const getImageProps = () => {
        if (nexus) return { x: x - 20, y: y - (exercise.representation === "ICONIC" ? 10 : 20), width: 60, height: 30 };
        if (stop) return { x: x - 15, y: y, width: "25", height: "25" };
        if (bigStop) return { x: x - 5, y: y - 20, width: "40", height: "40" };
        if (shape === "ellipse") return { x: x - 15, y: y - 28, width: "50", height: "50" };
        return { x: x - 15, y: y - 22, width: "50", height: "50" };
    };

    const getTextProps = () => {
        if (nexus) return { x: x + 10, y: y + 25, fontSize: "15" };
        if (stop) return { x: x + 22, y: y + 22, fontSize: "25" };
        if (bigStop) return { x: x + 38, y: y + 20, fontSize: "40" };
        if (shape === "ellipse") return { x: x + 11, y: y + 34, fontSize: "12" };
        return { x: x + 10, y: y + 38, fontSize: "13" };
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
                <text {...textProps} fill="black" textAnchor="middle" fontFamily="Massallera">
                    {t(text)}
                </text>
            }
        </g>
    );
};

export default DroppablePhase1;
