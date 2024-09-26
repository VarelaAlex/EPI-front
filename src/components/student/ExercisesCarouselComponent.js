import { Image, Typography, Card, Row, Col, Alert, Empty, Spin, Flex } from "antd";
import { useEffect, useState, useRef, useCallback } from "react";
import { arasaacURL, exercisesServiceURL, CATEGORIES, REPRESENTATION } from "../../Globals";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

let ExercisesCarousel = ({ setExercise, setFeedback }) => {

    let [exercises, setExercises] = useState([]);
    let [message, setMessage] = useState(null);
    let [loading, setLoading] = useState(true);
    let [selectedImage, setSelectedImage] = useState(0);
    let [selectedRepresentation, setSelectedRepresentation] = useState(0);
    let [category, setCategory] = useState(CATEGORIES.BODY_AND_FOOD);
    let [representation, setRepresentation] = useState(REPRESENTATION.ICONIC);

    let navigate = useNavigate();
    let { t } = useTranslation();
    let lang = i18n.language;

    const carouselRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const velocity = useRef(0);
    const lastX = useRef(0);
    const lastTime = useRef(0);
    const requestId = useRef(null);

    const getExercises = useCallback(async () => {
        setLoading(true);
        let response = null;
        try {
            response = await fetch(exercisesServiceURL + `/exercises/list/${lang.split("-")[0]}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, representation })
            });
        } catch (error) {
        }

        let jsonData = await response?.json();
        if (response?.ok) {
            setExercises(jsonData);
        } else {
            setMessage({ error: jsonData?.error });
        }
        setLoading(false);
    }, [lang, category, representation]);

    useEffect(() => {
        getExercises();
    }, [getExercises, category, representation]);

    let handleImageClick = (category, index) => {
        setSelectedImage(index);
        setCategory(category);
        //getExercises();
    };

    let handleRepresentationClick = (representation, index) => {
        setSelectedRepresentation(index);
        setRepresentation(representation);
        //getExercises();
    };

    const startDrag = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - carouselRef.current.offsetLeft;
        scrollLeft.current = carouselRef.current.scrollLeft;
        velocity.current = 0;
        lastX.current = startX.current;
        lastTime.current = Date.now();
        cancelAnimationFrame(requestId.current);
    };

    const stopDrag = () => {
        isDragging.current = false;
        const inertiaScroll = () => {
            if (Math.abs(velocity.current) > 0) {
                if (Math.abs(velocity.current) < 0.25) {
                    velocity.current = 0;
                }
                if (velocity.current > 0) {
                    velocity.current -= 0.25;
                } else {
                    velocity.current += 0.25;
                }
                carouselRef.current.scrollLeft -= velocity.current;
                requestId.current = requestAnimationFrame(inertiaScroll);
            }
        };
        inertiaScroll();
    };

    const drag = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX.current) * 2;
        carouselRef.current.scrollLeft = scrollLeft.current - walk;

        const now = Date.now();
        const elapsed = now - lastTime.current;
        const deltaX = x - lastX.current;
        velocity.current = deltaX / (elapsed + 1) * 2;

        lastX.current = x;
        lastTime.current = now;

        requestId.current = requestAnimationFrame(() => drag(e));
    };

    return (
        <Spin spinning={loading} tip="Loading" size="large">
            <div style={{ width: "100vw", padding: "1vw", overflow: "hidden" }}>
                {message?.error?.type && <Alert type="error" message={t(message?.error?.type)} showIcon style={{ marginBottom: "1vh" }} />}
                <Row justify="center" gutter={15} style={{ marginBottom: "1vmax" }}>
                    {Object.values(REPRESENTATION).map((representation, index) => (
                        <Col key={index}>
                            <div
                                style={
                                    selectedRepresentation === index ? { border: "2px solid #ebdc00", borderRadius: "50%", padding: "20px", cursor: "pointer" } : { cursor: "pointer" }
                                }
                            >
                                <Flex vertical align="center">
                                    <Image
                                        draggable={false}
                                        preview={false}
                                        src={`/representations/${representation.toLocaleLowerCase()}${selectedRepresentation === index ? "Color" : "BW"}.png`}
                                        width="64px"
                                        onClick={() => handleRepresentationClick(representation, index)}
                                    />
                                    {t(`representation.${representation.toLocaleLowerCase()}`)}
                                </Flex>
                            </div>
                        </Col>
                    ))}
                </Row>
                <Row justify="center" gutter={15} style={{ marginBottom: "1vmax" }}>
                    {Object.values(CATEGORIES).map((category, index) => (
                        <Col key={index}>
                            <div
                                style={
                                    selectedImage === index ? { border: "2px solid #ebdc00", borderRadius: "50%", padding: "20px", cursor: "pointer" } : { cursor: "pointer" }
                                }
                            >
                                <Flex vertical align="center">
                                    <Image
                                        draggable={false}
                                        preview={false}
                                        src={`/categories/${category.toLocaleLowerCase()}${selectedImage === index ? "Color" : "BW"}.png`}
                                        width="64px"
                                        onClick={() => handleImageClick(category, index)}
                                    />
                                    {t(`categories.${category.toLocaleLowerCase()}`)}
                                </Flex>
                            </div>
                        </Col>
                    ))}
                </Row>
                {exercises.length > 0 ?
                    (
                        <div
                            ref={carouselRef}
                            onMouseDown={startDrag}
                            onMouseLeave={stopDrag}
                            onMouseUp={stopDrag}
                            onMouseMove={drag}
                            style={{
                                overflowX: "auto",
                                padding: "3vmax",
                                msOverflowStyle: "none",
                                scrollbarWidth: "none",
                                display: "flex",
                                flexDirection: "row",
                                gap: "1rem",
                                cursor: "grab"
                            }}
                        >
                            {exercises.map((card, index) => (
                                ["ICONIC", "MIXED"].includes(card.representation) ?
                                    <Card
                                        key={index}
                                        hoverable
                                        size="small"
                                        style={{ userSelect: "none", width: "30vmax", height: "25vmax", textAlign: "center", marginBottom: "1vmax" }}
                                        title={<Typography.Title level={4} style={{ fontSize: "1.3vmax", textAlign: "center" }}>{card.title}</Typography.Title>}
                                        onClick={() => {
                                            if (velocity.current === 0) {
                                                setExercise(card);
                                                setFeedback({})
                                                navigate("/exerciseDnD/phase1");
                                            }
                                        }}
                                    >
                                        <Image draggable={false} preview={false} width="100%" src={`${arasaacURL}/pictograms/${card.mainImage}`} style={{ marginRight: "3vmax" }} />
                                    </Card>
                                    :
                                    <Card
                                        key={index}
                                        hoverable
                                        size="small"
                                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', userSelect: "none", minWidth: "20vw", maxWidth: "25vw", height: "45vh", marginBottom: "1vmax" }}
                                        title={null}
                                        onClick={() => {
                                            if (velocity.current === 0) {
                                                setExercise(card);
                                                setFeedback({})
                                                navigate("/exerciseType/phase1");
                                            }
                                        }}
                                    >
                                        <Typography.Title style={{ fontSize: "3vmax", textAlign: "center" }}>{card.title}</Typography.Title>
                                    </Card>
                            ))}
                        </div>
                    ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("exercise.carousel.empty")} />
                    )
                }
            </div>
        </Spin>
    );
};

export default ExercisesCarousel;
