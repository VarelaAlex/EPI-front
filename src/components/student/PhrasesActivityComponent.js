import {Col, Row, Card} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {DndProvider} from "react-dnd";
import {MultiBackend} from "react-dnd-multi-backend";
import {useNavigate, useParams} from "react-router-dom";
import "../assets/styles/font.css";
import {useTranslation} from "react-i18next";
import CustomDragLayer from "./dnd/CustomDragLayerComponent";
import DraggableCard from "./dnd/DraggableCardComponent";
import DropSlot from "./dnd/DropSlotComponent";
import {HTML5toTouch} from "rdndmb-html5-to-touch";
import ActivityToolsComponent from "./dnd/ActivityToolsComponent";
import {usePretraining} from "../../hooks/usePretraining";
import {useAvatar} from "../AvatarContext";
import {NEUTRAL, NEUTRAL_SPEAKING} from "../Avatar";

const exercises = [
    {
        activity: "1",
        content: [
            {
                id: 1,
                phrase: ["El perro", "es", "un animal"],
                audio: "/sounds/dog-animal.mp3",
                wordAudio: ["/sounds/dog.mp3", "/sounds/is.mp3", "/sounds/animal.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6901`
                ]
            },
            {
                id: 2,
                phrase: ["La ballena", "es", "un mamífero"],
                audio: "/sounds/whale-mammal.mp3",
                wordAudio: ["/sounds/whale.mp3", "/sounds/is.mp3", "/sounds/mammal.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7777`
                ]
            },
            {
                id: 3,
                phrase: ["La casa", "es para", "vivir"],
                audio: "/sounds/casa-def.mp3",
                wordAudio: ["/sounds/house.mp3", "/sounds/isFor.mp3", "/sounds/live.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6964`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/11605`
                ]
            },
            {
                id: 4,
                phrase: ["El sol", "es", "una estrella"],
                audio: "/sounds/sol-def.mp3",
                wordAudio: ["/sounds/sun.mp3", "/sounds/is.mp3", "/sounds/star.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7252`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2752`
                ]
            },
            {
                id: 5,
                phrase: ["El verano", "es parte de", "el año"],
                audio: "/sounds/verano-def.mp3",
                wordAudio: ["/sounds/summer.mp3", "/sounds/isPartOf.mp3", "/sounds/year.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5604`,
                    "/pictograms/isPartOf.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6903`
                ]
            },
            {
                id: 6,
                phrase: ["La manzana", "es", "una fruta"],
                audio: "/sounds/manzana-def.mp3",
                wordAudio: ["/sounds/apple.mp3", "/sounds/is.mp3", "/sounds/fruit.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2462`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/28339`
                ]
            },
            {
                id: 7,
                phrase: ["La cama", "es para", "dormir"],
                audio: "/sounds/cama-def.mp3",
                wordAudio: ["/sounds/bed.mp3", "/sounds/isFor.mp3", "/sounds/sleep.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25900`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6479`
                ]
            },
            {
                id: 8,
                phrase: ["La calle", "es parte de", "la ciudad"],
                audio: "/sounds/calle-def.mp3",
                wordAudio: ["/sounds/street.mp3", "/sounds/isPartOf.mp3", "/sounds/city.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2299`,
                    "/pictograms/isPartOf.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2704`
                ]
            },
            {
                id: 9,
                phrase: ["El coche", "es para", "viajar"],
                audio: "/sounds/coche-def.mp3",
                wordAudio: ["/sounds/car.mp3", "/sounds/isFor.mp3", "/sounds/travel.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2339`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/36974`
                ]
            },
            {
                id: 10,
                phrase: ["El columpio", "es para", "jugar"],
                audio: "/sounds/columpio-def.mp3",
                wordAudio: ["/sounds/swing.mp3", "/sounds/isFor.mp3", "/sounds/play.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4608`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6537`
                ]
            },
            {
                id: 11,
                phrase: ["El agua", "es para", "beber"],
                audio: "/sounds/agua-def.mp3",
                wordAudio: ["/sounds/water.mp3", "/sounds/isFor.mp3", "/sounds/drink.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2248`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6061`
                ]
            },
            {
                id: 12,
                phrase: ["El mar", "es para", "bañarse"],
                audio: "/sounds/mar-def.mp3",
                wordAudio: ["/sounds/sea.mp3", "/sounds/isFor.mp3", "/sounds/bathe.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/38782`
                ]
            }
        ]
    },

    {
        activity: "2",
        content: [
            {
                id: 1,
                phrase: ["El perro", "tiene", "cola"],
                audio: "/sounds/dog-tail.mp3",
                wordAudio: ["/sounds/dog.mp3", "/sounds/has.mp3", "/sounds/tail.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`,
                    "/pictograms/has.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5967`
                ]
            },
            {
                id: 2,
                phrase: ["La ballena", "está en", "el mar"],
                audio: "/sounds/whale-sea.mp3",
                wordAudio: ["/sounds/whale.mp3", "/sounds/isIn.mp3", "/sounds/sea.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`
                ]
            },
            {
                id: 3,
                phrase: ["La casa", "sirve para", "vivir"],
                audio: "/sounds/casa-amp.mp3",
                wordAudio: ["/sounds/house.mp3", "/sounds/isUsedFor.mp3", "/sounds/live.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6964`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/11605`
                ]
            },
            {
                id: 4,
                phrase: ["El sol", "está en", "el cielo"],
                audio: "/sounds/sol-amp.mp3",
                wordAudio: ["/sounds/sun.mp3", "/sounds/isIn.mp3", "/sounds/sunbathe.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7252`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6978`
                ]
            },
            {
                id: 5,
                phrase: ["El verano", "sirve para", "tomar el sol"],
                audio: "/sounds/verano-amp.mp3",
                wordAudio: [
                    "/sounds/summer.mp3",
                    "/sounds/isUsedFor.mp3",
                    "/sounds/sunbathe.mp3"
                ],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5604`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26500`
                ]
            },
            {
                id: 6,
                phrase: ["La manzana", "está en", "el frutero"],
                audio: "/sounds/manzana-amp.mp3",
                wordAudio: ["/sounds/apple.mp3", "/sounds/isIn.mp3", "/sounds/frutero.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2462`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/16303`
                ]
            },
            {
                id: 7,
                phrase: ["La cama", "está en", "la habitación"],
                audio: "/sounds/cama-amp.mp3",
                wordAudio: ["/sounds/bed.mp3", "/sounds/isIn.mp3", "/sounds/room.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25900`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/33068`
                ]
            },
            {
                id: 8,
                phrase: ["La calle", "está en", "la ciudad"],
                audio: "/sounds/calle-amp.mp3",
                wordAudio: ["/sounds/street.mp3", "/sounds/isIn.mp3", "/sounds/city.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2299`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2704`
                ]
            },
            {
                id: 9,
                phrase: ["El coche", "tiene", "ruedas"],
                audio: "/sounds/coche-amp.mp3",
                wordAudio: ["/sounds/car.mp3", "/sounds/has.mp3", "/sounds/wheels.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2339`,
                    "/pictograms/has.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6209`
                ]
            },
            {
                id: 10,
                phrase: ["El columpio", "está en", "el parque"],
                audio: "/sounds/columpio-amp.mp3",
                wordAudio: ["/sounds/swing.mp3", "/sounds/isIn.mp3", "/sounds/park.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4608`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2859`
                ]
            },
            {
                id: 11,
                phrase: ["El agua", "sirve para", "lavarse"],
                audio: "/sounds/agua-amp.mp3",
                wordAudio: [
                    "/sounds/water.mp3",
                    "/sounds/isUsedFor.mp3",
                    "/sounds/wash.mp3"
                ],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2248`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26803`
                ]
            },
            {
                id: 12,
                phrase: ["El mar", "está en", "la playa"],
                audio: "/sounds/mar-amp.mp3",
                wordAudio: ["/sounds/sea.mp3", "/sounds/isIn.mp3", "/sounds/beach.mp3"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/30518`
                ]
            }
        ]
    }
];

function shuffledArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function PhrasesActivity() {

    const { maxUnlocked, updateUnlockedPhase, fetchUnlockedPhase } = usePretraining();
    let {t} = useTranslation();
    let {activity} = useParams();
    const navigate = useNavigate();

    const [exerciseIndex, setExerciseIndex] = useState(0);
    const [slots, setSlots] = useState([]);
    const [pool, setPool] = useState([]);
    const [shuffledExercises, setShuffledExercises] = useState(shuffledArray(exercises.find(e => e.activity === activity).content));
    const [completedCount, setCompletedCount] = useState(0);
    let [started, setStarted] = useState(false);

    const audioRef = useRef(null);
    const audioHelpRef = useRef(new Audio("/sounds/phraseActivityHelp.mp3"));
    const maxUnlockedRef = useRef(maxUnlocked);
    const timeoutRef = useRef(null);

    let { changeEmotionSequence } =  useAvatar();
    const playIntro = () => {
        if(activity === "1") {
            changeEmotionSequence([
                {
                    emotionDuring: NEUTRAL_SPEAKING,
                    emotionAfter: NEUTRAL,
                    text: "Ahora vamos a ordenar los elementos para formar la frase, ¡fíjate bien en los pictogramas!",
                    audio: "/sounds/intro-activity3.mp3",
                    onEnd: () => setStarted(true),
                    afterDelay: 500
                }
            ]);
        } else {
            changeEmotionSequence([
                {
                    emotionDuring: NEUTRAL_SPEAKING,
                    emotionAfter: NEUTRAL,
                    text: "Recuerda que en esta actividad tienes que ordenar los elementos para formar la frase.",
                    audio: "/sounds/intro-activity4.mp3",
                    onEnd: () => setStarted(true),
                    afterDelay: 500
                }
            ]);
        }
    };

    useEffect(() => {
        playIntro();

        // Cada 5 segundos sin interacción, repetir la secuencia
        const resetTimeout = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                playIntro();
            }, 5000);
        };

        resetTimeout(); // inicio del timeout

        // Escuchar interacción del usuario
        const events = ["click", "keydown", "touchstart", "mousemove"];
        events.forEach(e => window.addEventListener(e, resetTimeout));

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            events.forEach(e => window.removeEventListener(e, resetTimeout));
        };
    }, []);

    useEffect(() => {
        setCompletedCount(0);
    }, [activity]);

    useEffect(() => {
        maxUnlockedRef.current = maxUnlocked;
    }, [maxUnlocked]);

    useEffect(() => {
        fetchUnlockedPhase();
    }, []);

    useEffect(() => {
        if(started){
            const ex = shuffledExercises[exerciseIndex];
            if (!ex) return;

            if (ex.audio) {
                audioRef.current = new Audio(ex.audio);
                audioRef.current.play().catch(() => {
                    console.log("Audio blocked by browser autoplay policy");
                });
            }
        }
    }, [activity, exerciseIndex, started]);

    function play(audio) {
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {
            });
        }
    }

    useEffect(() => {
        if(started) {
            const ex = shuffledExercises[exerciseIndex];
            if (!ex) return;

            setSlots(Array(ex.phrase.length).fill(null));

            const base = ex.phrase.map((text, i) => ({
                id: `${exerciseIndex}-${i}`,
                text,
                used: false,
                audio: ex.wordAudio ? ex.wordAudio[i] : null,
                image: ex.image ? ex.image[i] : null,
            }));

            setPool(shuffledArray(base));
        }
    }, [activity, exerciseIndex, started]);

    function handleDrop(index, item) {
        const ex = shuffledExercises[exerciseIndex];
        if (!ex) return;

        const expected = ex.phrase[index];
        if (item.text === expected) {
            setSlots((prev) => {
                const next = [...prev];
                if (!next[index]) next[index] = item.text;
                return next;
            });
            setPool((prev) => prev.map((p) => (p.id === item.id ? {...p, used: true} : p)));
        }
    }

    useEffect(() => {
        const ex = shuffledExercises[exerciseIndex];
        if (!ex) return;
        const completed = slots.length > 0 && slots.every((s, i) => s === ex.phrase[i]);
        if (completed) {
            setTimeout(() => {
                setCompletedCount(prev => prev + 1);
                if (completedCount + 1 < 5) {
                    setExerciseIndex((i) => i + 1);
                } else {
                    if (parseInt(activity) + 2 >= maxUnlockedRef.current) {
                        updateUnlockedPhase(maxUnlockedRef.current + 1)
                            .then(() => console.log("Fase desbloqueada actualizada"))
                            .catch((err) => console.error(err));
                    }
                    if (activity === "1") {
                        navigate("/students/pretraining/block/2/activity/2");
                    } else {
                        navigate("/students/pretraining/block/3/activity/1");
                    }
                }
            }, 600);
        }
    }, [slots, exerciseIndex, activity]);

    const currentExercise = shuffledExercises[exerciseIndex];
    if (!currentExercise) return <div>No hay ejercicios</div>;

    const visiblePool = pool.filter((p) => !p.used);

    return (<DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <CustomDragLayer/>
        <Card style={{padding: "2vh", width: "80%"}}>
            <ActivityToolsComponent playAudio={()=> play(audioRef.current)} content={t("Escucha y ordena la frase")} playHelp={()=> play(audioHelpRef.current)} />
            <Row gutter={[16, 16]} justify="center" style={{marginBottom: 40}}>
                {visiblePool.map(({id, text, audio, image}) => (<Col key={id}>
                    <DraggableCard id={id} text={text} audio={audio} image={image}/>
                </Col>))}
            </Row>

            <Row justify="center">
                {currentExercise.phrase.map((expected, i) => (<DropSlot
                    key={i}
                    index={i}
                    expectedText={expected}
                    value={slots[i]}
                    image={currentExercise.image ? currentExercise.image[i] : null}
                    enabled={i === 0 ? true : !!slots[i - 1]}
                    onDrop={handleDrop}
                />))}

            </Row>
        </Card>
    </DndProvider>);
}