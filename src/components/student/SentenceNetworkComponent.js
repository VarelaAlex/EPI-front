import React, {useEffect, useRef, useState} from 'react';
import {Card, Button, Image as AntdImage} from 'antd';
import {SoundOutlined} from '@ant-design/icons';
import {DndProvider, useDrop} from 'react-dnd';
import {MultiBackend} from 'dnd-multi-backend';
import {HTML5toTouch} from 'rdndmb-html5-to-touch';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import ActivityToolsComponent from "./dnd/ActivityToolsComponent";
import {useSentenceAudio} from "../../hooks/useSentenceAudio";
import {CustomDragPreview} from "./dnd/CustomDragPreview";
import {DraggableWord} from "./dnd/DraggableWord";
import {StaticWord} from "./dnd/StaticWord";
import {usePretraining} from "../../hooks/usePretraining";
import {STOP} from "./NetworkProps";
import '../assets/styles/font.css';

const ItemTypes = { WORD: 'word' };

const DropZone = ({zone, placedWord, targetWord, onDrop, leftPlaced, onDropSuccess, onDropError, play}) => {
    const {maxUnlocked, updateUnlockedPhase, fetchUnlockedPhase} = usePretraining();
    const maxUnlockedRef = useRef(maxUnlocked);

    useEffect(() => {
        maxUnlockedRef.current = maxUnlocked;
    }, [maxUnlocked]);

    useEffect(() => {
        fetchUnlockedPhase();
    }, []);

    const [{isOver, canDrop}, drop] = useDrop({
        accept: ItemTypes.WORD,
        drop: (item) => {
            const isCorrect = (item.word === targetWord && zone === 'left') ||
                (item.word === targetWord && zone === 'right' && leftPlaced);

            if (isCorrect) {
                onDrop(zone, {text: item.word, image: item.image});
                onDropSuccess();

                if (zone === 'right' && leftPlaced) {
                    if (5 >= maxUnlockedRef.current) {
                        updateUnlockedPhase(maxUnlockedRef.current + 1)
                            .then(() => console.log("Fase desbloqueada actualizada"))
                            .catch((err) => console.error(err));
                    }
                }
            } else {
                onDropError();
            }
        },
        canDrop: (item) => {
            if (zone === 'right' && !leftPlaced) return false;
            return ((item.word === targetWord && zone === 'left') ||
                (item.word === targetWord && zone === 'right'));
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        }),
        hover: (item, monitor) => {
            if (!monitor.canDrop()) {
                onDropError();
            }
        },
    });

    const backgroundColor = isOver && canDrop ? '#bae7ff' : '#e6f7ff';

    return (
        <div
            ref={drop}
            onClick={play}
            style={{
                width: 100,
                height: 80,
                border: '2px dashed #91d5ff',
                borderRadius: 8,
                background: backgroundColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: placedWord ? 'default' : 'pointer'
            }}
        >
            {placedWord && (
                <div style={{textAlign: 'center'}}>
                    <AntdImage
                        src={placedWord.image}
                        alt={placedWord.text}
                        style={{width: 40, height: 40, objectFit: 'contain'}}
                        preview={false}
                    />
                    <div style={{fontFamily: 'Massallera', fontSize: 14}}>
                        {placedWord.text}
                    </div>
                </div>
            )}
        </div>
    );
};

