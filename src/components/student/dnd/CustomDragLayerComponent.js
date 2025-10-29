import {Card, Col, Image, Row} from "antd";
import {useDragLayer} from "react-dnd";

function CustomDragLayer() {
    const {item, isDragging, currentOffset} = useDragLayer((monitor) => ({
        item: monitor.getItem(), isDragging: monitor.isDragging(), currentOffset: monitor.getSourceClientOffset(),
    }));

    if (!isDragging || !currentOffset || !item) return null;

    return (<div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 100,
                transform: `translate(${currentOffset.x}px, ${currentOffset.y}px) scale(1.05)`,
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
                    textAlign: "center",
                    fontFamily: "Massallera",
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                }}
            >
                {item.image && (<Row justify="center">
                        <Col>
                            <Image
                                src={item.image}
                                alt=""
                                style={{
                                    width: 50, height: 50, objectFit: "contain", marginBottom: 4,
                                }}
                                preview={false}
                            />
                        </Col>
                    </Row>)}
                {item.text}
            </Card>
        </div>);
}

export default CustomDragLayer;