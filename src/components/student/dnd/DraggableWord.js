import React, {useEffect} from 'react';
import {Card, Col, Image as AntdImage, Row} from 'antd';
import {useDrag} from 'react-dnd';

const ItemTypes = {
    WORD: 'word'
};

export const DraggableWord = ({wordData, isPlaced, onDragStart, wordKey}) => {
    const [{isDragging}, drag, preview] = useDrag({
        type: ItemTypes.WORD,
        item: {word: wordData.text, image: wordData.image, wordKey},
        canDrag: !isPlaced,
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    useEffect(() => {
        preview(new Image());
    }, [preview]);

    const handleMouseDown = () => {
        if (!isPlaced) {
            onDragStart();
        }
    };

    const handleTouchStart = () => {
        if (!isPlaced) {
            onDragStart();
        }
    };

    if (isPlaced) {
        return (<div style={{display: 'inline-block', minWidth: 80, height: 40, margin: 4, visibility: 'hidden'}}/>);
    }

    return (<div
        ref={drag}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
            display: 'inline-block',
            margin: 4,
            opacity: isDragging ? 0.5 : 1,
            cursor: 'grab',
            touchAction: 'none'
        }}
    >
        <Card
            size="small"
            hoverable
            style={{
                textAlign: 'center',
                background: '#e6f7ff',
                minWidth: 120,
                height: 100,
                userSelect: 'none',
                fontFamily: "Massallera"
            }}
        >
            <Row justify="center">
                <Col>
                    <AntdImage
                        src={wordData.image}
                        alt={wordData.text}
                        style={{width: 50, height: 50, objectFit: "contain", marginBottom: 4}}
                        preview={false}
                    />
                </Col>
            </Row>
            {wordData.text}
        </Card>
    </div>);
};