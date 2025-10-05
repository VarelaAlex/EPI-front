import {Card, Col, Image, Row, Typography} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {DndProvider, useDrag, useDragLayer, useDrop} from "react-dnd";
import {getEmptyImage, HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";
import {MultiBackend, TouchTransition} from "dnd-multi-backend";
import {useNavigate, useParams} from "react-router-dom";
import "../assets/styles/PictogramActivity.css";
import '../assets/styles/font.css'

function CustomDragLayer() {
    const {item, isDragging, currentOffset} = useDragLayer((monitor) => ({
        item: monitor.getItem(), isDragging: monitor.isDragging(), currentOffset: monitor.getSourceClientOffset(),
    }))

    if (!isDragging || !currentOffset) return null

    return (<div
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 100,
            transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
            touchAction: "none"
        }}
    >
        <Card
            hoverable
            style={{
                width: 140, height: 140, textAlign: "center", opacity: 0.8,
            }}
        >
            <Image alt={item.id} src={`/pictograms/${item.id}.png`} preview={ false }/>
            <div style={{fontWeight: "700", fontFamily: "Massallera"}}>{item.label}</div>
        </Card>
    </div>)
}

const HTML5toTouch = {
    backends: [
        { id: "html5", backend: HTML5Backend },
        {
            id: "touch",
            backend: TouchBackend,
            options: {
                enableMouseEvents: true,
                enableTouchEvents: true,
                ignoreContextMenu: true,
                delayTouchStart: 0,
                delayMouseStart: 0,
            },
            preview: true,
            transition: TouchTransition,
            skipDispatchOnTransition: true
        },
    ],
};

let {Title} = Typography;

let pictograms = [{
    activity: "1", content: [
        {id: "is", label: "es", audio: "/sounds/is.mp3"},
        {id: "isFor", label: "es para", audio: "/sounds/isFor.mp3"},
        {id: "isPartOf", label: "es parte de", audio: "/sounds/isPartOf.mp3"}
    ]
}, {
    activity: "2", content: [
        {id: "has", label: "tiene", audio: "/sounds/has.mp3"},
        {id: "isUsedFor", label: "sirve para", audio: "/sounds/isUsedFor.mp3"},
        {id: "isIn", label: "está en", audio: "/sounds/isIn.mp3"}
    ]
}];

let DraggablePictogram = ({pictogram, isBlinking, isEscaping, onPlay, forwardRef}) => {
    let [{isDragging}, drag, preview] = useDrag(() => ({
        type: "PICTO", item: {...pictogram}, // send full pictogram
        collect: (monitor) => ({isDragging: !!monitor.isDragging()}),
    }));

    // hide default preview
    useEffect(() => {
        preview(getEmptyImage(), {captureDraggingState: true});
    }, [preview]);

    let setRef = (node) => {
        drag(node);
        if (!forwardRef) return;
        if (typeof forwardRef === "function") {
            forwardRef(node);
        } else {
            forwardRef.current = node;
        }
    };

    return (<div
        ref={setRef}
        className={`pictogram-card ${isBlinking ? "blink" : ""} ${isEscaping ? "escape" : ""}`}
        style={{opacity: isDragging ? 0 : 1}}
        onClick={() => onPlay(pictogram.id)}
    >
        <Card hoverable style={{width: 140, height: 140, textAlign: "center"}}>
            <Image alt={pictogram.id} src={`/pictograms/${pictogram.id}.png`} preview={ false }/>
            <div style={{fontWeight: "700", fontFamily: "Massallera"}}>{pictogram.label}</div>
        </Card>
    </div>);
};

let DropZone = ({blinking, onDrop, forwardRef}) => {
    let [, drop] = useDrop(() => ({
        accept: "PICTO", drop: (item) => onDrop(item.id)
    }));

    let setRef = (node) => {
        drop(node);
        if (!forwardRef) {
            return;
        }
        if (typeof forwardRef === "function") {
            forwardRef(node);
        } else {
            forwardRef.current = node;
        }
    };

    return (<div ref={setRef} className={`dropzone ${blinking ? "blink" : ""}`}>
        <Image src="/icons/drag.png" alt="dragzone" height="5em"/>
    </div>);
};

