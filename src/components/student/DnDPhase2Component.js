import React, { useState, useRef, useEffect } from 'react';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { Card, Col, Divider, Flex, Row } from 'antd';
import DroppablePhase2 from './DroppablePhase2Component';
import DraggablePhase2 from './DraggablePhase2Component';
import { pathBottom2, pathBottom, pathTop, X, Y, viewBoxWidth, stopX, nodes, nexusX } from './NetworkProps';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../SessionComponent';


let DnDPhase2 = () => {

    let { feedback, setFeedback, exercise } = useSession();

    useEffect(() => {
        if (feedback?.phase2?.elapsedTime) {
            saveFeedback(feedback);
        }
    }, [feedback]);

    let startTime = useRef(Date.now());

    let navigate = useNavigate();
    let exerciseNodes = nodes(exercise);
    let [showGif, setShowGif] = useState(false);
    let [element, setElement] = useState();

    let [extendedNodes, setExtendedNodes] = useState([
        { ...exerciseNodes[0], order: 0, id: "1-1" },
        { ...exerciseNodes[0], order: 1, id: "1-2" },
        ...exerciseNodes.slice(1, 3),
        { ...exerciseNodes[5], order: 4, id: "6-2", type: "type6-2", src: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/8289`, bigStop: true },
        { ...exerciseNodes[0], order: 5, id: "1-3" },
        ...exerciseNodes.slice(3, 5),
        ...exerciseNodes.slice(6),
        { ...exerciseNodes[5], order: exerciseNodes.length + 2, id: "6-3", type: "type6-3", posX: nexusX(exercise?.networkType) + stopX(exercise?.networkType), src: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/8289`, bigStop: true }
    ]);

    let [droppableNodes, setDroppableNodes] = useState(JSON.parse(JSON.stringify(extendedNodes)));
    let [current, setCurrent] = useState(0);

    let saveFeedback = async (feedback) => {

        try {
            await fetch(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/statistics`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({ feedback })
            });
        } catch (e) {
            return;
        }
    };

    let handleDragStart = (event) => {
        setElement(event.active);
    };

    let handleDragEnd = (event) => {
        let { active, over } = event;
        let node = null;
        let correct = false;
        let isStop = element.data.current.stop || element.data.current.bigStop;
        if (over) {
            if (over.data.current.accepts.includes(active.data.current.type)) {
                let updated = extendedNodes.map((element) => {
                    if (element.id === active.id) {
                        if (element.order === current) {
                            element.ok = true;
                            node = element;
                            setCurrent(current + 1);
                            correct = true;
                        } else {
                            setFeedback({
                                phase1: { ...feedback.phase1 },
                                phase2: isStop ? {
                                    ...feedback.phase2,
                                    incorrectOrderStop: feedback?.phase2?.incorrectOrderStop == null ? 1 : feedback?.phase2?.incorrectOrderStop + 1
                                } : {
                                    ...feedback.phase2,
                                    incorrectOrder: feedback?.phase2?.incorrectOrder == null ? 1 : feedback?.phase2?.incorrectOrder + 1
                                }
                            });
                        }
                    }
                    return element;
                });
                setExtendedNodes(updated);
                correct && setDroppableNodes(updated);
            } else {
                setFeedback({
                    phase1: { ...feedback.phase1 },
                    phase2: isStop ? {
                        ...feedback.phase2,
                        incorrectPosStop: feedback?.phase2?.incorrectPosStop == null ? 1 : feedback?.phase2?.incorrectPosStop + 1
                    } : {
                        ...feedback.phase2,
                        incorrectPos: feedback?.phase2?.incorrectPos == null ? 1 : feedback?.phase2?.incorrectPos + 1
                    }
                });
            }
        } else {
            setFeedback({
                phase1: { ...feedback.phase1 },
                phase2: {
                    ...feedback.phase2,
                    elementOutOfBounds: feedback?.phase2?.elementOutOfBounds == null ? 1 : feedback?.phase2?.elementOutOfBounds + 1
                }
            });
        }

        if (node?.id === "6-3") {
            let endTime = Date.now();
            setFeedback({
                phase1: { ...feedback.phase1 },
                phase2: {
                    ...feedback.phase2,
                    elapsedTime: (endTime - startTime.current) / 1000
                },
                title: exercise.title,
                level: exercise.representation,
                date: Date.now()
            });
            setShowGif(true);
            setTimeout(() => {
                setShowGif(false);
                navigate("/students/exercises");
            }, 6000);
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
        <Card style={{ height: "100%", width: "95%" }} >
            <Flex align="center" vertical >
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
                    <Flex align="center" justify="center" style={{ height: "90%", width: "90%" }} >
                        <svg height="18vmax" viewBox={`0 0 ${viewBoxWidth(exercise?.networkType)} 250`}>
                            <path d={`M 220 70 L 220 85 ${pathTop(exercise?.networkType)}`} fill="none" stroke="rgb(0, 0, 0)" />
                            <path d="M 220 70 L 220 85 L 60 85 L 60 105" fill="none" stroke="rgb(0, 0, 0)" />
                            <path d="M 60 150 L 60 165" fill="none" stroke="rgb(0, 0, 0)" />
                            <path d={`M 350 165 ${pathBottom(exercise?.networkType)}`} fill="none" stroke="rgb(0, 0, 0)" />
                            {["I-II", "I-III"].includes(exercise?.networkType) &&
                                <path
                                    d={pathBottom2(exercise?.networkType)}
                                    fill="none"
                                    stroke="rgb(0, 0, 0)"
                                />
                            }

                            {exercise?.networkType === "I-III" &&
                                <path
                                    d="M 570 145 L 570 150 L 790 150 L 790 165"
                                    fill="none"
                                    stroke="rgb(0, 0, 0)"
                                />
                            }

                            {extendedNodes.slice().sort((a, b) => b.order - a.order).map((element) =>
                                <DraggablePhase2
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
                    <Divider style={{ backgroundColor: "grey" }} />
                    <Flex align="start" vertical style={{ padding: "1vmax 0vmax 5vh" }}>
                        <Row>
                            <Col>
                                <DroppablePhase2
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
                                    <DroppablePhase2
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
                                    <DroppablePhase2
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
                    src="/reinforcement/pawpatrol.webp"
                    className="moving-image"
                    alt="Moving"
                    style={{
                        position: "fixed",
                        right: "20vw",
                        bottom: "50vh",
                        height: "20vmax",
                        transform: "scaleX(-1)"
                    }} />
                }
            </Flex>
        </Card>
    );
};

export default DnDPhase2;