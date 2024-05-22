import React, { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';

import Droppable2 from './Droppable2';
import Draggable2 from './Draggable2';
import { Col, Flex, Row } from 'antd';

let ExampleDnD2 = () => {

    const X = 210;
    const Y = 25;
    const nexusX = [130, 260, 350];
    const viewBoxWidth = [480, 730, 920];
    const stopX = [90, 210, 310];
    let [showGif, setShowGif] = useState(false);
    let [element, setElement] = useState();

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

    let handleDragStart = (event) => {
        setElement(event.active);
    };
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

        if (node?.id === "6-3") {
            setShowGif(true);
            setTimeout(() => {
                setShowGif(false);
            }, 8000);
        }
        setElement(null);
    };

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );

    const getImagePosition = (nexus, stop, bigStop, shape) => {
        if (nexus) return { x: "1.75vmax", width: "1.75vmax", height: "1.75vmax" };
        if (stop) return { width: "2vmax", height: "2vmax" };
        if (bigStop) return { width: "3vmax", height: "3vmax" };
        if (shape === "rect") return { x: "2.5vmax", y: "0.3vmax", width: "3.25vmax", height: "3.25vmax" };
        if (shape === "ellipse") return { x: "2.5vmax", y: "0.5vmax", width: "3.75vmax", height: "3.75vmax" };
        return {};
    };

    const getTextPosition = (bigStop, stop, shape) => {
        if (bigStop) return { x: "3.4vmax", y: "3.5vmax", fontSize: "2.3vmax" };
        if (stop) return { x: "2.5vmax", y: "2vmax", fontSize: "1.8vmax" };
        if (shape === "rect") return { x: "4.25vmax", y: "4.75vmax", fontSize: "1vmax" };
        if (shape === "ellipse") return { x: "4.25vmax", y: "5vmax", fontSize: "1vmax" };
        return { x: "2.75vmax", y: "2.5vmax", fontSize: "1vmax" };
    };


    let getDragElement = () => {
        if (element.data.current.nexus) {
            return (<g>
                <image href={element.data.current.src} {...getImagePosition(element.data.current.nexus, element.data.current.stop, element.data.current.bigStop, element.data.current.shape)} />
                <text {...getTextPosition(element.data.current.bigStop, element.data.current.stop, element.data.current.shape)} fill="black" textAnchor="middle">
                    {element.data.current.text}
                </text>
            </g>);
        }
        if (element.data.current.shape === "rect") {
            return (<g><rect width="8.5vmax" height="5vmax" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" />
                <image href={element.data.current.src} {...getImagePosition(element.data.current.nexus, element.data.current.stop, element.data.current.bigStop, element.data.current.shape)} />
                <text {...getTextPosition(element.data.current.bigStop, element.data.current.stop, element.data.current.shape)} fill="black" textAnchor="middle">
                    {element.data.current.text}
                </text>
            </g>);
        }
        if (element.data.current.shape === "ellipse") {
            return (<g>
                <ellipse
                    cx="4.2vmax"
                    cy="2.9vmax"
                    rx="4.2vmax"
                    ry="2.9vmax"
                    fill="white"
                    stroke="black"
                />
                <image href={element.data.current.src} {...getImagePosition(element.data.current.nexus, element.data.current.stop, element.data.current.bigStop, element.data.current.shape)} />
                <text {...getTextPosition(element.data.current.bigStop, element.data.current.stop, element.data.current.shape)} fill="black" textAnchor="middle">
                    {element.data.current.text}
                </text>
            </g>);
        }
        if (element.data.current.stop) {
            return (<g>
                <image href={element.data.current.src} {...getImagePosition(element.data.current.nexus, element.data.current.stop, element.data.current.bigStop, element.data.current.shape)} />
                <text {...getTextPosition(element.data.current.bigStop, element.data.current.stop, element.data.current.shape)} fill="black" textAnchor="middle">
                    {element.data.current.text}
                </text>
            </g>);
        }
        if (element.data.current.bigStop) {
            return (<g>
                <image href={element.data.current.src} {...getImagePosition(element.data.current.nexus, element.data.current.stop, element.data.current.bigStop, element.data.current.shape)} />
                <text {...getTextPosition(element.data.current.bigStop, element.data.current.stop, element.data.current.shape)} fill="black" textAnchor="middle">
                    {element.data.current.text}
                </text>
            </g>);
        }
    };

    return (
        <Flex align="center" vertical style={{ height: "100%", width: "95%", backgroundColor: "grey" }}>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
                <Flex align="center" justify="center" style={{ height: "90%", width: "90%" }} >
                    <svg height="18vmax" viewBox={`0 0 ${viewBoxWidth[networkType]} 250`}>
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

                        {networkType === 2 &&
                            <path
                                d="M 570 145 L 570 150 L 790 150 L 790 165"
                                fill="none"
                                stroke="rgb(0, 0, 0)"
                            />
                        }

                        {extendedNodes.slice().sort((a, b) => b.order - a.order).map((element) =>
                            <Draggable2
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
                                shape={element.shape}
                            />
                        )}
                    </svg>
                    <DragOverlay>
                        {element?.id ?
                            <svg>
                                {getDragElement()}
                            </svg>
                            : null}
                    </DragOverlay>
                </Flex>
                <Flex align="start" vertical style={{ padding: "1vmax 0vmax 5vh" }}>
                    <Row>
                        <Col>
                            <Droppable2
                                id={droppableNodes[0].id}
                                type={droppableNodes[0].type}
                                x={X + droppableNodes[0].posX}
                                y={Y + droppableNodes[0].posY}
                                ok={droppableNodes[0].ok}
                                src={droppableNodes[0].src}
                                text={droppableNodes[0].text}
                                shape={droppableNodes[0].shape}
                            />
                        </Col>
                    </Row>
                    <Row>
                        {droppableNodes.slice(1, 5).map((element) => (
                            <Col key={element.id} style={{ paddingRight: "0.5vmax" }}>
                                <Droppable2
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
                        {droppableNodes.slice(5).map((element) => (
                            <Col key={element.id} style={{ paddingRight: "0.5vmax" }}>
                                <Droppable2
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

export default ExampleDnD2;
