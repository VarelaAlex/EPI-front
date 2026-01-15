import React, {useEffect} from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Card, Col, Row, Image } from "antd";
import { ItemTypes } from "./ItemTypes";
import {usePlayAudio} from "../../../hooks/usePlayAudio";

function DraggableCard({ id, text, audio, image, disabled }) {
    const playAudio = usePlayAudio();

    const handlePlayAudio = () => {
        if (audio) {
            playAudio(audio);
        }
    };

    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: ItemTypes.WORD,
        item: { id, text, image },
        collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
        canDrag: () => !disabled,
    }));

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    const handleMouseDown = () => handlePlayAudio();

    const handleTouchStart = (e) => {
        if (e.cancelable) e.preventDefault();
        handlePlayAudio();
    };

    const handlePointerDown = (e) => {
        if (e.pointerType === "touch" && e.cancelable) e.preventDefault();
    };

    return (
        <div
            ref={drag}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onPointerDown={handlePointerDown}
            className="draggable-card"
            style={{
                opacity: isDragging ? 0 : 1,
                touchAction: "none",
                cursor: disabled ? "not-allowed" : "grab",
            }}
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
                {image && (
                    <Row justify="center">
                        <Col>
                            <Image
                                src={image}
                                alt=""
                                style={{ width: 50, height: 50, objectFit: "contain", marginBottom: 4 }}
                                preview={false}
                            />
                        </Col>
                    </Row>
                )}
                {text}
            </Card>
        </div>
    );
}

export default DraggableCard;