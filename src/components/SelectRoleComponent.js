import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Typography } from "antd";

let SelectRoleComponent = () => {

    let { t } = useTranslation();
    let { Title } = Typography;

    let navigate = useNavigate();

    return (
        <Flex align="center" justify="top" vertical>
            <Title style={{ paddingBottom: "5vh" }}>{t("role.title")}</Title>
            <Flex justify="center" align="center" style={{ width: "25vmax" }} vertical>
                <Button size='large' type="primary" block style={{ height: "9vh" }}
                    onClick={() => navigate("/loginTeacher")}>
                    {t("role.teacher")}
                </Button>
                <Button size='large' type="primary" block style={{ height: "9vh", marginTop: "2vh" }}
                    onClick={() => navigate("/loginStudent")}>
                    {t("role.student")}
                </Button>
            </Flex>
        </Flex>
    );
};

export default SelectRoleComponent;