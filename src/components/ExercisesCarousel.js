import { Image, Typography, Card, Checkbox, Divider, Collapse, Row, Col, Carousel } from "antd";
import { useState } from "react";
import { FilterFilled } from "@ant-design/icons";

let ExercisesCarousel = ({ cardsPerRow = 4, rowsPerSlide = 2 }) => {


    const cardData = [
        { title: 'LA BOCA' },
        { title: 'Card 2' },
        { title: 'Card 3' },
        { title: 'Card 4' },
        { title: 'Card 5' },
        { title: 'Card 6' },
        { title: 'Card 7' },
        { title: 'Card 8' },
        { title: 'Card 9' },
        { title: 'Card 10' },
        { title: 'Card 11' },
        { title: 'Card 12' },
    ];

    const totalCardsPerSlide = cardsPerRow * rowsPerSlide;

    const CheckboxGroup = Checkbox.Group;

    const [checkedListCategory, setCheckedListCategory] = useState([]);
    let plainOptionsCategory = ["FAMILIA", "ANIMALES", "COMIDA", "CUERPO HUMANO", "OBJETOS", "MEDIOS DE TRANSPORTE", "CIUDAD", "ROPA", "NATURALEZA"];
    const indeterminateCategory = checkedListCategory.length > 0 && checkedListCategory.length < plainOptionsCategory.length;
    const checkAllCategory = plainOptionsCategory.length === checkedListCategory.length;

    const onChangeCategory = (list) => {
        setCheckedListCategory(list);
    };
    const onCheckAllChangeCategory = (e) => {
        setCheckedListCategory(e.target.checked ? plainOptionsCategory : []);
    };

    const [checkedListAge, setCheckedListAge] = useState([]);
    let plainOptionsAge = ["3 AÑOS", "4 AÑOS", "5 AÑOS", "6 AÑOS", "7 AÑOS", "8 AÑOS"];
    const indeterminateAge = checkedListAge.length > 0 && checkedListAge.length < plainOptionsAge.length;
    const checkAllAge = plainOptionsAge.length === checkedListAge.length;

    const onChangeAge = (list) => {
        setCheckedListAge(list);
    };
    const onCheckAllChangeAge = (e) => {
        setCheckedListAge(e.target.checked ? plainOptionsAge : []);
    };

    let items = [
        {
            key: '1',
            label: (<div><FilterFilled /> Filtros</div>),
            showArrow: false,
            children: (
                <Card>
                    <Divider orientation="left">
                        <Checkbox indeterminate={indeterminateCategory} onChange={onCheckAllChangeCategory} checked={checkAllCategory}>
                            Categoría
                        </Checkbox>
                    </Divider>
                    <CheckboxGroup value={checkedListCategory} onChange={onChangeCategory} >
                        <Row>
                            {plainOptionsCategory.map((element) => {
                                return (
                                    <Col key={element} span={7}>
                                        <Checkbox value={element} style={{ fontSize: "1.1vmax" }}>{element}</Checkbox>
                                    </Col>
                                );
                            })}
                        </Row>
                    </CheckboxGroup>

                    <Divider orientation="left">
                        <Checkbox indeterminate={indeterminateAge} onChange={onCheckAllChangeAge} checked={checkAllAge}>
                            Edad
                        </Checkbox>
                    </Divider>
                    <CheckboxGroup value={checkedListAge} onChange={onChangeAge} >
                        <Row>
                            {plainOptionsAge.map((element) => {
                                return (
                                    <Col key={element} span={7}>
                                        <Checkbox value={element} style={{ fontSize: "1.1vmax" }}>{element}</Checkbox>
                                    </Col>
                                );
                            })}
                        </Row>
                    </CheckboxGroup>
                </Card>
            )
        }
    ];

    const renderSlide = (startIndex) => (
        <div key={startIndex}>
            {Array.from({ length: rowsPerSlide }).map((_, rowIndex) => (
                <Row gutter={16} key={rowIndex}>
                    {cardData.slice(startIndex + rowIndex * cardsPerRow, startIndex + (rowIndex + 1) * cardsPerRow).map((card, cardIndex) => (
                        <Col span={24 / cardsPerRow} key={cardIndex}>
                            <Card hoverable size="small" style={{ width: "20vw", height: "12vmax", textAlign: "center", marginBottom: "1vmax" }} title={<Title style={{ fontSize: "1.3vmax", textAlign: "center" }}>{card.title}</Title>}>
                                <Image preview={false} width="6vmax" src="/boca.png" />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ))}
        </div>
    );

    let { Title } = Typography;

    return (
        <div style={{ width: "95vw", padding: "1vw" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1vmax" }}>
                <Collapse items={items} style={{ fontSize: "2.5vmin", fontWeight: "bold", width: "90%" }} />
            </div>
            <Carousel draggable style={{ padding: "3vmax", backgroundColor: "#00152f", borderRadius: "50px" }}>
                {Array.from({ length: Math.ceil(cardData.length / totalCardsPerSlide) }).map((_, slideIndex) =>
                    renderSlide(slideIndex * totalCardsPerSlide)
                )}
            </Carousel>
        </div>
    );
};

export default ExercisesCarousel;
