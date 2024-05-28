import { Image, Typography, Card, List, Checkbox, Divider, Collapse, Row, Col } from "antd";
import { useState } from "react";
import { FilterFilled } from "@ant-design/icons";

let ExercisesCarousel = () => {

    let styleCard = { width: "18vw", height: "12vmax", textAlign: "center" };
    let styleTitle = { fontSize: "1.3vmax", textAlign: "center" };
    let imageProps = { preview: false, width: "6vmax", src: "boca.png" };

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
                                    <Col span={7}>
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
                                    <Col span={7}>
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

    let { Title } = Typography;

    return (
        <div style={{ width: "90vw", padding: "1vw" }}>
            <Collapse ghost items={items} style={{ fontSize: "2.5vmin", fontWeight: "bold" }} />
            <div
                id="scrollableDiv"
                style={{
                    height: "65vh",
                    width: "90vw",
                    overflow: 'scroll',
                    padding: "1vw",
                    backgroundColor: "rgb(254,254,254)"
                }}
            >
                <List
                    grid={{
                        xs: 4,
                        sm: 4,
                        md: 4,
                        lg: 4,
                        xl: 4,
                        xxl: 4,
                    }}
                    dataSource={[
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                        { title: "LA BOCA" },
                    ]}
                    renderItem={(item) => (
                        <List.Item key={item.email}>
                            <Card size="small" style={{ ...styleCard }} title={<Title style={{ ...styleTitle }}>{item.title}</Title>}>
                                <Image {...imageProps} />
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default ExercisesCarousel;
