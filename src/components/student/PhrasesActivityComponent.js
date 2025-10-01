import {Button, Card, Col, Row, Typography} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {useNavigate, useParams} from "react-router-dom";
import {SoundOutlined} from '@ant-design/icons';
import '../assets/styles/font.css'

const {Title} = Typography;
const ItemTypes = {WORD: "word"};

const exercises = [{
    activity: "1", content: [{id: 1, phrase: ["El perro", "es", "un animal"], audio: "/sounds/dog-animal.mp3"}, {
        id: 2, phrase: ["El perro", "es parte de", "la familia"], audio: "/sounds/dog-family.mp3"
    }, {id: 3, phrase: ["La ballena", "es", "un mamífero"], audio: "/sounds/whale-mammal.mp3"}, {
        id: 4, phrase: ["La casa", "es para", "vivir"], audio: "/sounds/house-living.mp3"
    }]
}, {
    activity: "2", content: [{id: 1, phrase: ["El perro", "tiene", "cola"], audio: "/sounds/dog-tail.mp3"}, {
        id: 2, phrase: ["La ballena", "está en", "el mar"], audio: "/sounds/whale-sea.mp3"
    }, {id: 3, phrase: ["La sartén", "sirve para", "cocinar"], audio: "/sounds/pan-cook.mp3"}]
}];

function shuffledArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function DraggableCard({id, text, disabled}) {
    const [{isDragging}, drag] = useDrag(() => ({
        type: ItemTypes.WORD,
        item: {id, text},
        collect: (monitor) => ({isDragging: !!monitor.isDragging()}),
        canDrag: () => !disabled
    }), [id, text, disabled]);

    return (<div ref={drag} style={{opacity: isDragging ? 0.4 : 1}}>
        <Card
            hoverable
            style={{
                width: 150,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                cursor: disabled ? "not-allowed" : "grab",
                opacity: disabled ? 0.5 : 1,
                fontFamily: "Massallera"
            }}
        >
            {text}
        </Card>
    </div>);
}

function DropSlot({index, expectedText, value, enabled, onDrop}) {
    const [{isOver, canDrop}, drop] = useDrop(() => ({
        accept: ItemTypes.WORD,
        canDrop: (item) => enabled && item.text === expectedText,
        drop: (item) => onDrop(index, item),
        collect: (monitor) => ({isOver: monitor.isOver(), canDrop: monitor.canDrop()})
    }), [expectedText, enabled]);

    return (<div ref={drop} style={{margin: "0 8px"}}>
        <Card
            style={{
                width: 150,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderColor: value ? "green" : isOver && canDrop ? "blue" : "#d9d9d9",
                backgroundColor: value ? "#d4edda" : "#fafafa",
                fontWeight: 600
            }}
        >
            {value || "____"}
        </Card>
    </div>);
}

export default function PhrasesActivity() {

    const {activity} = useParams();
    const navigate = useNavigate();

    const [exerciseIndex, setExerciseIndex] = useState(0);
    const [slots, setSlots] = useState([]);
    const [pool, setPool] = useState([]);

    const audioRef = useRef(null);

    useEffect(() => {
        const ex = exercises.find(e => e.activity === activity).content[exerciseIndex];
        if (!ex) return;

        if (ex.audio) {
            audioRef.current = new Audio(ex.audio);
            audioRef.current.play().catch(() => {
                // fall back: user interaction required
                console.log("Audio blocked by browser autoplay policy");
            });
        }
    }, [activity, exerciseIndex]);

    function playAudio() {
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // restart
            audioRef.current.play().catch(() => {
            });
        }
    }

    useEffect(() => {
        const ex = exercises.find(e => e.activity === activity).content[exerciseIndex];
        if (!ex) {
            return;
        }

        setSlots(Array(ex.phrase.length).fill(null));

        const base = ex.phrase.map((text, i) => ({id: `${exerciseIndex}-${i}`, text, used: false}));
        const shuffled = shuffledArray(base);
        setPool(shuffled);

        if (ex.audio) {
            try {
                new Audio(ex.audio).play().catch(() => {
                });
            } catch (e) {
            }
        }
    }, [activity, exerciseIndex]);

    function handleDrop(index, item) {
        const ex = exercises.find(e => e.activity === activity).content[exerciseIndex];
        if (!ex) {
            return;
        }

        const expected = ex.phrase[index];
        if (item.text === expected) {
            setSlots(prev => {
                const next = [...prev];
                if (!next[index]) {
                    next[index] = item.text;
                }
                return next;
            });
            setPool(prev => prev.map(p => (p.id === item.id ? {...p, used: true} : p)));
        }
    }

    useEffect(() => {
        const ex = exercises.find(e => e.activity === activity).content[exerciseIndex];
        if (!ex) {
            return;
        }
        const completed = slots.length > 0 && slots.every((s, i) => s === ex.phrase[i]);
        if (completed) {
            setTimeout(() => {
                if (exerciseIndex < exercises.find(e => e.activity === activity).content.length - 1) {
                    setExerciseIndex(i => i + 1);
                } else {
                    if (activity === "1") {
                        navigate("/students/pretraining/block/2/activity/2");
                    }
                }
            }, 600);
        }
    }, [slots, exerciseIndex, activity]);

    const currentExercise = exercises.find(e => e.activity === activity).content[exerciseIndex];
    if (!currentExercise) {
        return <div>No hay ejercicios</div>;
    }

    const visiblePool = pool.filter(p => !p.used);

    return (<DndProvider backend={HTML5Backend}>
        <Button icon={<SoundOutlined/>} onClick={playAudio}></Button>
        <div style={{padding: 20}}>

            <Row gutter={[16, 16]} justify="center" style={{marginBottom: 40}}>
                {visiblePool.map(({id, text}, idx) => (<Col key={id}>
                    <DraggableCard id={id} text={text}/>
                </Col>))}
            </Row>

            <Row justify="center">
                {currentExercise.phrase.map((expected, i) => (<DropSlot
                    key={i}
                    index={i}
                    expectedText={expected}
                    value={slots[i]}
                    enabled={i === 0 ? true : !!slots[i - 1]}
                    onDrop={handleDrop}
                />))}
            </Row>
        </div>
    </DndProvider>);
}