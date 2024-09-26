import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Divider, Flex, Input, Row } from 'antd';
import { pathBottom2, pathBottom, pathTop, X, Y, viewBoxWidth, stopX, nodes, nexusX } from './NetworkProps';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { exercisesServiceURL } from '../../Globals';
let TypePhase2 = ({ exercise, feedback, setFeedback }) => {

    let startTime = useRef(Date.now());

    useEffect(() => {
        if (feedback?.phase2?.elapsedTime) {
            saveFeedback(feedback);
        }
    }, [feedback]);

    let saveFeedback = async (feedback) => {
        try {
            await fetch(`${exercisesServiceURL}/statistics?apiKey=${localStorage.getItem("apiKey")}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ feedback })
            });
        } catch (e) {
            return;
        }
    };

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

    let [id, setId] = useState("1-1");
    let [current, setCurrent] = useState(0);

    let checkSpell = (word) => {
        return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    let check = () => {

        let i = document.getElementById(id);

        extendedNodes.forEach((element) => {
            if (element?.id === i?.id) {
                let text = t(element.text);
                if (text.length === i.value.length) {
                    if (text.toLowerCase() === checkSpell(i.value.toLowerCase())) {
                        i.readOnly = true;
                        element.ok = true;
                        setCurrent(current + 1);

                        if (i.id === "6-3") {
                            let endTime = Date.now();
                            setFeedback({
                                phase1: { ...feedback.phase1 },
                                phase2: {
                                    ...feedback.phase2,
                                    elapsedTime: (endTime - startTime.current) / 1000
                                },
                                title: exercise.title,
                                level: exercise.representation,

                            });
                            setShowGif(true);
                            setTimeout(() => {
                                setShowGif(false);
                                navigate("/students/exercises");
                            }, 6000);
                        }
                    }
                    else {
                        setFeedback({
                            phase1: { ...feedback.phase1 },
                            phase2: {
                                ...feedback.phase2,
                                spellingError: feedback?.phase2?.spellingError == null ? 1 : feedback?.phase2?.spellingError + 1
                            }
                        });
                    }
                }
            }
        });
    };

    return (
        <Card style={{ height: "100%", width: "95%" }} >
            <Flex align="center" vertical >
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
                                        <text
                                            x={element.posX + 220}
                                            y={element.posY + 40}
                                            width="120"
                                            height="70"
                                            fill="black"
                                            textAnchor="middle"
                                        >
                                            {element.text}
                                        </text>
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
                                        <text
                                            x={element.posX + 220}
                                            y={element.posY + 42}
                                            width="120"
                                            height="70"
                                            fill="black"
                                            textAnchor="middle"
                                        >
                                            {element.text}
                                        </text>
                                    </g>
                                );
                            }

                            else {
                                return (<text
                                    key={element.id}
                                    x={element.posX + 220}
                                    y={element.posY + 42}
                                    width="120"
                                    height="70"
                                    fill="black"
                                    textAnchor="middle"
                                    fontSize={element.stop ? "1.5vmax" : element.bigStop ? "2.3vmax" : "1.1vmax"}
                                >
                                    {t(element.text)}
                                </text>);
                            }

                        })}
                    </svg>
                </Flex>
                <Divider style={{ backgroundColor: "grey" }} />
                <Flex align="start" vertical >
                    <Row>
                        <Col key={extendedNodes[0].id}>
                            <svg height="6.5vmax" width="9vmax">
                                <g key={extendedNodes[0].id + extendedNodes[0].order}>
                                    <rect
                                        width="7.8vmax"
                                        height="4.7vmax"
                                        fill="white"
                                        stroke="black"
                                    />
                                    {extendedNodes[0].clicked ?
                                        (
                                            <foreignObject
                                                x={extendedNodes[0].posX + 3}
                                                y={`${extendedNodes[0].posY + 1.3}vmax`}
                                                width="7.4vmax"
                                                height="4vh"
                                            >
                                                <Input
                                                    autoFocus={true}
                                                    autoComplete='off'
                                                    id={extendedNodes[0].id}
                                                    style={{ textTransform: "uppercase" }}
                                                    onChange={() => check()}
                                                    value={extendedNodes[0].ok ? extendedNodes[0].text : undefined}
                                                />
                                            </foreignObject>
                                        ) : (<rect
                                            onClick={() => {
                                                if (extendedNodes[0].order === current) {
                                                    let updated = extendedNodes.map((e) => {
                                                        if (extendedNodes[0].id === e.id) {
                                                            e.clicked = true;
                                                        }
                                                        return e;
                                                    });
                                                    setId(extendedNodes[0].id);
                                                    setExtendedNodes(updated);
                                                }
                                            }}
                                            onPointerOver={(event) => { event.target.style.fill = "#ea9999"; }}
                                            onPointerOut={(event) => { event.target.style.fill = "#f8cecc"; }}
                                            x="3.2vmax"
                                            y="1.5vmax"
                                            width="1.5vmax"
                                            height="1.5vmax"
                                            fill="#f8cecc"
                                        />)
                                    }
                                </g>
                            </svg>
                        </Col>
                    </Row>
                    <Row>
                        {extendedNodes.slice(1, 5).map((element) => (
                            <Col key={element.id} style={{ paddingRight: "0.5vmax" }}>
                                <svg height="6.5vmax" width="9vmax">
                                    <g key={element.id + element.order}>
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
                                        {element.clicked ?
                                            (
                                                <foreignObject
                                                    x={element.shape === "ellipse" ?
                                                        "20%" : "2%"}
                                                    y={element.bigStop ?
                                                        "40%" :
                                                        element.shape === "rect" ? `${element.posY + 1.3}vmax` : "25%"}
                                                    width={element.bigStop ?
                                                        "3vmax" :
                                                        element.shape === "ellipse" ?
                                                            "6.5vmax" : "7.4vmax"}
                                                    height="40px"
                                                >
                                                    <Input
                                                        autoFocus={true}
                                                        autoComplete='off'
                                                        id={element.id}
                                                        style={{ textTransform: element.shape ? "uppercase" : "lowercase" }}
                                                        height={"40px"}
                                                        onChange={() => check()}
                                                        value={element.ok ? (element.shape ? element.text : t(element.text)) : undefined}
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
                                                x={element.shape === "rect" ?
                                                    "35%" :
                                                    element.bigStop ?
                                                        "10%" : "47%"}
                                                y={element.shape === "rect" ?
                                                    "25%" :
                                                    element.bigStop ?
                                                        "50%" : "30%"}
                                                width="1.5vmax"
                                                height="1.5vmax"
                                                fill="#f8cecc"
                                            />)
                                        }
                                    </g>
                                </svg>
                            </Col>
                        ))}
                    </Row>
                    <Row>
                        {extendedNodes.slice(5).map((element) => (
                            <Col key={element.id} style={{ paddingRight: "0.5vmax" }}>
                                <svg height="6.5vmax" width="9vmax">
                                    <g key={element.id + element.order}>
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
                                        {element.clicked ?
                                            (
                                                <foreignObject
                                                    x={element.shape === "ellipse" ?
                                                        "20%" : element.stop ? "30%" : "2%"}
                                                    y={element.bigStop || element.stop ?
                                                        "40%" :
                                                        element.shape === "ellipse" ?
                                                            "25%" : "20%"}
                                                    width={element.bigStop || element.stop ?
                                                        "3vmax" :
                                                        element.shape === "ellipse" ?
                                                            "6.5vmax" : "7.4vmax"}
                                                    height="40px"
                                                >
                                                    <Input
                                                        autoFocus={true}
                                                        autoComplete='off'
                                                        id={element.id}
                                                        style={{ textTransform: element.shape ? "uppercase" : "lowercase" }}
                                                        height={"40px"}
                                                        onChange={() => check()}
                                                        value={element.ok ? (element.shape ? element.text : t(element.text)) : undefined}
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
                                                x={element.shape === "rect" ?
                                                    "35%" :
                                                    element.bigStop ?
                                                        "10%" : "47%"}
                                                y={element.shape === "rect" ?
                                                    "25%" :
                                                    element.bigStop || element.stop ?
                                                        "50%" : "30%"}
                                                width="1.5vmax"
                                                height="1.5vmax"
                                                fill="#f8cecc"
                                            />)
                                        }
                                    </g>
                                </svg>
                            </Col>
                        ))}
                    </Row>
                </Flex>
                {showGif && <img
                    src="/reinforcement/bluey.gif"
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

export default TypePhase2;