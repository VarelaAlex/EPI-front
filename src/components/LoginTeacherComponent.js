import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, Flex, Input, Typography } from "antd";

let LoginTeacherComponent = (props) => {

    let { setLogin } = props;

    let [emailError, setEmailError] = useState([]);
    let [passwordError, setPasswordError] = useState([]);

    let { t } = useTranslation();
    let { Text } = Typography;

    let email = useRef("");
    let password = useRef("");
    let navigate = useNavigate();

    let checkEmailInputErrors = () => {

        let updatedErrors = [];

        if (email.current.input.value === null
            || email.current.input.value?.trim() === ''
        ) {
            updatedErrors = [...updatedErrors];
            updatedErrors.push(t("login.error.email.empty"));
        }
        if (email.current.input.value?.length < 3
            || (email.current.input.value != null
                && !(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.current.input.value)))
        ) {
            updatedErrors = [...updatedErrors];
            updatedErrors.push(t("login.error.email.format"));
        }
        setEmailError(updatedErrors);
    };

    let checkPasswordInputErrors = () => {

        let updatedErrors = [];
        if (password.current.input.value === null
            || password.current.input.value?.trim() === ''
        ) {
            updatedErrors = [...updatedErrors];
            updatedErrors.push(t("login.error.password.empty"));
        }
        if (password.current.input.value?.length < 5) {
            updatedErrors = [...updatedErrors];
            updatedErrors.push(t("login.error.password.format"));
        }
        setPasswordError(updatedErrors);
    };

    let clickLogin = async () => {
        setLogin(true);
        navigate("/");
        email.current.input.value = "";
        password.current.input.value = "";
    };

    let blurEmailInput = () => {
        if (email.current.input.value === null
            || email.current.input.value?.trim() === ''
        ) {
            setEmailError([]);
        }
    };

    let blurPasswordInput = () => {
        if (password.current.input.value === null
            || password.current.input.value?.trim() === ''
        ) {
            setPasswordError([]);
        }
    };

    return (
        <Flex align="center" justify="top" style={{height:"100%"}} vertical>
            <Card title={t("login.title")} style={{ width: "70vmin" }}>
                <Input
                    ref={email}
                    size="large"
                    type="text"
                    placeholder={t("login.form.email")}
                    onChange={() => checkEmailInputErrors()}
                    onBlur={() => blurEmailInput()}
                />
                {emailError && emailError.map(e => { return <Text type="danger">{e}<br /></Text>; })}
                <Input
                    ref={password}
                    size="large"
                    style={{ marginTop: "10px" }}
                    type="password"
                    placeholder={t("login.form.password")}
                    onChange={() => checkPasswordInputErrors()}
                    onBlur={() => blurPasswordInput()}
                />
                {passwordError && passwordError.map(e => { return <Text type="danger">{e}<br /></Text>; })}
                <Button type="primary" style={{ marginTop: "10px" }} block onClick={clickLogin}>{t("login.button")}</Button>
            </Card>
        </Flex>
    );
};

export default LoginTeacherComponent;