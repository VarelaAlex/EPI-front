import React, { useEffect, useRef, useState } from 'react';

import { Col, Flex, Input, Row } from 'antd';

let ExampleDnD3 = () => {

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

    let networkType = 2;

    let nodes = [
        { id: "1", type: "type1", posX: 0, posY: 0, src: "boca.png", text: "LA BOCA", shape: "rect", clicked: false },
        { order: 2, id: "2", type: "type2", posX: -160, posY: 90, src: "es_parte_de.png", nexus: true, text: "es parte de", clicked: false },
        { order: 3, id: "3", type: "type3", posX: -160, posY: 170, shape: "ellipse", src: "cara.png", text: "LA CARA", clicked: false },
        { order: 6, id: "4", type: "type4", posX: nexusX[networkType], posY: 90, src: "tiene.png", nexus: true, text: "tiene", clicked: false },
        { order: 7, id: "5", type: "type5", posX: 130, posY: 170, shape: "ellipse", src: "labios.png", text: "LABIOS", clicked: false },
        { id: "6", type: "type6", posX: -70, posY: 190, clicked: false },

        /*
        { order: 8, id: "7", type: "type7", posX: 260, posY: 190, text: "y", src: "stop.png", stop: true },
        { order: 9, id: "8", type: "type8", posX: 390, posY: 170, shape: "ellipse", src: "dientes.png", text: "DIENTES" },
        */


        { order: 8, id: "7", type: "type7", posX: 240, posY: 190, text: ",", src: "stop.png", stop: true },
        { order: 9, id: "8", type: "type8", posX: 350, posY: 170, shape: "ellipse", src: "dientes.png", text: "DIENTES" },
        { order: 10, id: "9", type: "type9", posX: 460, posY: 190, text: "y", src: "stop.png", stop: true },
        { order: 11, id: "10", type: "type10", posX: 570, posY: 170, shape: "ellipse", src: "lengua.png", text: "LENGUA" },

    ];

    let [extendedNodes, setExtendedNodes] = useState([
        { ...nodes[0], order: 0 },
        { ...nodes[0], order: 1 },
        ...nodes.slice(1, 3),
        { ...nodes[5], order: 4, id: "6-2", type: "type6-2", text: ".", src: "stop.png", bigStop: true },
        { ...nodes[0], order: 5 },
        ...nodes.slice(3, 5),
        ...nodes.slice(6),
        { ...nodes[5], order: nodes.length + 2, id: "6-3", type: "type6-3", posX: nexusX[networkType] + stopX[networkType], text: ".", src: "stop.png", bigStop: true }
    ]);

    const getTextPosition = (bigStop, stop, shape) => {
        if (bigStop) return { x: "1vmax", y: "4vmax", fontSize: "2.3vmax" };
        if (stop) return { x: "5vmax", y: "4vmax", fontSize: "1.8vmax" };
        if (shape === "rect") return { x: "3.75vmax", y: "2.75vmax", fontSize: "1vmax" };
        if (shape === "ellipse") return { x: "5vmax", y: "3vmax", fontSize: "1vmax" };
        return { x: "5vmax", y: "2.5vmax", fontSize: "1vmax" };
    };

    let [id, setId] = useState();
    let [current, setCurrent] = useState(0);

    useEffect(() => {
        document.getElementById(id)?.focus();
    }, [id]);

    let input1 = useRef("");

    let check = () => {

        let a = input1.current.input;

        extendedNodes.forEach((element) => {
            if (element.id === a.id && element.text.toLowerCase() === a.value.toLowerCase()) {
                if (current === 0 || current === 4) {
                    setTimeout(() => {
                        setExtendedNodes(extendedNodes.map(node =>
                            node.type === "type1" ? { ...node, clicked: false } : node
                        ));
                    }, 1000);
                }
                setCurrent(current + 1);
            }
            return element;
        });
        if (a.id === "6-3") {
            setShowGif(true);
            setTimeout(() => {
                setShowGif(false);
            }, 8000);
        }
    };

    return (
        <Flex align="center" vertical style={{ height: "100%", width: "95%", backgroundColor: "grey" }}>
            <Flex align="start" vertical style={{ padding: "1vmax 0vmax 5vh" }}>
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
                                    {element.text}
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
                                    {element.text}
                                </text>
                            </svg>
                        </Col>
                    ))}
                </Row>
            </Flex>
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
                                                    ref={input1}
                                                    id={element.id}
                                                    style={{ textTransform: "uppercase" }}
                                                    onChange={() => check()}
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
                                                    ref={input1}
                                                    id={element.id}
                                                    style={{ textTransform: "uppercase" }}
                                                    onChange={() => check()}
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
                                                ref={input1}
                                                onChange={() => check()}
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
                                                ref={input1}
                                                onChange={() => check()}
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
                                                ref={input1}
                                                onChange={() => check()}
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

export default ExampleDnD3;