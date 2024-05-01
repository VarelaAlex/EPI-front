import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, Flex, Col, Row } from "antd";

let SelectRoleComponent = () => {

    let { t } = useTranslation();
    let navigate = useNavigate();
    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                <Card align="center" title={t("role.title")} style={{ width: "500px" }}>
                    <Flex justify="center" align="center" vertical>
                        <Button type="primary" style={{ marginTop: "10px" }} onClick={navigate("/")}>{t("role.teacher")}</Button>
                        <Button type="primary" style={{ marginTop: "10px" }} onClick={navigate("login")}>{t("role.student")}</Button>
                    </Flex>
                </Card>
            </Col>
        </Row>
    );
};

export default SelectRoleComponent;