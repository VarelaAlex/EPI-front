import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Typography } from "antd";

let SelectRole = () => {

    let { t } = useTranslation();
    let { Title } = Typography;

    let navigate = useNavigate();

    return (
        <Flex align="center" vertical style={{ width: "80%", height: "40vh" }}>
            <Title style={{ paddingBottom: "5vh" }}>{t("role.title")}</Title>
            <Flex justify="space-evenly" align="center" style={{ width: "100%" }} >
                <Button size='large' type="primary" block style={{ width: "40%", height: "9vh" }}
                    onClick={() => navigate("/loginTeacher")}>
                    {t("role.teacher")}
                </Button>
                <Button size='large' type="primary" block style={{ width: "40%", height: "9vh" }}
                    onClick={() => navigate("/loginStudent")}>
                    {t("role.student")}
                </Button>
            </Flex>
        </Flex>
    );
};

export default SelectRole;