let PictogramActivity = () => {
    let [help, setHelp] = useState(false);
    let [escapingId, setEscapingId] = useState(null);

    let [targetId, setTargetId] = useState("es");
    let targetRef = useRef(targetId);

    useEffect(() => {
        targetRef.current = targetId;
    }, [targetId]);

    let pictogramRefs = useRef({});
    let dropRef = useRef(null);
    let handRef = useRef(null);
    let attemptsRef = useRef(0);
    let successStreakRef = useRef(0);

    let audiosRef = useRef({});
    let correctAudioRef = useRef(null);
    let errorAudioRef = useRef(null);
    let repeatTimerRef = useRef(null);

    let {activity} = useParams();

    let navigate = useNavigate();

    useEffect(() => {
        successStreakRef.current = 0;
        attemptsRef.current = 0;
        setHelp(false);
        setEscapingId(null);

        let newTarget = pictograms.find(p => p.activity === activity)?.content[0]?.id;
        setTargetId(newTarget || "");

        audiosRef.current = {};
        pictograms.find(p => p.activity === activity)?.content.forEach((p) => {
            audiosRef.current[p.id] = new Audio(p.audio);
        });

        correctAudioRef.current = new Audio("/sounds/correct.mp3");
        errorAudioRef.current = new Audio("/sounds/error.mp3");

        return () => {
            if (repeatTimerRef.current) {
                clearInterval(repeatTimerRef.current);
            }
        };
    }, [activity]);


    useEffect(() => {
        let playTargetAudio = () => {
            audiosRef.current[targetId]?.play().catch(() => {
            });
        };
        if (!help) {
            playTargetAudio();
        }

        if (repeatTimerRef.current) {
            clearInterval(repeatTimerRef.current);
        }
        repeatTimerRef.current = setInterval(() => {
            if (!help) {
                playTargetAudio();
            }
        }, 6000);

        return () => {
            if (repeatTimerRef.current) {
                clearInterval(repeatTimerRef.current);
            }
        };
    }, [targetId, help]);

    let playPictogramAudio = (id) => {
        audiosRef.current[id]?.play().catch(() => {
        });
    };

    let handleDrop = (draggedId) => {
        if (draggedId === targetRef.current) {
            correctAudioRef.current?.play().catch(() => {
            });
            attemptsRef.current = 0;
            setHelp(false);
            setEscapingId(null);

            successStreakRef.current++;
            if (successStreakRef.current >= 5) {
                if (activity === "1") {
                    navigate("/students/pretraining/block/1/activity/2");
                    return;
                } else {
                    navigate("/students/pretraining/block/2/activity/1");
                }
            }

            let nextIds = pictograms.find(p => p.activity === activity)
                ?.content.map((p) => p.id)
                .filter((id) => id !== targetRef.current);
            setTargetId(nextIds[Math.floor(Math.random() * nextIds.length)]);
        } else {
            errorAudioRef.current?.play().catch(() => {
            });
            setEscapingId(draggedId);
            setTimeout(() => setEscapingId(null), 700);

            successStreakRef.current = 0;

            attemptsRef.current = attemptsRef.current + 1;
            if (attemptsRef.current >= 5) {
                setHelp(true);
                setTimeout(() => animateHandGuide(), 50);
            }
        }
    };

    let animateHandGuide = () => {
        let handEl = handRef.current;
        let pictEl = pictogramRefs.current[targetRef.current];
        let dropEl = dropRef.current;
        if (!handEl || !pictEl || !dropEl) {
            return;
        }

        let pictRect = pictEl.getBoundingClientRect();
        let dropRect = dropEl.getBoundingClientRect();
        let containerRect = handEl.parentElement.getBoundingClientRect();

        let startX = pictRect.left - containerRect.left + pictRect.width / 2;
        let startY = pictRect.top - containerRect.top + pictRect.height / 2;
        let endX = dropRect.left - containerRect.left + dropRect.width / 2;
        let endY = dropRect.top - containerRect.top + dropRect.height / 2;

        let dx = endX - startX;
        let dy = endY - startY;

        handEl.style.left = `${startX}px`;
        handEl.style.top = `${startY}px`;
        handEl.style.opacity = "1";
        handEl.style.transition = "none";
        handEl.style.transform = "translate(-50%, -50%)";

        let count = 0;
        let doMove = () => {
            handEl.style.transition = "transform 1.5s ease-in-out";
            handEl.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
            count++;
            if (count < 3) {
                setTimeout(() => {
                    handEl.style.transition = "none";
                    handEl.style.transform = "translate(-50%, -50%)";
                    setTimeout(doMove, 300);
                }, 1500);
            } else {
                setTimeout(() => {
                    handEl.style.transition = "opacity 1500ms";
                    handEl.style.opacity = "0";
                    setTimeout(() => setHelp(false), 300);
                }, 1500);
            }
        };
        setTimeout(doMove, 90);
    };

    return (<DndProvider backend={MultiBackend} options={HTML5toTouch} >
        <CustomDragLayer/>
        <div style={{padding: 20, position: "relative"}}>

            <Row justify="center" gutter={[16, 16]} style={{marginBottom: 24}}>
                {pictograms.find(p => p.activity === activity)
                    ?.content
                    .map((p) => (<Col key={p.id}>
                        <DraggablePictogram
                            pictogram={p}
                            isBlinking={p.id === targetId}
                            isEscaping={escapingId === p.id}
                            forwardRef={(el) => {
                                pictogramRefs.current[p.id] = el;
                            }}
                            onPlay={(id) => playPictogramAudio(id)}
                        />
                    </Col>))}
            </Row>

            <Row justify="center">
                <Col>
                    <DropZone blinking={true} forwardRef={dropRef} onDrop={handleDrop}/>
                </Col>
            </Row>

            {help && <span ref={handRef} className="hand-guide">🖐️</span>}
        </div>
    </DndProvider>);
};

export default PictogramActivity;