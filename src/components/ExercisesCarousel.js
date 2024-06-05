import { Image, Typography, Card, Checkbox, Divider, Collapse, Row, Col, Carousel, Alert, Empty, Spin } from "antd";
import { useEffect, useState } from "react";
import { FilterFilled } from "@ant-design/icons";
import { arasaacURL, exercisesServiceURL } from "../Globals";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

let ExercisesCarousel = ({ cardsPerRow = 4, setExercise, rowsPerSlide = 2 }) => {

    const TOTAL_CARDS_PER_SLIDE = cardsPerRow * rowsPerSlide;

    let [exercises, setExercises] = useState([]);
    let [filteredExercises, setFilteredExercises] = useState([]);
    let [message, setMessage] = useState(null);
    let [loading, setLoading] = useState(true);
    let navigate = useNavigate();
    let { t } = useTranslation();
    let lang = i18n.language;

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
        let getExercises = async () => {
            let response = null;
            try {
                console.log(i18n.language);
                response = await fetch(exercisesServiceURL + `/exercises/list/${lang}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e) {
                return;
            }

            let jsonData = await response?.json();
            if (response?.ok) {
                setExercises(jsonData);
                setFilteredExercises(jsonData);
            } else {
                setMessage({ error: jsonData?.error });
            }
        };

        getExercises();
    }, [navigate, lang]);

    const [checkedListCategory, setCheckedListCategory] = useState([]);
    let plainOptionsCategory = [
        { category: "Family", title: "FAMILIA" },
        { category: "Animals", title: "ANIMALES" },
        { category: "Food", title: "COMIDA" },
        { category: "Body", title: "CUERPO HUMANO" },
        { category: "Objects", title: "OBJETOS" },
        { category: "MeanOfTransportation", title: "MEDIOS DE TRANSPORTE" },
        { category: "City", title: "CIUDAD" },
        { category: "Clothes", title: "ROPA" },
        { category: "Nature", title: "NATURALEZA" }
    ];
    const indeterminateCategory = checkedListCategory.length > 0 && checkedListCategory.length < plainOptionsCategory.length;
    const checkAllCategory = plainOptionsCategory.length === checkedListCategory.length;

    const onChangeCategory = (list) => {
        setCheckedListCategory(list);
    };
    const onCheckAllChangeCategory = (e) => {
        setCheckedListCategory(e.target.checked ? plainOptionsCategory.map(option => option.category) : []);
    };

    const [checkedListAge, setCheckedListAge] = useState([]);
    let plainOptionsAge = [
        { age: "3", title: "3 AÑOS" },
        { age: "4", title: "4 AÑOS" },
        { age: "5", title: "5 AÑOS" },
        { age: "6", title: "6 AÑOS" },
        { age: "7", title: "7 AÑOS" },
        { age: "8", title: "8 AÑOS" }
    ];
    const indeterminateAge = checkedListAge.length > 0 && checkedListAge.length < plainOptionsAge.length;
    const checkAllAge = plainOptionsAge.length === checkedListAge.length;

    const onChangeAge = (list) => {
        setCheckedListAge(list);
    };
    const onCheckAllChangeAge = (e) => {
        setCheckedListAge(e.target.checked ? plainOptionsAge.map(option => option.age) : []);
    };

    const CheckboxGroup = Checkbox.Group;

    useEffect(() => {
        let filteredByCategory = checkedListCategory.length === 0 ? exercises : exercises.filter(exercise =>
            checkedListCategory.some(category =>
                category.toLowerCase() === exercise.category.toLowerCase()
            )
        );

        let filteredByAge = checkedListAge.length === 0 ? filteredByCategory : filteredByCategory.filter(exercise =>
            checkedListAge.some(age => {
                if (["3", "4"].includes(age)) {
                    return "ICONIC" === exercise.representation.toUpperCase();
                }
                if (["5", "6"].includes(age)) {
                    return "MIXED" === exercise.representation.toUpperCase();
                }
                if (["7", "8"].includes(age)) {
                    return "SYMBOLIC" === exercise.representation.toUpperCase();
                }
                return false;
            }
            )
        );

        setFilteredExercises(filteredByAge);
    }, [checkedListCategory, checkedListAge, exercises]);

    let items = [
        {
            key: '1',
            label: (<div><FilterFilled /> Filtros</div>),
            showArrow: false,
            children: (
                <>
                    <Divider orientation="left">
                        <Checkbox style={{ fontWeight: "bold", fontSize: "1.1vmax" }} indeterminate={indeterminateCategory} onChange={onCheckAllChangeCategory} checked={checkAllCategory}>
                            CATEGORÍA
                        </Checkbox>
                    </Divider>
                    <CheckboxGroup value={checkedListCategory} onChange={onChangeCategory} >
                        <Row>
                            {plainOptionsCategory.map((element) => {
                                return (
                                    <Col key={element.category} span={7}>
                                        <Checkbox value={element.category} style={{ fontSize: "1.1vmax" }}>{element.title}</Checkbox>
                                    </Col>
                                );
                            })}
                        </Row>
                    </CheckboxGroup>

                    <Divider orientation="left">
                        <Checkbox style={{ fontWeight: "bold", fontSize: "1.1vmax" }} indeterminate={indeterminateAge} onChange={onCheckAllChangeAge} checked={checkAllAge}>
                            EDAD
                        </Checkbox>
                    </Divider>
                    <CheckboxGroup value={checkedListAge} onChange={onChangeAge} >
                        <Row>
                            {plainOptionsAge.map((element) => {
                                return (
                                    <Col key={element.age} span={7}>
                                        <Checkbox value={element.age} style={{ fontSize: "1.1vmax" }}>{element.title}</Checkbox>
                                    </Col>
                                );
                            })}
                        </Row>
                    </CheckboxGroup>
                </>
            )
        }
    ];

    const renderSlide = (startIndex) => (
        <div key={startIndex}>
            {Array.from({ length: rowsPerSlide }).map((_, rowIndex) => (
                <Row gutter={16} key={rowIndex}>
                    {filteredExercises.slice(startIndex + rowIndex * cardsPerRow, startIndex + (rowIndex + 1) * cardsPerRow).map((card, cardIndex) => (
                        <Col span={24 / cardsPerRow} key={cardIndex}>
                            <Card hoverable size="small" style={{ userSelect: "none", width: "20vw", height: "12vmax", textAlign: "center", marginBottom: "1vmax" }} title={<Title style={{ fontSize: "1.3vmax", textAlign: "center" }}>{card.title}</Title>} onClick={() => {
                                setExercise(card);
                                if (["ICONIC", "MIXED"].includes(card.representation)) {
                                    navigate("/exerciseDnD/phase1");
                                }
                                else {
                                    navigate("/exerciseType/phase1");
                                }
                            }}>
                                <Image preview={false} width="6vmax" src={`${arasaacURL}/${card.mainImage}`} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ))}
        </div>
    );

    let { Title } = Typography;

    return (
        <Spin spinning={loading} tip="Loading" size="large">

            <div style={{ width: "95vw", padding: "1vw" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1vmax" }}>
                    <Collapse items={items} style={{ fontSize: "2.5vmin", fontWeight: "bold", width: "90%" }} />
                </div>
                {filteredExercises.length <= 0 ?
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("exercises.empty")} />
                    :
                    <div>
                        {message?.error?.type && <Alert type="error" message={t(message?.error?.type)} showIcon style={{ marginBottom: "1vh" }} />}
                        <Carousel draggable style={{ padding: "3vmax", backgroundColor: "#00152f", borderRadius: "50px" }}>
                            {Array.from({ length: Math.ceil(filteredExercises.length / TOTAL_CARDS_PER_SLIDE) }).map((_, slideIndex) =>
                                renderSlide(slideIndex * TOTAL_CARDS_PER_SLIDE)
                            )}
                        </Carousel>
                    </div>
                }
            </div>
        </Spin>
    );
};

export default ExercisesCarousel;
