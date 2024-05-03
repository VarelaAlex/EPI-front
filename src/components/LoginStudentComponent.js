import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, Flex, Input, Typography } from "antd";

let LoginStudentComponent = (props) => {

    let { setLogin } = props;

    let [emailError, setEmailError] = useState([]);

    let { t } = useTranslation();
    let { Text } = Typography;

    let email = useRef("");
    let navigate = useNavigate();

    let checkEmailInputErrors = () => {

        let updatedErrors = [];

        if (email.current.input.value === null || email.current.input.value?.trim() === '') {
            updatedErrors = [...updatedErrors];
            updatedErrors.push(t("login.error.email.empty"));
        }
        if (email.current.input.value?.length < 3 || (email.current.input.value != null && !(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.current.input.value)))) {
            updatedErrors = [...updatedErrors];
            updatedErrors.push(t("login.error.email.format"));
        }
        setEmailError(updatedErrors);
    };

    let clickLogin = async () => {
        setLogin(true);
        navigate("/");
        email.current.input.value = "";
    };

    let blurEmailInput = () => {
        if (email.current.input.value === null || email.current.input.value?.trim() === '') {
            setEmailError([]);
        }
    };

    return (
        <Flex align="center" justify="top" style={{ height: "100%" }} vertical>
            <Card title={t("login.title")} style={{ width: "70vmin" }}>
                <Input
                    ref={email}
                    size="large"
                    type="text"
                    placeholder={t("login.form.username")}
                    onChange={() => checkEmailInputErrors()}
                    onBlur={() => blurEmailInput([])}
                />
                {emailError && emailError.map(e => { return <Text type="danger">{e}<br /></Text>; })}
                <Button type="primary" style={{ marginTop: "10px" }} block onClick={clickLogin}>{t("login.button")}</Button>
            </Card>
        </Flex>
    );
};

export default LoginStudentComponent;