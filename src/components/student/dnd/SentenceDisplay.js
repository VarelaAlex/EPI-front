import React from 'react';
import {Button} from 'antd';
import {SoundOutlined} from '@ant-design/icons';
import {DraggableWord} from './DraggableWord';
import {StaticWord} from './StaticWord';

export const SentenceDisplay = ({
                                    currentSentences,
                                    getWordKey,
                                    isWordPlaced,
                                    handleDragStart,
                                    handleSentencePlay,
                                    isSentenceCompleted
                                }) => {
    return (
        <div style={{
            marginBottom: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 12
        }}>
            {currentSentences.map((sentence, idx) => {
                const sentenceIdx = idx;
                return (
                    <div key={sentenceIdx} style={{display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 8}}>
                        <div style={{display: 'flex', alignItems: 'center', flexWrap: 'nowrap'}}>
                            {sentence.phrase.map((wordData, wordIdx) => {
                                const wordKey = getWordKey ? getWordKey(sentenceIdx, wordIdx) : `${wordData.text}-${wordIdx}`;
                                const isPlaced = isWordPlaced ? isWordPlaced(sentenceIdx, wordIdx) : false;

                                if (isPlaced) {
                                    return (
                                        <StaticWord
                                            key={wordKey}
                                            wordData={wordData}
                                        />
                                    );
                                }

                                return <DraggableWord
                                    key={wordKey}
                                    wordData={wordData}
                                    wordKey={wordKey}
                                    isPlaced={isPlaced}
                                    onDragStart={() => handleDragStart(wordData)}
                                />;
                            })}
                        </div>
                        {(!isSentenceCompleted || !isSentenceCompleted(sentenceIdx)) && (
                            <Button
                                icon={<SoundOutlined />}
                                onClick={() => handleSentencePlay(idx)}
                                style={{ marginLeft: 8 }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};