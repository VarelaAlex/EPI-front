import { Image, Typography, Card, Checkbox, Divider, Collapse, Row, Col, Carousel, Alert, Empty, Spin } from "antd";
import { useEffect, useState } from "react";
import { FilterFilled } from "@ant-design/icons";
import { arasaacURL, exercisesServiceURL } from "../../Globals";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

let ExercisesCarousel = ({ cardsPerRow = 4, setExercise, rowsPerSlide = 2 }) => {

    const TOTAL_CARDS_PER_SLIDE = cardsPerRow * rowsPerSlide;

    let [exercises, setExercises] = useState([]);
    let [message, setMessage] = useState(null);
    let [loading, setLoading] = useState(true);
    let [categories, setCategories] = useState([]);

    let navigate = useNavigate();
    let { t } = useTranslation();
    let lang = i18n.language;

    useEffect(() => {
        let getExercises = async () => {
            setLoading(true);
            let response = null;
            try {
                response = await fetch(exercisesServiceURL + `/exercises/list/${lang.split("-")[0]}`);
            } catch (e) {
                return;
            }

            let jsonData = await response?.json();
            if (response?.ok) {
                setExercises(jsonData);
            } else {
                setMessage({ error: jsonData?.error });
            }
            setLoading(false);
        };

        getExercises();
    }, [navigate, lang]);

    const [checkedListCategory, setCheckedListCategory] = useState([]);
    let plainOptionsCategory = categories?.map(category => {
        return {
            category: category?.toUpperCase(),
            title: t(
                `categories.${category
                    .replace(
                        /(?:^\w)/g,
                        (match, index) =>
                            index === 0 ? match.toLowerCase() : match.toUpperCase()
                    )}`)
        };
    });

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

        let getFilteredExercises = async (checkedListCategory, checkedListAge) => {
            setLoading(true);
            let response = null;
            try {
                response = await fetch(exercisesServiceURL + `/exercises/list/${lang.split("-")[0]}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        categories: checkedListCategory,
                        ages: checkedListAge
                    })
                });
            } catch (e) {
                return;
            }

            let jsonData = await response?.json();
            if (response?.ok) {
                setExercises(jsonData);
            } else {
                setMessage({ error: jsonData?.error });
            }
            setLoading(false);
        };

        getFilteredExercises(checkedListCategory, checkedListAge);

    }, [checkedListCategory, checkedListAge, lang]);

    useEffect(() => {
        let getCategories = async () => {
            setLoading(true);
            let response = null;
            try {
                response = await fetch(`${exercisesServiceURL}/categories`);
            } catch (e) {
                setMessage({ error: { type: "internalServerError", message: e } });
                return;
            }

            let jsonData = await response?.json();
            if (response?.ok) {
                setCategories(jsonData.map(category => category.name));
            } else {
                setMessage({ error: jsonData?.error });
            }
            setLoading(false);
        };

        getCategories();
    }, []);

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
                                        <Checkbox value={element.age} style={{ fontSize: "1.1vmax" }}>{element.title.toUpperCase()}</Checkbox>
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
                    {exercises.slice(startIndex + rowIndex * cardsPerRow, startIndex + (rowIndex + 1) * cardsPerRow).map((card, cardIndex) => (
                        <Col span={24 / cardsPerRow} key={cardIndex}>

                            <Card hoverable size="small" style={{ userSelect: "none", width: "20vw", height: "12vmax", textAlign: "center", marginBottom: "1vmax" }} title={<Title style={{ fontSize: "1.3vmax", textAlign: "center" }}>{card.title}</Title>} onClick={() => {
                                setExercise(card);
                                if (["ICONIC", "MIXED"].includes(card.representation)) {
                                    navigate("/exerciseDnD/phase1");
                                }
                                else {
                                    navigate("/exerciseType/phase1");
                                }
                            }} description={card.representation}>
                                <Image preview={false} width="6vmax" src={`${arasaacURL}/pictograms/${card.mainImage}`} />
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
                {message?.error?.type && <Alert type="error" message={t(message?.error?.type)} showIcon style={{ marginBottom: "1vh" }} />}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1vmax" }}>
                    <Collapse items={items} style={{ fontSize: "2.5vmin", fontWeight: "bold", width: "90%" }} />
                </div>
                {exercises.length <= 0 ?
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("exercise.carousel.empty")} />
                    :
                    <Carousel draggable style={{ padding: "3vmax", backgroundColor: "#00152f", borderRadius: "50px" }}>
                        {Array.from({ length: Math.ceil(exercises.length / TOTAL_CARDS_PER_SLIDE) }).map((_, slideIndex) =>
                            renderSlide(slideIndex * TOTAL_CARDS_PER_SLIDE)
                        )}
                    </Carousel>
                }
            </div>
        </Spin>
    );
};

export default ExercisesCarousel;
