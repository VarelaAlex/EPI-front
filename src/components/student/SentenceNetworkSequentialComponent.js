import React, {useEffect, useRef, useState} from 'react';
import {Card, Button, Image as AntdImage} from 'antd';
import {SoundOutlined} from '@ant-design/icons';
import {DndProvider, useDrop} from 'react-dnd';
import {MultiBackend} from 'dnd-multi-backend';
import {HTML5toTouch} from 'rdndmb-html5-to-touch';
import {useTranslation} from "react-i18next";
import ActivityToolsComponent from "./dnd/ActivityToolsComponent";
import {useSentenceAudio} from "../../hooks/useSentenceAudio";
import {CustomDragPreview} from "./dnd/CustomDragPreview";
import {DraggableWord} from "./dnd/DraggableWord";
import {StaticWord} from "./dnd/StaticWord";
import '../assets/styles/font.css';
import {STOP} from "./NetworkProps";

const ItemTypes = { WORD: 'word' };

const DropZone = ({zone, placedWord, onDrop, canDropHere}) => {
    const [{isOver}, drop] = useDrop({
        accept: ItemTypes.WORD,
        drop: (item) => {
            onDrop(zone, item.word, item.wordKey, item.image);
        },
        canDrop: () => true,
        collect: (monitor) => ({
            isOver: monitor.isOver()
        }),
    });

    const backgroundColor = isOver && canDropHere ? '#bae7ff' : '#e6f7ff';

    return (
        <div ref={drop} style={{width: 100, height: 80, border: '2px dashed #91d5ff', borderRadius: 8, background: backgroundColor,
            display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: placedWord ? 'default' : 'pointer'}}>
            {placedWord && (
                <div style={{textAlign: 'center'}}>
                    <AntdImage src={placedWord.image} alt={placedWord.text}
                               style={{width: 40, height: 40, objectFit: 'contain'}} preview={false}/>
                    <div style={{fontFamily: 'Massallera', fontSize: 14}}>{placedWord.text}</div>
                </div>
            )}
        </div>
    );
};