const SentenceNetwork = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const sentences = [
        {
            id: 1,
            phrase: [
                {text: "El perro", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`, audio: new Audio("/sounds/dog.mp3")},
                {text: "es", image: "/pictograms/is.png", audio: new Audio("/sounds/is.mp3"), draggable: true},
                {text: "un animal", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6901`, audio: new Audio("/sounds/animal.mp3")},
                {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: new Audio("/sounds/stop.mp3")}
            ],
            audio: new Audio("/sounds/dog-animal.mp3")
        },
        {
            id: 2,
            phrase: [
                {text: "El perro", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`, audio: new Audio("/sounds/dog.mp3")},
                {text: "tiene", image: "/pictograms/has.png", audio: new Audio("/sounds/has.mp3"), draggable: true},
                {text: "cola", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5967`, audio: new Audio("/sounds/tail.mp3")},
                {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: new Audio("/sounds/stop.mp3")}
            ],
            audio: new Audio("/sounds/dog-tail.mp3")
        },
        {
            id: 3,
            phrase: [
                {text: "La ballena", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`, audio: new Audio("/sounds/whale.mp3")},
                {text: "es", image: "/pictograms/is.png", audio: new Audio("/sounds/is.mp3"), draggable: true},
                {text: "un mamífero", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7777`, audio: new Audio("/sounds/mammal.mp3")},
                {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: new Audio("/sounds/stop.mp3")}
            ],
            audio: new Audio("/sounds/whale-mammal.mp3")
        },
        {
            id: 4,
            phrase: [
                {text: "La ballena", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`, audio: new Audio("/sounds/whale.mp3")},
                {text: "está en", image: "/pictograms/isIn.png", audio: new Audio("/sounds/isIn.mp3"), draggable: true},
                {text: "el mar", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`, audio: new Audio("/sounds/sea.mp3")},
                {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: new Audio("/sounds/stop.mp3")}
            ],
            audio: new Audio("/sounds/whale-sea.mp3")
        }
    ];

    const {play, handleDropSuccess, handleDropError} = useSentenceAudio();

    const [placedLinks, setPlacedLinks] = useState({left: null, right: null});
    const [showNetwork, setShowNetwork] = useState(false);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);

    const audioHelpRef = useRef(new Audio("/sounds/sentenceActivity1Help.mp3"));

    const handleNextPair = () => {
        if(currentPairIndex >= sentences.length - 2) {
            setTimeout(() => navigate("/students/pretraining/block/3/activity/2"), 2000);
        } else {
            setPlacedLinks({left: null, right: null});
            setShowNetwork(false);
            setCurrentPairIndex(prev => prev + 2);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowNetwork(true), 2000);
        return () => clearTimeout(timer);
    }, [currentPairIndex]);

    const handleDrop = (zone, word) => {
        setPlacedLinks(prev => {
            const newLinks = {...prev, [zone]: word};
            if (newLinks.left && newLinks.right) {
                setTimeout(() => handleNextPair(), 1000);
            }
            return newLinks;
        });
    };

    const currentSentences = sentences.slice(currentPairIndex, currentPairIndex + 2);

    return (
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
            <CustomDragPreview/>
            <Card style={{padding: 32, minWidth: 1000, marginTop: '2vw', fontFamily: "Massallera"}}>
                <ActivityToolsComponent
                    content={t("Escucha y completa la red")}
                    playHelp={() => play(audioHelpRef.current)}
                />

                <div style={{marginBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12}}>
                    {currentSentences.map((sentence, idx) => (
                        <div key={idx} style={{display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 8}}>
                            <div style={{display: 'flex', alignItems: 'center', flexWrap: 'nowrap'}}>
                                {sentence.phrase.map((wordData, i) => {
                                    const isDraggable = wordData.draggable;
                                    const isPlaced = (placedLinks.left && placedLinks.left.text === wordData.text) ||
                                        (placedLinks.right && placedLinks.right.text === wordData.text);

                                    if (isDraggable) {
                                        if (isPlaced) {
                                            return <StaticWord key={`${wordData.text}-${i}`} wordData={wordData}/>;
                                        }
                                        return (
                                            <DraggableWord
                                                key={`${wordData.text}-${i}`}
                                                wordData={wordData}
                                                isPlaced={isPlaced}
                                                onDragStart={() => play(wordData.audio)}
                                            />
                                        );
                                    }
                                    return <StaticWord key={`${wordData.text}-${i}`} wordData={wordData}/>;
                                })}
                            </div>
                            <Button
                                icon={<SoundOutlined/>}
                                onClick={() => play(sentence.audio)}
                                style={{marginLeft: 8}}
                            />
                        </div>
                    ))}
                </div>

                <div style={{display: 'flex', justifyContent: 'center', marginTop: 40, opacity: showNetwork ? 1 : 0, transition: 'opacity 0.3s ease-in-out'}}>
                    <svg width="900" height="380" viewBox="0 0 900 380">
                        <rect x="370" y="20" width="160" height="110" rx="12" fill="white" stroke="black" strokeWidth="2"/>
                        <foreignObject x="370" y="20" width="160" height="110">
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <AntdImage src={currentSentences[0].phrase[0].image} alt={currentSentences[0].phrase[0].text}
                                           style={{width: 65, height: 65, objectFit: 'contain', marginBottom: 4}} preview={false}/>
                                <div style={{fontFamily: 'Massallera', fontSize: 16}}>{currentSentences[0].phrase[0].text}</div>
                            </div>
                        </foreignObject>

                        <line x1="450" y1="130" x2="450" y2="155" stroke="#000" strokeWidth="2"/>
                        <line x1="450" y1="155" x2="250" y2="155" stroke="#000" strokeWidth="2"/>
                        <line x1="250" y1="155" x2="250" y2="270" stroke="#000" strokeWidth="2"/>
                        <line x1="450" y1="155" x2="650" y2="155" stroke="#000" strokeWidth="2"/>
                        <line x1="650" y1="155" x2="650" y2="270" stroke="#000" strokeWidth="2"/>

                        <foreignObject x="200" y="165" width="110" height="90">
                            <DropZone zone="left" placedWord={placedLinks.left} targetWord={currentSentences[0].phrase[1].text}
                                      onDrop={handleDrop} leftPlaced={!!placedLinks.left} onDropSuccess={handleDropSuccess}
                                      onDropError={handleDropError} play={() => play(currentSentences[0].phrase[1].audio)}/>
                        </foreignObject>

                        <foreignObject x="600" y="165" width="110" height="90">
                            <DropZone zone="right" placedWord={placedLinks.right} targetWord={currentSentences[1].phrase[1].text}
                                      onDrop={handleDrop} leftPlaced={!!placedLinks.left} onDropSuccess={handleDropSuccess}
                                      onDropError={handleDropError} play={() => play(currentSentences[1].phrase[1].audio)}/>
                        </foreignObject>

                        <image x="350" y="300" style={{height: '3vmax'}} href={`${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`}/>

                        <ellipse cx="250" cy="310" rx="90" ry="55" fill="white" stroke="black" strokeWidth="2"/>
                        <foreignObject x="185" y="265" width="130" height="90">
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <AntdImage src={currentSentences[0].phrase[2].image} alt={currentSentences[0].phrase[2].text}
                                           style={{width: 65, height: 65, objectFit: 'contain', marginBottom: 4}} preview={false}/>
                                <div style={{fontFamily: 'Massallera', fontSize: 15}}>{currentSentences[0].phrase[2].text}</div>
                            </div>
                        </foreignObject>

                        <image x="750" y="300" style={{height: '3vmax'}} href={`${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`}/>

                        <ellipse cx="650" cy="310" rx="90" ry="55" fill="white" stroke="black" strokeWidth="2"/>
                        <foreignObject x="585" y="265" width="130" height="90">
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <AntdImage src={currentSentences[1].phrase[2].image} alt={currentSentences[1].phrase[2].text}
                                           style={{width: 65, height: 65, objectFit: 'contain', marginBottom: 4}} preview={false}/>
                                <div style={{fontFamily: 'Massallera', fontSize: 15}}>{currentSentences[1].phrase[2].text}</div>
                            </div>
                        </foreignObject>
                    </svg>
                </div>
            </Card>
        </DndProvider>
    );
};

export default SentenceNetwork;