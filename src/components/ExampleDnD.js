import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';

import Droppable from './Droppable';
import Draggable from './Draggable';
import { Col, Flex, Row } from 'antd';

let ExampleDnD = () => {

    const X = 210;
    const Y = 25;
    const nexusX = [130, 260, 350];
    const viewBoxWidth = [480, 700, 900];
    const stopX = [90, 210, 310];
    const pathTop = [
        "L 350 85 L 350 115",
        "L 480 85 L 480 115",
        "L 570 85 L 570 115"
    ];
    const pathBottom = [
        "L 350 135",
        "L 350 150 L 480 150 L 480 135",
        "L 350 150 L 570 150 L 570 135"
    ];
    const pathBottom2 = [
        "M 480 135 L 480 150 L 570 150 L 570 165",
        "M 570 135 L 570 165"
    ];

    let ellipse = [
        "610",
        "570"
    ];

    let networkType = 0;

    let nodes = [
        { id: "1", type: "type1", posX: 0, posY: 0, ok: false },
        { id: "2", type: "type2", posX: -160, posY: 90, ok: false },
        { id: "3", type: "type3", posX: -160, posY: 170, ok: false },
        { id: "4", type: "type4", posX: nexusX[networkType], posY: 90, ok: false },
        { id: "5", type: "type5", posX: 130, posY: 170, ok: false },
        { id: "6", type: "type6", posX: -70, posY: 190, ok: false },
    ];

    let [extendedNodes, setExtendedNodes] = useState([
        { ...nodes[0], id: "1-1" },
        { ...nodes[0], id: "1-2" },
        ...nodes.slice(1, 3),
        { ...nodes[5], id: "6-2", type: "type6-2" },
        { ...nodes[0], id: "1-3" },
        ...nodes.slice(3, 5),
        ...nodes.slice(6),
        { ...nodes[5], id: "6-3", type: "type6-3", posX: nexusX[networkType] + stopX[networkType] },
    ]);

    let handleDragEnd = (event) => {
        let { active, over } = event;

        if (over && over.data.current.accepts.includes(active.data.current.type)) {
            console.log("HERE");
            let updated = extendedNodes.map((element) => {
                if (element.id === active.id) {
                    element.ok = true;
                }
                return element;
            });
            setExtendedNodes(updated);
        }
    };

    return (
        <Flex align="center" vertical style={{ height: "100%", width: "90%", backgroundColor: "grey" }}>
            <DndContext onDragEnd={handleDragEnd}>
                <Flex align="start" vertical style={{ padding: "1vmax 0vmax 5vh" }}>
                    <Row>
                        <Col>
                            <Draggable id={extendedNodes[0].id} type={extendedNodes[0].type} ok={extendedNodes[0].ok}>Drag me {extendedNodes[0].type}</Draggable>
                        </Col>
                    </Row>
                    <Row>
                        {extendedNodes.slice(1, 5).map((element) => (
                            <Col key={element.id} style={{ paddingRight: "0.5vmax" }}>
                                <Draggable id={element.id} type={element.type} ok={element.ok}>Drag me {element.type}</Draggable>
                            </Col>
                        ))}
                    </Row>
                    <Row>
                        {extendedNodes.slice(5).map((element) => (
                            <Col key={element.id} style={{ paddingRight: "0.5vmax" }}>
                                <Draggable id={element.id} type={element.type} ok={element.ok}>Drag me {element.type}</Draggable>
                            </Col>
                        ))}
                    </Row>
                </Flex>
                <Flex align="center" justify="center" style={{ height: "90%", width: "90%" }} >
                    <svg height="18vmax" viewBox={`0 0 ${viewBoxWidth[networkType]} 250`}>
                        <rect x="160" y="1" width="120" height="70" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" />
                        <ellipse cx="60" cy="205" rx="60" ry="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" />
                        <ellipse cx="350" cy="205" rx="60" ry="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" />
                        <path d={`M 220 70 L 220 85 ${pathTop[networkType]}`} fill="none" stroke="rgb(0, 0, 0)" />
                        <path d="M 220 70 L 220 85 L 60 85 L 60 115" fill="none" stroke="rgb(0, 0, 0)" />
                        <path d="M 60 130 L 60 165" fill="none" stroke="rgb(0, 0, 0)" />
                        <path d={`M 350 165 ${pathBottom[networkType]}`} fill="none" stroke="rgb(0, 0, 0)" />
                        {[1, 2].includes(networkType) && <path d={pathBottom2[networkType - 1]} fill="none" stroke="rgb(0, 0, 0)" />}
                        {[1, 2].includes(networkType) && <ellipse cx={ellipse[networkType - 1]} cy="205" rx="60" ry="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" />}
                        {networkType === 2 && <path d="M 570 135 L 570 150 L 790 150 L 790 165" fill="none" stroke="rgb(0, 0, 0)" />}
                        {networkType === 2 && <ellipse cx="790" cy="205" rx="60" ry="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" />}
                        {extendedNodes.filter((value, index, self) =>
                            index === self.findIndex((t) => (
                                t.type === value.type
                            ))
                        ).map((element) => (
                            <Droppable key={element.id} id={element.id} type={element.type} x={X + element.posX} y={Y + element.posY} />
                        ))}
                    </svg>
                </Flex>
            </DndContext>
        </Flex>
    );
};

export default ExampleDnD;
