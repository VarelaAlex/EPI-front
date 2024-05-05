import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Typography } from "antd";

let SelectRoleComponent = (props) => {

    let { setRole } = props;

    let { t } = useTranslation();
    let { Title } = Typography;

    let navigate = useNavigate();

    let onClickTeacher = () => {
        navigate("/loginTeacher");
        setRole("T");
    };

    let onClickStudent = () => {
        navigate("/loginStudent");
        setRole("S");
    };

    return (
        <Flex align="center" justify="top" vertical>
            <Title style={{ paddingBottom: "5vh" }}>{t("role.title")}</Title>
            <Flex justify="center" align="center" style={{ width: "25vmax" }} vertical>
                <Button size='large' type="primary" block style={{ height: "9vh" }}
                    onClick={() => onClickTeacher()}>
                    {t("role.teacher")}
                </Button>
                <Button size='large' type="primary" block style={{ height: "9vh", marginTop: "2vh" }}
                    onClick={() => onClickStudent()}>
                    {t("role.student")}
                </Button>
            </Flex>
        </Flex>
    );
};

export default SelectRoleComponent;