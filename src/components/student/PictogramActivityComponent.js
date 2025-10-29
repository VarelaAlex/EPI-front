import {Card, Col, Row} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {DndProvider} from "react-dnd";
import {MultiBackend} from "dnd-multi-backend";
import {useNavigate, useParams} from "react-router-dom";
import CustomDragLayer from "./dnd/CustomDragLayerComponent";
import "../assets/styles/PictogramActivity.css";
import '../assets/styles/font.css'
import {HTML5toTouch} from "rdndmb-html5-to-touch";
import DraggablePictogram from "./dnd/DraggablePictogramComponent";
import DropZone from "./dnd/DropZoneComponent";
import ActivityToolsComponent from "./dnd/ActivityToolsComponent";
import {useTranslation} from "react-i18next";
import { usePretraining } from "../../hooks/usePretraining";

let pictograms = [{
    activity: "1",
    content: [{id: "is", label: "es", audio: "/sounds/is.mp3"}, {
        id: "isFor",
        label: "es para",
        audio: "/sounds/isFor.mp3"
    }, {id: "isPartOf", label: "es parte de", audio: "/sounds/isPartOf.mp3"}]
}, {
    activity: "2",
    content: [{id: "has", label: "tiene", audio: "/sounds/has.mp3"}, {
        id: "isUsedFor",
        label: "sirve para",
        audio: "/sounds/isUsedFor.mp3"
    }, {id: "isIn", label: "está en", audio: "/sounds/isIn.mp3"}]
}];

let PictogramActivity = () => {

    const { maxUnlocked, updateUnlockedPhase, fetchUnlockedPhase } = usePretraining();

    let {t} = useTranslation();
    let [help, setHelp] = useState(false);
    let [escapingId, setEscapingId] = useState(null);

    let [droppedPictogram, setDroppedPictogram] = useState(null);
    let [hiddenId, setHiddenId] = useState(null);

    let [targetId, setTargetId] = useState("es");
    let targetRef = useRef(targetId);
    const maxUnlockedRef = useRef(maxUnlocked);

    useEffect(() => {
        maxUnlockedRef.current = maxUnlocked;
    }, [maxUnlocked]);


    useEffect(() => {
        fetchUnlockedPhase();
    }, []);

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
    let audioHelpRef = useRef(new Audio("/sounds/pictogramActivityHelp.mp3"));
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
            playTargetAudio();

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



    let handleDrop = (draggedId) => {
        const currentTarget = targetRef.current;
        const draggedPictogram = pictograms
            .find(p => p.activity === activity)
            ?.content.find(p => p.id === draggedId);

        if (draggedId === currentTarget) {
            correctAudioRef.current?.play().catch(() => {
            });
            attemptsRef.current = 0;
            setHelp(false);
            setEscapingId(null);

            setHiddenId(draggedId);
            setDroppedPictogram(draggedPictogram);

            successStreakRef.current++;

            setTimeout(() => {
                setDroppedPictogram(null);
                setHiddenId(null);

                if (successStreakRef.current >= 5) {
                    console.log(maxUnlocked)
                    // Incrementamos pretrainingPhase solo si la fase actual es igual a la máxima desbloqueada
                    if (parseInt(activity) >= maxUnlockedRef.current) {
                        updateUnlockedPhase(maxUnlockedRef.current + 1)
                            .then(() => console.log("Fase desbloqueada actualizada"))
                            .catch((err) => console.error(err));
                    }

                    if (activity === "1") {
                        navigate("/students/pretraining/block/1/activity/2");
                        return;
                    } else {
                        navigate("/students/pretraining/block/2/activity/1");
                        return;
                    }
                }

                let nextIds = pictograms.find(p => p.activity === activity)
                    ?.content.map(p => p.id)
                    .filter(id => id !== currentTarget);
                setTargetId(nextIds[Math.floor(Math.random() * nextIds.length)]);
            }, 1000);

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

    function play(audio) {
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {
            });
        }
    }

    return (<DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <CustomDragLayer/>
        <Card style={{padding: "2vh", width: "80%"}}>
            <ActivityToolsComponent content={t("Escucha y coloca el elemento correcto en el cuadrado inferior")}
                                    playHelp={()=>play(audioHelpRef.current)}/>
            <Row justify="center" gutter={[16, 16]} style={{marginBottom: 24}}>
                {pictograms.find(p => p.activity === activity)?.content.map((p) => (<Col key={p.id}>
                        <DraggablePictogram
                            pictogram={p}
                            isBlinking={p.id === targetId}
                            isEscaping={escapingId === p.id}
                            forwardRef={(el) => {
                                pictogramRefs.current[p.id] = el;
                            }}
                            hidden={p.id === hiddenId}
                        />
                    </Col>))}
            </Row>

            <Row justify="center">
                <Col>
                    <DropZone
                        blinking={true}
                        forwardRef={dropRef}
                        onDrop={handleDrop}
                        droppedPictogram={droppedPictogram}
                    />
                </Col>
            </Row>

            {help && <span ref={handRef} className="hand-guide">🖐️</span>}
        </Card>
    </DndProvider>);
};

export default PictogramActivity;