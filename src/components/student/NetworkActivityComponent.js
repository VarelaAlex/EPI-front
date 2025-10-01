import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { MultiBackend, TouchTransition } from "dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import {Card, Image, Row, Col, Flex} from "antd";

const HTML5toTouch = {
    backends: [
        { id: "html5", backend: HTML5Backend },
        {
            id: "touch",
            backend: TouchBackend,
            options: { enableMouseEvents: true },
            preview: true,
            transition: TouchTransition,
        },
    ],
};

// 🔹 Draggable pictogram
const DraggablePictogram = ({ pictogram }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "PICTO",
        item: { ...pictogram },
        collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }));

    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.3 : 1, marginBottom: 12 }}>
            <Card hoverable style={{ width: 100, textAlign: "center" }}>
                <Image
                    src={pictogram.src}
                    alt={`${pictogram.label}.png`}
                    preview={false}
                    style={{ height: 60, objectFit: "contain" }}
                />
                <div style={{ fontWeight: 600, fontSize: 14 }}>{pictogram.label}</div>
            </Card>
        </div>
    );
};

const SvgDropZone = ({ id, x, y, rx, ry, strokeColor, expected, onDrop, filled }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "PICTO",
        drop: (item) => {
            if (item.id === expected) onDrop(item);
        },
        collect: (monitor) => ({ isOver: monitor.isOver() }),
    }));

    return (
        <g>
            <ellipse
                ref={drop}
                cx={x}
                cy={y}
                rx={rx}
                ry={ry}
                fill={filled ? "white" : isOver ? "#d0f0ff" : "#fff"}
                stroke={strokeColor}
                strokeWidth="3"
            />
            {filled && (<>
                <image
                    href={filled.src}
                    x={x - rx / 2}
                    y={y - ry / 2}
                    width={rx}
                    height={ry}
                    preserveAspectRatio="xMidYMid meet"
                />
                <text
                x={x}
            y={y + ry / 2 + 15} // 15 px debajo del óvalo
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
        >
            {filled.label}
        </text></>
            )}
        </g>
    );
};

// 🔹 Actividad principal
const NetworkActivity = () => {
    let subject = "El yogur";

    const initialPictograms = [
        { id: "eat", label: "comer", src: "/pictograms/eat.png" },
        { id: "milk", label: "leche", src: "/pictograms/milk.png" },
    ];

    const sentences = [
        { id: "s1", relation: "es para", expected: "eat", x: 250, y: 200, color: "rgb(255,196,101)" },
        { id: "s2", relation: "tiene", expected: "milk", x: 450, y: 200, color: "rgb(0,0,0)" },
    ];

    const [availablePictograms, setAvailablePictograms] = useState(initialPictograms);
    const [filled, setFilled] = useState({});

    const handleDrop = (targetId, pictogram) => {
        setFilled((prev) => ({ ...prev, [targetId]: pictogram }));
        setAvailablePictograms((prev) => prev.filter((p) => p.id !== pictogram.id));
    };

    // 🔹 Cálculo del rectángulo centrado
    const rectWidth = 120;
    const rectHeight = 70;
    const avgX = sentences.reduce((sum, s) => sum + s.x, 0) / sentences.length;
    const rectX = avgX - rectWidth / 2;
    const rectY = 50;

    return (
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
            <Flex vertical>
                <Row >
                    <Col>
                        {availablePictograms.map((p) => (
                            <DraggablePictogram key={p.id} pictogram={p} />
                        ))}
                    </Col>
                </Row>
                <Row >
                    <Col >
                        <svg width="800" height="400">
                            <rect
                                x={rectX}
                                y={rectY}
                                width={rectWidth}
                                height={rectHeight}
                                fill="white"
                                stroke="black"
                                strokeWidth="3"
                            />
                            <text
                                x={avgX}
                                y={rectY + rectHeight / 2 + 5}
                                textAnchor="middle"
                                fontSize="16"
                                fontWeight="bold"
                            >
                                {subject}
                            </text>

                            {/* Relaciones y DropZones */}
                            {sentences.map((s) => {
                                const rectCenterX = avgX;
                                const rectBottomY = rectY + rectHeight;
                                const targetX = s.x;
                                const targetY = s.y - 40;

                                return (
                                    <g key={s.id}>
                                        {/* Línea en codo */}
                                        <path
                                            d={`M ${rectCenterX},${rectBottomY} 
                                               V ${(rectBottomY + targetY) / 2} 
                                               H ${targetX} 
                                               V ${targetY}`}
                                            fill="none"
                                            stroke={s.color}
                                            strokeWidth="3"
                                        />

                                        {/* Texto de la relación */}
                                        <text
                                            x={(rectCenterX + targetX) / 2}
                                            y={(rectBottomY + targetY) / 2 - 5}
                                            textAnchor="middle"
                                            fontSize="14"
                                        >
                                            {s.relation}
                                        </text>

                                        {/* Nodo droppable */}
                                        <SvgDropZone
                                            id={s.id}
                                            x={s.x}
                                            y={s.y}
                                            rx={60}
                                            ry={40}
                                            strokeColor={s.color}
                                            expected={s.expected}   // ahora es string
                                            filled={filled[s.id]}
                                            onDrop={(item) => handleDrop(s.id, item)}
                                        />
                                    </g>
                                );
                            })}
                        </svg>
                    </Col>
                </Row>
            </Flex>
        </DndProvider>
    );
};

export default NetworkActivity;