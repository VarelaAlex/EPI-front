import React, {useEffect, useRef} from "react";
import {useDrag} from "react-dnd";
import {getEmptyImage} from "react-dnd-html5-backend";
import {Card, Col, Image, Row} from "antd";
import {ItemTypes} from "./ItemTypes";

function DraggableCard({id, text, audio, image, disabled}) {
    const audioRef = useRef(null);

    const handlePlayAudio = async () => {
        if (!audioRef.current) return;
        try {
            audioRef.current.currentTime = 0;
            await audioRef.current.play();
        } catch (err) {
        }
    };

    useEffect(() => {
        if (audio) audioRef.current = new Audio(audio);
    }, [audio]);

    const [{isDragging}, drag, preview] = useDrag(() => ({
        type: ItemTypes.WORD,
        item: {id, text, image},
        collect: (monitor) => ({isDragging: !!monitor.isDragging()}),
        canDrag: () => !disabled,
    }));

    useEffect(() => {
        preview(getEmptyImage(), {captureDraggingState: true});
    }, [preview]);

    const handleMouseDown = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {
            });
        }
    };

    const handleTouchStart = (e) => {
        if (e.cancelable) e.preventDefault();
        handleMouseDown();
        handlePlayAudio();
    };

    const handlePointerDown = (e) => {
        if (e.pointerType === "touch" && e.cancelable) e.preventDefault();
    };

    return (<div
            ref={drag}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onPointerDown={handlePointerDown}
            className="draggable-card"
            style={{opacity: isDragging ? 0 : 1, touchAction: "none", cursor: disabled ? "not-allowed" : "grab"}}
        >
            <Card
                hoverable
                style={{
                    width: 150,
                    height: 120,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: disabled ? 0.5 : 1,
                    fontFamily: "Massallera",
                    fontWeight: 600,
                    textAlign: "center",
                }}
            >
                {image && (<Row justify="center">
                    <Col>
                        <Image
                            src={image}
                            alt=""
                            style={{width: 50, height: 50, objectFit: "contain", marginBottom: 4}}
                            preview={false}
                        />
                    </Col>
                </Row>)}
                {text}
            </Card>
        </div>);
}

export default DraggableCard;