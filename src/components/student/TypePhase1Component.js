import React, { useRef, useState } from 'react';
import { Card, Col, Divider, Flex, Input, Row } from 'antd';
import { pathBottom2, pathBottom, pathTop, X, Y, viewBoxWidth, stopX, nodes, nexusX } from './NetworkProps';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

let TypePhase1 = ({ exercise, feedback, setFeedback }) => {

    let startTime = useRef(Date.now());

    let { t } = useTranslation();
    let navigate = useNavigate();
    let exerciseNodes = nodes(exercise);
    let [showGif, setShowGif] = useState(false);

    let [extendedNodes, setExtendedNodes] = useState([
        { ...exerciseNodes[0], order: 0, id: "1-1" },
        { ...exerciseNodes[0], order: 1, id: "1-2" },
        ...exerciseNodes.slice(1, 3),
        { ...exerciseNodes[5], order: 4, id: "6-2", type: "type6-2", bigStop: true },
        { ...exerciseNodes[0], order: 5, id: "1-3" },
        ...exerciseNodes.slice(3, 5),
        ...exerciseNodes.slice(6),
        { ...exerciseNodes[5], order: exerciseNodes.length + 2, id: "6-3", type: "type6-3", posX: nexusX(exercise?.networkType) + stopX(exercise?.networkType), bigStop: true }
    ]);

    const getTextPosition = (bigStop, stop, shape) => {
        if (bigStop) return { x: "1vmax", y: "4vmax", fontSize: "2.3vmax" };
        if (stop) return { x: "5vmax", y: "4vmax", fontSize: "1.8vmax" };
        if (shape === "rect") return { x: "3.75vmax", y: "2.75vmax", fontSize: "1vmax" };
        if (shape === "ellipse") return { x: "5vmax", y: "3vmax", fontSize: "1vmax" };
        return { x: "5vmax", y: "2.5vmax", fontSize: "1vmax" };
    };

    let checkSpell = (word) => {
        return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    let [id, setId] = useState("1-1");
    let [current, setCurrent] = useState(0);

    let check = () => {

        let i = document.getElementById(id);

        extendedNodes.forEach((element) => {
            if (element?.id === i?.id) {
                let text = t(element.text);
                if (text.length === i.value.length) {
                    if (text.toLowerCase() === checkSpell(i.value.toLowerCase())) {
                        if (current === 0 || current === 4) {
                            setTimeout(() => {
                                setExtendedNodes(extendedNodes.map(node =>
                                    node.type === "type1" ? { ...node, clicked: false, ok: false } : node
                                ));
                            }, 1000);
                        }
                        element.ok = true;
                        i.readOnly = true;
                        setCurrent(current + 1);

                        if (i?.id === "6-3") {
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
                                navigate("/exerciseType/phase2");
                            }, 6000);
                        }
                    }
                    else {
                        setFeedback({
                            phase1: {
                                ...feedback.phase1,
                                spellingError: feedback?.phase1?.spellingError == null ? 1 : feedback?.phase1?.spellingError + 1
                            }
                        });
                    }
                }
            }
            return element;
        });
    };

    return (
        <Card style={{ height: "100%", width: "95%" }} >
            <Flex align="center" vertical >
                <Flex align="start" vertical>
                    <Row>
                        <Col key={extendedNodes[0].id}>
                            <svg height="6.5vmax" width="9vmax">
                                <rect
                                    width="7.8vmax"
                                    height="4.7vmax"
                                    fill="white"
                                    stroke="black"
                                />
                                <text
                                    {...getTextPosition(extendedNodes[0].bigStop, extendedNodes[0].stop, extendedNodes[0].shape)}
                                    fill="black"
                                    textAnchor="middle"
                                >
                                    {extendedNodes[0].text}
                                </text>
                            </svg>
                        </Col>
                    </Row>
                    <Row>
                        {extendedNodes.slice(1, 5).map((element) => (
                            <Col key={element.id} style={{ paddingRight: "0.5vmax" }}>
                                <svg height="6.5vmax" width="9vmax">
                                    {element.shape === "rect" &&
                                        <rect
                                            width="7.8vmax"
                                            height="4.7vmax"
                                            fill="white"
                                            stroke="black"
                                        />
                                    }
                                    {element.shape === "ellipse" &&
                                        <ellipse
                                            cx="5vmax"
                                            cy="2.7vmax"
                                            rx="3.9vmax"
                                            ry="2.6vmax"
                                            fill="white"
                                            stroke="black"
                                        />
                                    }
                                    <text
                                        {...getTextPosition(element.bigStop, element.stop, element.shape)}
                                        fill="black"
                                        textAnchor="middle"
                                    >
                                        {t(element.text)}
                                    </text>
                                </svg>
                            </Col>
                        ))}
                    </Row>
                    <Row>
                        {extendedNodes.slice(5).map((element) => (
                            <Col key={element.id} style={{ paddingRight: "0.5vmax" }}>
                                <svg height="6.5vmax" width="9vmax">
                                    {element.shape === "rect" &&
                                        <rect
                                            width="7.8vmax"
                                            height="4.7vmax"
                                            fill="white"
                                            stroke="black"
                                        />
                                    }
                                    {element.shape === "ellipse" &&
                                        <ellipse
                                            cx="5vmax"
                                            cy="2.7vmax"
                                            rx="3.9vmax"
                                            ry="2.6vmax"
                                            fill="white"
                                            stroke="black"
                                        />
                                    }
                                    <text
                                        {...getTextPosition(element.bigStop, element.stop, element.shape)}
                                        fill="black"
                                        textAnchor="middle"
                                    >
                                        {t(element.text)}
                                    </text>
                                </svg>
                            </Col>
                        ))}
                    </Row>
                </Flex>
                <Divider style={{ backgroundColor: "grey" }} />
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

                        {extendedNodes.slice().sort((a, b) => b.order - a.order).map((element) => {
                            if (element.shape === "rect") {
                                return (
                                    <g key={element.id + element.order}>
                                        <rect
                                            x={X + element.posX - 50}
                                            y={Y + element.posY - 25}
                                            width="120"
                                            height="70"
                                            fill="rgb(255, 255, 255)"
                                            stroke="rgb(0, 0, 0)"
                                        />
                                        {element.clicked ?
                                            (
                                                <foreignObject
                                                    x={X + element.posX - 48}
                                                    y={Y + element.posY - 4}
                                                    width="116"
                                                    height="3vmax"
                                                >
                                                    <Input
                                                        id={element.id}
                                                        style={{ textTransform: "uppercase" }}
                                                        onChange={() => check()}
                                                        autoFocus={true}
                                                        autoComplete='off'
                                                        value={extendedNodes[0].ok ? extendedNodes[0].text : undefined}
                                                    />
                                                </foreignObject>
                                            ) : (<rect
                                                onClick={() => {
                                                    if (current === 0 || current === 1 || current === 5) {
                                                        let updated = extendedNodes.map((e) => {
                                                            if (element.id === e.id) {
                                                                e.clicked = true;
                                                            }
                                                            return e;
                                                        });
                                                        setId(element.id);
                                                        setExtendedNodes(updated);
                                                    }
                                                }}
                                                onPointerOver={(event) => { event.target.style.fill = "#ea9999"; }}
                                                onPointerOut={(event) => { event.target.style.fill = "#f8cecc"; }}
                                                x={X + element.posX}
                                                y={Y + element.posY}
                                                width="1.5vmax"
                                                height="1.5vmax"
                                                fill="#f8cecc"
                                            />)
                                        }
                                    </g>
                                );
                            }
                            if (element.shape === "ellipse") {
                                return (
                                    <g key={element.id + element.order}>
                                        <ellipse
                                            cx={X + element.posX + 10}
                                            cy={Y + element.posY + 12}
                                            rx="60"
                                            ry="40"
                                            fill="white"
                                            stroke="black"
                                        />
                                        {element.clicked ?
                                            (
                                                <foreignObject
                                                    x={X + element.posX - 42}
                                                    y={Y + element.posY - 4}
                                                    width="105"
                                                    height="3vmax"
                                                >
                                                    <Input
                                                        id={element.id}
                                                        style={{ textTransform: "uppercase" }}
                                                        onChange={() => check()}
                                                        autoFocus={true}
                                                        autoComplete='off'
                                                        value={element.ok ? element.text : undefined}
                                                    />

                                                </foreignObject>
                                            ) : (<rect
                                                onClick={() => {
                                                    if (element.order === current) {
                                                        let updated = extendedNodes.map((e) => {
                                                            if (element.id === e.id) {
                                                                e.clicked = true;
                                                            }
                                                            return e;
                                                        });
                                                        setId(element.id);
                                                        setExtendedNodes(updated);
                                                    }
                                                }}
                                                onPointerOver={(event) => { event.target.style.fill = "#ea9999"; }}
                                                onPointerOut={(event) => { event.target.style.fill = "#f8cecc"; }}
                                                x={X + element.posX}
                                                y={Y + element.posY}
                                                width="1.5vmax"
                                                height="1.5vmax"
                                                fill="#f8cecc"
                                            />)
                                        }
                                    </g>
                                );
                            }
                            if (element.bigStop) {
                                return (
                                    element.clicked ?
                                        (
                                            <foreignObject
                                                x={X + element.posX}
                                                y={Y + element.posY - 4}
                                                width="50"
                                                height="3vmax"
                                            >
                                                <Input
                                                    id={element.id}
                                                    style={{ textTransform: "lowercase" }}
                                                    onChange={() => check()}
                                                    autoFocus={true}
                                                    autoComplete='off'
                                                    value={element.ok ? t(element.text) : undefined}
                                                />
                                            </foreignObject>
                                        ) : (<rect
                                            key={element.id + element.order}
                                            onClick={() => {
                                                if (element.order === current) {
                                                    let updated = extendedNodes.map((e) => {
                                                        if (element.id === e.id) {
                                                            e.clicked = true;
                                                        }
                                                        return e;
                                                    });
                                                    setId(element.id);
                                                    setExtendedNodes(updated);
                                                }
                                            }}
                                            onPointerOver={(event) => { event.target.style.fill = "#ea9999"; }}
                                            onPointerOut={(event) => { event.target.style.fill = "#f8cecc"; }}
                                            x={X + element.posX}
                                            y={Y + element.posY}
                                            width="1.5vmax"
                                            height="1.5vmax"
                                            fill="#f8cecc"
                                        />)

                                );
                            }
                            if (element.stop) {
                                return (
                                    element.clicked ?
                                        (
                                            <foreignObject
                                                x={X + element.posX - 30}
                                                y={Y + element.posY - 4}
                                                width="50"
                                                height="3vmax"
                                            >
                                                <Input
                                                    id={element.id}
                                                    style={{ textTransform: "lowercase" }}
                                                    onChange={() => check()}
                                                    autoFocus={true}
                                                    autoComplete='off'
                                                    value={element.ok ? t(element.text) : undefined}
                                                />
                                            </foreignObject>
                                        ) : (<rect
                                            key={element.id + element.order}
                                            onClick={() => {
                                                if (element.order === current) {
                                                    let updated = extendedNodes.map((e) => {
                                                        if (element.id === e.id) {
                                                            e.clicked = true;
                                                        }
                                                        return e;
                                                    });
                                                    setId(element.id);
                                                    setExtendedNodes(updated);
                                                }
                                            }}
                                            onPointerOver={(event) => { event.target.style.fill = "#ea9999"; }}
                                            onPointerOut={(event) => { event.target.style.fill = "#f8cecc"; }}
                                            x={X + element.posX}
                                            y={Y + element.posY}
                                            width="1.5vmax"
                                            height="1.5vmax"
                                            fill="#f8cecc"
                                        />)

                                );
                            }
                            else {
                                return (
                                    element.clicked ?
                                        (
                                            <foreignObject
                                                x={X + element.posX - 50}
                                                y={Y + element.posY - 4}
                                                width="116"
                                                height="3vmax"
                                            >
                                                <Input
                                                    id={element.id}
                                                    style={{ textTransform: "lowercase" }}
                                                    onChange={() => check()}
                                                    autoFocus={true}
                                                    autoComplete='off'
                                                    value={element.ok ? t(element.text) : undefined}
                                                />
                                            </foreignObject>
                                        ) : (<rect
                                            key={element.id + element.order}
                                            onClick={() => {
                                                if (element.order === current) {
                                                    let updated = extendedNodes.map((e) => {
                                                        if (element.id === e.id) {
                                                            e.clicked = true;
                                                        }
                                                        return e;
                                                    });
                                                    setId(element.id);
                                                    setExtendedNodes(updated);
                                                }
                                            }}
                                            onPointerOver={(event) => { event.target.style.fill = "#ea9999"; }}
                                            onPointerOut={(event) => { event.target.style.fill = "#f8cecc"; }}
                                            x={X + element.posX}
                                            y={Y + element.posY}
                                            width="1.5vmax"
                                            height="1.5vmax"
                                            fill="#f8cecc"
                                        />)

                                );
                            }

                        })}
                    </svg>
                </Flex>
                {showGif && <img
                    src="/reinforcement/pato.gif"
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

export default TypePhase1;