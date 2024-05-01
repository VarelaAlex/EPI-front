import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, Col, Input, Row, Typography } from "antd";

let LoginComponent = (props) => {

    let { t } = useTranslation();
    let { setLogin } = props;
    //TODO: let [message, setMessage] = useState([]);
    let [error, setError] = useState({});
    let email = useRef("");
    let password = useRef("");
    let navigate = useNavigate();

    useEffect(() => {
        let checkInputErrors = () => {
            let updatedErrors = {};

            if (email.current.input.value === null || email.current.input.value?.trim() === '') {
                updatedErrors.email = updatedErrors.email === undefined ? [] : [...updatedErrors.email];
                updatedErrors.email.push(t("login.error.email.empty"));
            }
            if (email.current.input.value?.length < 3 || (email.current.input.value != null && !(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.current.input.value)))) {
                updatedErrors.email = updatedErrors.email === undefined ? [] : [...updatedErrors.email];
                updatedErrors.email.push(t("login.error.email.format"));
            }
            if (password.current.input.value === null || password.current.input.value?.trim() === '') {
                updatedErrors.password = updatedErrors.password === undefined ? [] : [...updatedErrors.password];
                updatedErrors.password.push(t("login.error.password.empty"));
            }
            if (password.current.input.value?.length < 5) {
                updatedErrors.password = updatedErrors.password === undefined ? [] : [...updatedErrors.password];
                updatedErrors.password.push(t("login.error.password.format"));
            }
            setError(updatedErrors);
        };

        checkInputErrors();
    }, [t]);

    let clickLogin = async () => {
        setLogin(true);
        navigate("/");
        email.current.input.value = "";
        password.current.input.value = "";
    };

    let { Text } = Typography;
    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                {/*message.length > 0 && message.map(e => { return <Alert type="error" message={e} showIcon />; })*/}
                <Card title={t("login.title")} style={{ width: "500px" }}>
                    <Input ref={email} size="large" type="text" placeholder={t("login.form.email")} />
                    {error.email && error.email.map(e => { return <Text type="danger">{e}<br /></Text>; })}
                    <Input ref={password} size="large" style={{ marginTop: "10px" }} type="password" placeholder={t("login.form.password")} />
                    {error.password && error.password.map(e => { return <Text type="danger">{e}<br /></Text>; })}
                    <Button type="primary" style={{ marginTop: "10px" }} block onClick={clickLogin}>{t("login.button")}</Button>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginComponent;