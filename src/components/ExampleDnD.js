import React, { useState } from 'react';
import {
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';

import Droppable from './Droppable';
import Draggable from './Draggable';
import { Col, Flex, Row } from 'antd';

let ExampleDnD = () => {

    const X = 210;
    const Y = 25;
    const nexusX = [130, 260, 350];
    const viewBoxWidth = [480, 730, 920];
    const stopX = [90, 210, 310];
    let [showGif, setShowGif] = useState(false);
    const pathTop = [
        "L 350 85 L 350 105",
        "L 480 85 L 480 105",
        "L 570 85 L 570 105"
    ];
    const pathBottom = [
        "L 350 150",
        "L 350 150 L 480 150 L 480 150",
        "L 350 150 L 570 150 L 570 145"
    ];
    const pathBottom2 = [
        "M 480 145 L 480 150 L 610 150 L 610 165",
        "M 570 145 L 570 165"
    ];

    let ellipse = [
        "610",
        "570"
    ];

    let networkType = 0;

    let nodes = [
        { id: "1", type: "type1", posX: 0, posY: 0, src: "boca.png", text: "LA BOCA", shape: "rect" },
        { order: 2, id: "2", type: "type2", posX: -160, posY: 90, src: "es_parte_de.png", nexus: true, text: "es parte de" },
        { order: 3, id: "3", type: "type3", posX: -160, posY: 170, shape: "ellipse", src: "cara.png", text: "LA CARA" },
        { order: 6, id: "4", type: "type4", posX: nexusX[networkType], posY: 90, src: "tiene.png", nexus: true, text: "tiene" },
        { order: 7, id: "5", type: "type5", posX: 130, posY: 170, shape: "ellipse", src: "labios.png", text: "LABIOS" },
        { id: "6", type: "type6", posX: -70, posY: 190 },

        /*
        { order: 8, id: "7", type: "type7", posX: 260, posY: 190, text: "y", src: "stop.png", stop: true },
        { order: 9, id: "8", type: "type8", posX: 390, posY: 170, shape: "ellipse", src: "dientes.png", text: "DIENTES" },
        */

        /*
        { order: 8, id: "7", type: "type7", posX: 260, posY: 190, text: ",", src: "stop.png", stop: true },
        { order: 9, id: "8", type: "type8", posX: 350, posY: 170, shape: "ellipse", src: "dientes.png", text: "DIENTES" },
        { order: 10, id: "9", type: "type9", posX: 460, posY: 190, text: "y", src: "stop.png", stop: true },
        { order: 11, id: "10", type: "type10", posX: 570, posY: 170, shape: "ellipse", src: "lengua.png", text: "LENGUA" },
        */
    ];

    let [extendedNodes, setExtendedNodes] = useState([
        { ...nodes[0], order: 0, id: "1-1" },
        { ...nodes[0], order: 1, id: "1-2" },
        ...nodes.slice(1, 3),
        { ...nodes[5], order: 4, id: "6-2", type: "type6-2", text: ".", src: "stop.png", bigStop: true },
        { ...nodes[0], order: 5, id: "1-3" },
        ...nodes.slice(3, 5),
        ...nodes.slice(6),
        { ...nodes[5], order: nodes.length + 2, id: "6-3", type: "type6-3", posX: nexusX[networkType] + stopX[networkType], text: ".", src: "stop.png", bigStop: true }
    ]);

    let [droppableNodes, setDroppableNodes] = useState(JSON.parse(JSON.stringify(extendedNodes)));
    let [current, setCurrent] = useState(0);

    let handleDragEnd = (event) => {
        let { active, over } = event;
        let node = null;
        if (over && over.data.current.accepts.includes(active.data.current.type)) {
            let updated = extendedNodes.map((element) => {
                if (element.id === active.id && element.order === current) {
                    element.ok = true;
                    node = element;
                    setCurrent(current + 1);
                }
                return element;
            });
            setExtendedNodes(updated);
            setDroppableNodes(updated);
        }

        if (["1-1", "6-2"].includes(node?.id)) {
            setTimeout(() => {
                setDroppableNodes(droppableNodes.map(node =>
                    node.type === "type1" ? { ...node, ok: false } : node
                ));
            }, 1000);
        }

        if (node?.id === "6-3") {
            setShowGif(true);
            setTimeout(() => {
                setShowGif(false);
            }, 8000);
        }
    };

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );

    return (
        <Flex align="center" vertical style={{ height: "100%", width: "95%", backgroundColor: "grey" }}>
            <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                <Flex align="start" vertical style={{ padding: "1vmax 0vmax 5vh" }}>
                    <Row>
                        <Col>
                            <Draggable
                                id={extendedNodes[0].id}
                                type={extendedNodes[0].type}
                                x={X + extendedNodes[0].posX}
                                y={Y + extendedNodes[0].posY}
                                ok={extendedNodes[0].ok}
                                src={extendedNodes[0].src}
                                text={extendedNodes[0].text}
                                shape={extendedNodes[0].shape}
                            />
                        </Col>
                    </Row>
                    <Row>
                        {extendedNodes.slice(1, 5).map((element) => (
                            <Col key={element.id} style={{ paddingRight: "0.5vmax" }}>
                                <Draggable
                                    id={element.id}
                                    type={element.type}
                                    x={X + element.posX}
                                    y={Y + element.posY}
                                    ok={element.ok}
                                    src={element.src}
                                    text={element.text}
                                    shape={element.shape}
                                    stop={element.stop}
                                    bigStop={element.bigStop}
                                    nexus={element.nexus}
                                />
                            </Col>
                        ))}
                    </Row>
                    <Row>
                        {extendedNodes.slice(5).map((element) => (
                            <Col key={element.id} style={{ paddingRight: "0.5vmax" }}>
                                <Draggable
                                    id={element.id}
                                    type={element.type}
                                    x={X + element.posX}
                                    y={Y + element.posY}
                                    ok={element.ok}
                                    src={element.src}
                                    text={element.text}
                                    shape={element.shape}
                                    stop={element.stop}
                                    bigStop={element.bigStop}
                                    nexus={element.nexus}
                                />
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
                        <path d="M 220 70 L 220 85 L 60 85 L 60 105" fill="none" stroke="rgb(0, 0, 0)" />
                        <path d="M 60 150 L 60 165" fill="none" stroke="rgb(0, 0, 0)" />
                        <path d={`M 350 165 ${pathBottom[networkType]}`} fill="none" stroke="rgb(0, 0, 0)" />
                        {[1, 2].includes(networkType) &&
                            <path
                                d={pathBottom2[networkType - 1]}
                                fill="none"
                                stroke="rgb(0, 0, 0)"
                            />
                        }
                        {[1, 2].includes(networkType) &&
                            <ellipse
                                cx={ellipse[networkType - 1]}
                                cy="205"
                                rx="60"
                                ry="40"
                                fill="rgb(255, 255, 255)"
                                stroke="rgb(0, 0, 0)"
                            />
                        }
                        {networkType === 2 &&
                            <path
                                d="M 570 145 L 570 150 L 790 150 L 790 165"
                                fill="none"
                                stroke="rgb(0, 0, 0)"
                            />
                        }
                        {networkType === 2 &&
                            <ellipse
                                cx="790"
                                cy="205"
                                rx="60"
                                ry="40"
                                fill="rgb(255, 255, 255)"
                                stroke="rgb(0, 0, 0)"
                            />
                        }
                        {droppableNodes.filter(
                            (value, index, self) => index === self.findIndex(
                                (t) => (t.type === value.type)
                            )).map((element) =>
                                <Droppable
                                    key={element.id}
                                    id={element.id}
                                    type={element.type}
                                    x={X + element.posX}
                                    y={Y + element.posY}
                                    ok={element.ok}
                                    src={element.src}
                                    text={element.text}
                                    stop={element.stop}
                                    bigStop={element.bigStop}
                                    nexus={element.nexus}
                                />
                            )
                        }
                    </svg>
                </Flex>
            </DndContext>
            {showGif && <img
                src="/pawpatrol.webp"
                className="moving-image"
                alt="Moving"
                style={{
                    position: "fixed",
                    right: "20vw",
                    bottom: "50vh",
                    height: "20vmax"
                }} />
            }
        </Flex>
    );
};

export default ExampleDnD;