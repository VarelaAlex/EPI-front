import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Col, Row, Typography } from "antd";

let SelectRoleComponent = () => {

    let { t } = useTranslation();
    let { Title } = Typography;

    let navigate = useNavigate();

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                <Title style={{ paddingBottom: "10vh" }}>{t("role.title")}</Title>
                <Flex justify="center" align="center" vertical>
                    <Button size='large' type="primary" block style={{ height: "9vh", marginTop: "10px" }} onClick={navigate("/login")}>
                        {t("role.teacher")}
                    </Button>
                    <Button size='large' type="primary" block style={{ height: "9vh", marginTop: "10px" }} onClick={navigate("/login")}>
                        {t("role.student")}
                    </Button>
                </Flex>
            </Col>
        </Row>
    );
};

export default SelectRoleComponent;