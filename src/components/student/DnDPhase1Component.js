import React, { useRef, useState } from 'react';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Card, Col, Divider, Flex, Row } from 'antd';
import DroppablePhase1 from './DroppablePhase1Component';
import DraggablePhase1 from './DraggablePhase1Component';
import { pathBottom2, pathBottom, pathTop, X, Y, viewBoxWidth, stopX, nodes, nexusX, STOP } from './NetworkProps';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSession } from '../../SessionComponent';

let DnDPhase1 = () => {
    
    let { exercise, feedback, setFeedback } = useSession();
    let startTime = useRef(Date.now());

    let navigate = useNavigate();
    let { t } = useTranslation();
    let exerciseNodes = nodes(exercise);
    let [showGif, setShowGif] = useState(false);
    let [element, setElement] = useState();

    let [extendedNodes, setExtendedNodes] = useState([
        { ...exerciseNodes[0], order: 0, id: "1-1" },
        { ...exerciseNodes[0], order: 1, id: "1-2" },
        ...exerciseNodes.slice(1, 3),
        { ...exerciseNodes[5], order: 4, id: "6-2", type: "type6-2", src: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, bigStop: true },
        { ...exerciseNodes[0], order: 5, id: "1-3" },
        ...exerciseNodes.slice(3, 5),
        ...exerciseNodes.slice(6),
        { ...exerciseNodes[5], order: exerciseNodes.length + 2, id: "6-3", type: "type6-3", posX: nexusX(exercise?.networkType) + stopX(exercise?.networkType), src: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, bigStop: true }
    ]);

    let [droppableNodes, setDroppableNodes] = useState(JSON.parse(JSON.stringify(extendedNodes)));
    let [current, setCurrent] = useState(0);

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
                                phase1: isStop ? {
                                    ...feedback.phase1,
                                    incorrectOrderStop: feedback?.phase1?.incorrectOrderStop == null ? 1 : feedback?.phase1?.incorrectOrderStop + 1
                                } : {
                                    ...feedback.phase1,
                                    incorrectOrder: feedback?.phase1?.incorrectOrder == null ? 1 : feedback?.phase1?.incorrectOrder + 1
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
                    phase1: isStop ? {
                        ...feedback.phase1,
                        incorrectPosStop: feedback?.phase1?.incorrectPosStop == null ? 1 : feedback?.phase1?.incorrectPosStop + 1
                    } : {
                        ...feedback.phase1,
                        incorrectPos: feedback?.phase1?.incorrectPos == null ? 1 : feedback?.phase1?.incorrectPos + 1
                    }
                });
            }
        } else {
            setFeedback({
                phase1: {
                    ...feedback.phase1,
                    elementOutOfBounds: feedback?.phase1?.elementOutOfBounds == null ? 1 : feedback?.phase1?.elementOutOfBounds + 1
                }
            });
        }

        if (["1-1", "6-2"].includes(node?.id) && node?.order === current) {
            setTimeout(() => {
                setDroppableNodes(droppableNodes.map(node =>
                    node.type === "type1" ? { ...node, ok: false } : node
                ));
            }, 1000);
        }

        if (node?.id === "6-3" && node?.order === current) {
            let endTime = Date.now();
            setFeedback({
                phase1: {
                    ...feedback.phase1,
                    elapsedTime: (endTime - startTime.current) / 1000
                }
            });
            setShowGif(true);
            setTimeout(() => {
                setShowGif(false);
                navigate("/exerciseDnD/phase2");
            }, 6000);
        }
    };

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );

    return (
        <Card style={{ height: "100%", width: "95%" }} >
            <Flex align="center" vertical>
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors} >
                    <Flex align="start" vertical >
                        <Row>
                            <Col>
                                <DraggablePhase1
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
                                    <DraggablePhase1
                                        id={element.id}
                                        type={element.type}
                                        x={X + element.posX}
                                        y={Y + element.posY}
                                        ok={element.ok}
                                        src={element.src}
                                        text={t(element.text)}
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
                                    <DraggablePhase1
                                        id={element.id}
                                        type={element.type}
                                        x={X + element.posX}
                                        y={Y + element.posY}
                                        ok={element.ok}
                                        src={element.src}
                                        text={t(element.text)}
                                        shape={element.shape}
                                        stop={element.stop}
                                        bigStop={element.bigStop}
                                        nexus={element.nexus}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Flex>
                    <Divider style={{ backgroundColor: "grey" }} />
                    <Flex align="center" justify="center" style={{ height: "90%", width: "90%" }} >
                        <svg height="18vmax" viewBox={`0 0 ${viewBoxWidth(exercise?.networkType)} 250`}>
                            <rect x="160" y="1" width="120" height="70" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" />
                            <ellipse cx="60" cy="205" rx="60" ry="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" />
                            <ellipse cx="350" cy="205" rx="60" ry="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" />
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
                            {["I-II", "I-III"].includes(exercise?.networkType) &&
                                <ellipse
                                    cx={exercise?.networkType === "I-II" ? "610" : "570"}
                                    cy="205"
                                    rx="60"
                                    ry="40"
                                    fill="rgb(255, 255, 255)"
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
                            {exercise?.networkType === "I-III" &&
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
                                    <DroppablePhase1
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
                    src="/reinforcement/pocoyo.gif"
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

export default DnDPhase1;