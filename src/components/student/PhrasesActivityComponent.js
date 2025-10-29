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

const exercises = [{
    activity: "1", content: [{
        id: 1,
        phrase: ["El perro", "es", "un animal"],
        audio: "/sounds/dog-animal.mp3",
        wordAudio: ["/sounds/dog.mp3", "/sounds/is.mp3", "/sounds/animal.mp3"],
        image: [`${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`, `/pictograms/is.png`, `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6901`]
    }, {
        id: 2,
        phrase: ["El perro", "es parte de", "la familia"],
        audio: "/sounds/dog-family.mp3",
        wordAudio: ["/sounds/dog.mp3", "/sounds/isPartOf.mp3", "/sounds/family.mp3"],
        image: [`${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`, `/pictograms/isPartOf.png`, `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2392`]
    }, {
        id: 3,
        phrase: ["La ballena", "es", "un mamífero"],
        audio: "/sounds/whale-mammal.mp3",
        wordAudio: ["/sounds/whale.mp3", "/sounds/is.mp3", "/sounds/mammal.mp3"],
        image: [`${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`, `/pictograms/is.png`, `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7777`]
    }, {
        id: 4,
        phrase: ["La casa", "es para", "vivir"],
        audio: "/sounds/house-living.mp3",
        wordAudio: ["/sounds/house.mp3", "/sounds/isFor.mp3", "/sounds/living.mp3"],
        image: [`${process.env.REACT_APP_ARASAAC_URL}/pictograms/2317`, `/pictograms/isFor.png`, `${process.env.REACT_APP_ARASAAC_URL}/pictograms/11605`]
    },],
}, {
    activity: "2", content: [{
        id: 1,
        phrase: ["El perro", "tiene", "cola"],
        audio: "/sounds/dog-tail.mp3",
        wordAudio: ["/sounds/dog.mp3", "/sounds/has.mp3", "/sounds/tail.mp3"],
        image: [`${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`, `/pictograms/has.png`, `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5967`]
    }, {
        id: 2,
        phrase: ["La ballena", "está en", "el mar"],
        audio: "/sounds/whale-sea.mp3",
        wordAudio: ["/sounds/whale.mp3", "/sounds/isIn.mp3", "/sounds/sea.mp3"],
        image: [`${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`, `/pictograms/isIn.png`, `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`]
    }, {
        id: 3,
        phrase: ["La sartén", "sirve para", "cocinar"],
        audio: "/sounds/pan-cook.mp3",
        wordAudio: ["/sounds/pan.mp3", "/sounds/isUsedFor.mp3", "/sounds/cook.mp3"],
        image: [`${process.env.REACT_APP_ARASAAC_URL}/pictograms/2558`, `/pictograms/isUsedFor.png`, `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2342`]
    },],
},];

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
    const {activity} = useParams();
    const navigate = useNavigate();

    const [exerciseIndex, setExerciseIndex] = useState(0);
    const [slots, setSlots] = useState([]);
    const [pool, setPool] = useState([]);

    const audioRef = useRef(null);
    const audioHelpRef = useRef(new Audio("/sounds/phraseActivityHelp.mp3"));
    const maxUnlockedRef = useRef(maxUnlocked);

    useEffect(() => {
        maxUnlockedRef.current = maxUnlocked;
    }, [maxUnlocked]);

    useEffect(() => {
        fetchUnlockedPhase();
    }, []);

    useEffect(() => {
        const ex = exercises.find((e) => e.activity === activity).content[exerciseIndex];
        if (!ex) return;

        if (ex.audio) {
            audioRef.current = new Audio(ex.audio);
            audioRef.current.play().catch(() => {
                console.log("Audio blocked by browser autoplay policy");
            });
        }
    }, [activity, exerciseIndex]);

    function play(audio) {
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {
            });
        }
    }

    useEffect(() => {
        const ex = exercises.find((e) => e.activity === activity).content[exerciseIndex];
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
    }, [activity, exerciseIndex]);

    function handleDrop(index, item) {
        const ex = exercises.find((e) => e.activity === activity).content[exerciseIndex];
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
        const ex = exercises.find((e) => e.activity === activity).content[exerciseIndex];
        if (!ex) return;
        const completed = slots.length > 0 && slots.every((s, i) => s === ex.phrase[i]);
        if (completed) {
            setTimeout(() => {
                if (exerciseIndex < exercises.find((e) => e.activity === activity).content.length - 1) {
                    setExerciseIndex((i) => i + 1);
                } else {
                    console.log("activity ", activity);
                    console.log("maxUnlockedRef.current ", maxUnlockedRef.current);
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

    const currentExercise = exercises.find((e) => e.activity === activity).content[exerciseIndex];
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