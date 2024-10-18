import { Image, Typography, Card, Row, Col, Alert, Empty, Spin, Flex, Divider } from "antd";
import { useEffect, useState, useRef, useCallback } from "react";
import { CATEGORIES, REPRESENTATION } from "../../Globals";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { useSession } from "../../SessionComponent";

let ExercisesCarousel = () => {

    let { setExercise, setFeedback } = useSession();

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
            response = await fetch(process.env.REACT_APP_EXERCISES_SERVICE_URL + `/exercises/list/${lang.split("-")[0]}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({ category, representation })
            });
        } catch (error) {
        }

        let jsonData = await response?.json();
        if (response?.ok) {
            const sortOrder = {
                "I-I": 0,
                "I-II": 1,
                "I-III": 2
            };
            jsonData.sort((a, b) => {
                const networkTypeComparison = sortOrder[a.networkType] - sortOrder[b.networkType];

                if (networkTypeComparison === 0) {
                    return a.title.localeCompare(b.title);
                }

                return networkTypeComparison;
            });
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
    };

    let handleRepresentationClick = (representation, index) => {
        setSelectedRepresentation(index);
        setRepresentation(representation);
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

    let { Meta } = Card;

    let { Text, Title } = Typography;
    let a = {
        "I-I": "#ffc464",
        "I-II": "#16e8df",
        "I-III": "#cf8ffc"
    };
    return (
        <Spin spinning={loading} tip="Loading" size="large">
            <div style={{ width: "100vw", padding: "1vw", overflow: "hidden" }}>
                {message?.error?.type && <Alert type="error" message={t(message?.error?.type)} showIcon style={{ marginBottom: "1vh" }} />}
                <Row justify="center" gutter={15} style={{ marginBottom: "1vmax" }}>
                    {Object.values(REPRESENTATION).map((representation, index) => (
                        <Col key={index}>
                            <div
                                style={{ cursor: "pointer" }}
                            >
                                <Flex vertical align="center">
                                    <Image
                                        draggable={false}
                                        preview={false}
                                        src={`/representations/${representation.toLocaleLowerCase()}${selectedRepresentation === index ? "Color" : "BW"}.png`}
                                        width="6vmax"
                                        onClick={() => handleRepresentationClick(representation, index)}
                                    />
                                    {t(`representation.${representation.toLocaleLowerCase()}`)}
                                </Flex>
                            </div>
                        </Col>
                    ))}
                </Row>
                <Row justify="center" gutter={15} style={{ marginBottom: "1vmax", marginTop: "5vmax" }}>
                    {Object.values(CATEGORIES).map((category, index) => (
                        <Col key={index}>
                            <div
                                style={{ cursor: "pointer" }}
                            >
                                <Flex vertical align="center">
                                    <Image
                                        draggable={false}
                                        preview={false}
                                        src={`/categories/${category.toLocaleLowerCase()}${selectedImage === index ? "Color" : "BW"}.png`}
                                        width="6vmax"
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
                                        style={{ textAlign: "center", userSelect: "none", minWidth: "20vmax", height: "25vmax", alignItems: "center" }}
                                        title={<Title level={4} style={{ fontSize: "1.3vmax", textAlign: "center" }}>{card.title}</Title>}
                                        onClick={() => {
                                            if (velocity.current === 0) {
                                                setExercise(card);
                                                setFeedback({});
                                                navigate("/exerciseDnD/phase1");
                                            }
                                        }}
                                    >

                                        <Image draggable={false} preview={false} width="15vmax" src={`${process.env.REACT_APP_ARASAAC_URL}/pictograms/${card.mainImage}`} />
                                        <Divider style={{ marginTop: "1vmax", marginBottom: "1vmax" }} />
                                        <Meta style={{ backgroundColor: a[card.networkType], borderRadius: "12px" }} title={<Text style={{ fontSize: "1.5vmax", textAlign: "center", color: "black" }}>{card.networkType}</Text>} />
                                    </Card>
                                    :
                                    <Card
                                        key={index}
                                        hoverable
                                        size="small"
                                        style={{ textAlign: 'center', userSelect: "none", minWidth: "20vmax", height: "25vmax", alignItems: "center" }}
                                        title={null}
                                        onClick={() => {
                                            if (velocity.current === 0) {
                                                setExercise(card);
                                                setFeedback({});
                                                navigate("/exerciseType/phase1");
                                            }
                                        }}
                                    >
                                        <Title style={{ fontSize: "2.3vmax", textAlign: "center", marginTop: "8vmax" }}>{card.title}</Title>
                                        <Divider style={{ marginTop: "9.45vmax", marginBottom: "1vmax" }} />
                                        <Meta style={{ backgroundColor: a[card.networkType], borderRadius: "12px" }} title={<Text style={{ fontSize: "1.5vmax", textAlign: "center", color: "black" }}>{card.networkType}</Text>} />
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