const SentenceNetworkSequential = () => {
    const {t} = useTranslation();
    const sentences = [
        // TRÍO 1
        {
            phrase: [
                {text: "El perro", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`, audio: new Audio("/sounds/dog.mp3")}
            ],
            audio: new Audio("/sounds/dog.mp3")
        },
        {
            phrase: [
                {text: "El perro", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`, audio: new Audio("/sounds/dog.mp3")},
                {text: "es", image: "/pictograms/is.png", audio: new Audio("/sounds/is.mp3"), draggable: true},
                {text: "un animal", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6901`, audio: new Audio("/sounds/animal.mp3")},
                {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: new Audio("/sounds/stop.mp3")}
            ],
            audio: new Audio("/sounds/dog-animal.mp3")
        },
        {
            phrase: [
                {text: "El perro", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`, audio: new Audio("/sounds/dog.mp3")},
                {text: "tiene", image: "/pictograms/has.png", audio: new Audio("/sounds/has.mp3"), draggable: true},
                {text: "cola", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5967`, audio: new Audio("/sounds/tail.mp3")},
                {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: new Audio("/sounds/stop.mp3")}
            ],
            audio: new Audio("/sounds/dog-tail.mp3")
        },
        // TRÍO 2
        {
            phrase: [
                {text: "La ballena", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`, audio: new Audio("/sounds/whale.mp3")}
            ],
            audio: new Audio("/sounds/whale.mp3")
        },
        {
            phrase: [
                {text: "La ballena", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`, audio: new Audio("/sounds/whale.mp3")},
                {text: "es", image: "/pictograms/is.png", audio: new Audio("/sounds/is.mp3"), draggable: true},
                {text: "un mamífero", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7777`, audio: new Audio("/sounds/mammal.mp3")},
                {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: new Audio("/sounds/stop.mp3")}
            ],
            audio: new Audio("/sounds/whale-mammal.mp3")
        },
        {
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

    const initializePlacedWords = () => {
        const initialState = {center: null, linkLeft: null, linkRight: null, endLeft: null, endRight: null, dotLeft: null, dotRight: null};
        sentences.forEach((sentence, sentenceIdx) => {
            sentence.phrase.forEach((_, wordIdx) => {
                initialState[`s${sentenceIdx}w${wordIdx}`] = null;
            });
        });
        return initialState;
    };

    const [placedWords, setPlacedWords] = useState(initializePlacedWords());
    const [currentStep, setCurrentStep] = useState(0);
    const [currentTrioIndex, setCurrentTrioIndex] = useState(0);
    const [showNetwork, setShowNetwork] = useState(false);

    const audioHelpRef = useRef(new Audio("/sounds/sentenceActivity2Help.mp3"));

    useEffect(() => {
        const timer = setTimeout(() => setShowNetwork(true), 1000);
        return () => clearTimeout(timer);
    }, [currentTrioIndex]);

    // Índices de las 3 frases del trío actual
    const firstSentenceIdx = currentTrioIndex * 3;
    const secondSentenceIdx = currentTrioIndex * 3 + 1;
    const thirdSentenceIdx = currentTrioIndex * 3 + 2;

    const placementOrder = [
        // Paso 0: Primera palabra (solo una palabra)
        {key: 'center', word: sentences[firstSentenceIdx].phrase[0].text, sentence: firstSentenceIdx, wordIdx: 0},
        // Pasos 1-4: Segunda frase (rama izquierda)
        {key: 'centerReuse', word: sentences[secondSentenceIdx].phrase[0].text, sentence: secondSentenceIdx, wordIdx: 0},
        {key: 'linkLeft', word: sentences[secondSentenceIdx].phrase[1].text, sentence: secondSentenceIdx, wordIdx: 1},
        {key: 'endLeft', word: sentences[secondSentenceIdx].phrase[2].text, sentence: secondSentenceIdx, wordIdx: 2},
        {key: 'dotLeft', word: '.', sentence: secondSentenceIdx, wordIdx: 3},
        // Pasos 5-8: Tercera frase (rama derecha)
        {key: 'centerReuse2', word: sentences[thirdSentenceIdx].phrase[0].text, sentence: thirdSentenceIdx, wordIdx: 0},
        {key: 'linkRight', word: sentences[thirdSentenceIdx].phrase[1].text, sentence: thirdSentenceIdx, wordIdx: 1},
        {key: 'endRight', word: sentences[thirdSentenceIdx].phrase[2].text, sentence: thirdSentenceIdx, wordIdx: 2},
        {key: 'dotRight', word: '.', sentence: thirdSentenceIdx, wordIdx: 3},
    ];

    const handleDrop = (zone, word, wordKey, image) => {
        const expectedPlacement = placementOrder[currentStep];
        const isCorrectZone = expectedPlacement && (
            expectedPlacement.key === zone ||
            (expectedPlacement.key === 'centerReuse' && zone === 'center') ||
            (expectedPlacement.key === 'centerReuse2' && zone === 'center')
        );
        const isCorrectWord = expectedPlacement && expectedPlacement.word === word;
        const isCorrectSentence = wordKey === `s${expectedPlacement.sentence}w${expectedPlacement.wordIdx}`;

        if (isCorrectZone && isCorrectWord && isCorrectSentence) {
            const zoneKey = (expectedPlacement.key === 'centerReuse' || expectedPlacement.key === 'centerReuse2') ? 'center' : expectedPlacement.key;
            const updates = {[zoneKey]: {text: word, image: image}, [wordKey]: {text: word, image: image}};
            setPlacedWords(prev => ({...prev, ...updates}));
            handleDropSuccess();

            // Limpiar el centro después de colocar la primera palabra y después de la segunda frase
            if (currentStep === 0 || currentStep === 4) {
                setTimeout(() => {
                    setPlacedWords(prev => ({...prev, center: null}));
                }, 500);
            }

            // Si completamos el trío completo
            if (currentStep === 8) {
                setTimeout(() => {
                    if (currentTrioIndex < Math.floor(sentences.length / 3) - 1) {
                        setCurrentTrioIndex(prev => prev + 1);
                        setCurrentStep(0);
                        setShowNetwork(false);
                        setPlacedWords(initializePlacedWords());
                    }
                }, 1000);
            } else {
                setCurrentStep(prev => prev + 1);
            }
        } else {
            handleDropError();
        }
    };

    const getWordKey = (sentenceIdx, wordIdx) => `s${sentenceIdx}w${wordIdx}`;
    const isWordPlaced = (sentenceIdx, wordIdx) => {
        const wordKey = getWordKey(sentenceIdx, wordIdx);
        return placedWords[wordKey] !== null && placedWords[wordKey] !== undefined;
    };
    const canDropInZone = (zoneKey) => {
        const expectedPlacement = placementOrder[currentStep];
        if (!expectedPlacement) return false;
        if ((expectedPlacement.key === 'centerReuse' || expectedPlacement.key === 'centerReuse2') && zoneKey === 'center') return true;
        return expectedPlacement.key === zoneKey;
    };
    const isSentenceCompleted = (sentenceIdx) => {
        return sentences[sentenceIdx].phrase.every((_, wordIdx) => isWordPlaced(sentenceIdx, wordIdx));
    };

    const currentSentences = [
        sentences[firstSentenceIdx],
        sentences[secondSentenceIdx],
        sentences[thirdSentenceIdx]
    ];

    return (
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
            <CustomDragPreview/>
            <Card style={{padding: 32, minWidth: 1000, margin: '0 auto', fontFamily: "Massallera"}}>
                <ActivityToolsComponent content={t("Escucha y coloca los elementos en el orden y el lugar correcto")}
                                        playHelp={() => play(audioHelpRef.current)}/>

                <div style={{marginBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12}}>
                    {currentSentences.map((sentence, idx) => {
                        const sentenceIdx = firstSentenceIdx + idx;
                        return (
                            <div key={sentenceIdx} style={{display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 8}}>
                                <div style={{display: 'flex', alignItems: 'center', flexWrap: 'nowrap'}}>
                                    {sentence.phrase.map((wordData, wordIdx) => {
                                        const wordKey = getWordKey(sentenceIdx, wordIdx);
                                        const isPlaced = isWordPlaced(sentenceIdx, wordIdx);

                                        if (isPlaced) {
                                            return <StaticWord key={wordKey} wordData={wordData}/>;
                                        }

                                        return <DraggableWord key={wordKey} wordData={wordData} wordKey={wordKey}
                                                              isPlaced={isPlaced} onDragStart={() => play(wordData.audio)}/>;
                                    })}
                                </div>
                                {!isSentenceCompleted(sentenceIdx) && (
                                    <Button icon={<SoundOutlined/>} onClick={() => play(currentSentences[idx].audio)} style={{marginLeft: 8}}/>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{display: 'flex', justifyContent: 'center', marginTop: 40, opacity: showNetwork ? 1 : 0, transition: 'opacity 0.3s ease-in-out'}}>
                    <svg width="900" height="380" viewBox="0 0 900 380">
                        <rect x="370" y="20" width="160" height="110" rx="12" fill="white" stroke="black" strokeWidth="2"/>
                        <foreignObject x="400" y="35" width="160" height="110">
                            <DropZone zone="center" placedWord={placedWords.center} onDrop={handleDrop} canDropHere={canDropInZone('center')}/>
                        </foreignObject>

                        <line x1="450" y1="130" x2="450" y2="155" stroke="#000" strokeWidth="2"/>
                        <line x1="450" y1="155" x2="250" y2="155" stroke="#000" strokeWidth="2"/>
                        <line x1="250" y1="155" x2="250" y2="270" stroke="#000" strokeWidth="2"/>
                        <line x1="450" y1="155" x2="650" y2="155" stroke="#000" strokeWidth="2"/>
                        <line x1="650" y1="155" x2="650" y2="270" stroke="#000" strokeWidth="2"/>

                        <foreignObject x="200" y="170" width="110" height="90">
                            <DropZone zone="linkLeft" placedWord={placedWords.linkLeft} onDrop={handleDrop} canDropHere={canDropInZone('linkLeft')}/>
                        </foreignObject>

                        <foreignObject x="600" y="170" width="110" height="90">
                            <DropZone zone="linkRight" placedWord={placedWords.linkRight} onDrop={handleDrop} canDropHere={canDropInZone('linkRight')}/>
                        </foreignObject>

                        <ellipse cx="250" cy="320" rx="90" ry="55" fill="white" stroke="black" strokeWidth="2"/>
                        <foreignObject x="200" y="280" width="130" height="90">
                            <DropZone zone="endLeft" placedWord={placedWords.endLeft} onDrop={handleDrop} canDropHere={canDropInZone('endLeft')}/>
                        </foreignObject>

                        <foreignObject x="360" y="300" width="110" height="90">
                            <DropZone zone="dotLeft" placedWord={placedWords.dotLeft} onDrop={handleDrop} canDropHere={canDropInZone('dotLeft')}/>
                        </foreignObject>

                        <ellipse cx="650" cy="320" rx="90" ry="55" fill="white" stroke="black" strokeWidth="2"/>
                        <foreignObject x="600" y="280" width="130" height="90">
                            <DropZone zone="endRight" placedWord={placedWords.endRight} onDrop={handleDrop} canDropHere={canDropInZone('endRight')}/>
                        </foreignObject>

                        <foreignObject x="760" y="300" width="110" height="90">
                            <DropZone zone="dotRight" placedWord={placedWords.dotRight} onDrop={handleDrop} canDropHere={canDropInZone('dotRight')}/>
                        </foreignObject>
                    </svg>
                </div>
            </Card>
        </DndProvider>
    );
};

export default SentenceNetworkSequential;