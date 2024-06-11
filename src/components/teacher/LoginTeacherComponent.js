import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, Input, Typography, Form, Alert } from "antd";
import { usersServiceURL } from '../../Globals';
import { useState } from 'react';

let LoginTeacher = (props) => {

    let { setLogin } = props;

    let { t } = useTranslation();
    let { Text } = Typography;

    let [message, setMessage] = useState(null);

    let navigate = useNavigate();

    let onFinish = async (values) => {
        let { email, password } = values;

        let response = null;
        try {
            response = await fetch(usersServiceURL + "/teachers/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password
                })
            });
        } catch (e) {
            setMessage({ error: { type: "internalServerError", message: e } });
            return;
        }

        let jsonData = await response?.json();
        if (response?.ok) {
            if (jsonData?.apiKey != null) {
                localStorage.setItem("apiKey", jsonData.apiKey);
                localStorage.setItem("name", jsonData.name);
                localStorage.setItem("idUser", jsonData.id);
                localStorage.setItem("email", jsonData.email);
                localStorage.setItem("role", "T");
                setLogin(true);
                navigate("/teachers/menuTeacher");
            }
        } else {
            setMessage({ error: jsonData?.error });
        }
    };

    return (
        <Card title={t("login.title")} style={{ width: "80vw" }}>
            {message?.error?.type && <Alert type="error" message={t(message?.error?.type)} showIcon style={{ marginBottom: "1vh" }} />}
            <Form
                name="login"
                labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
                wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="email"
                    label={t("login.form.label.email")}
                    rules={[
                        {
                            type: 'email',
                            message: t("login.error.email.format"),
                        },
                        {
                            required: true,
                            message: t("login.error.email.empty"),
                        }
                    ]}
                    validateStatus={message?.error?.email ? 'error' : undefined}
                    help={message?.error?.email ? t(message?.error?.email) : undefined}
                    hasFeedback
                >
                    <Input placeholder={t("login.form.placeholder.email")} onInput={() => setMessage(null)} />
                </Form.Item>
                <Form.Item
                    name="password"
                    label={t("login.form.label.password")}
                    rules={[
                        {
                            required: true,
                            message: t("login.error.password.empty"),
                        }
                    ]}
                    validateStatus={message?.error?.password ? 'error' : undefined}
                    help={message?.error?.password ? t(message?.error?.password) : undefined}
                    hasFeedback
                >
                    <Input.Password placeholder={t("login.form.placeholder.password")} onInput={() => setMessage(null)} />
                </Form.Item>
                <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }}>
                    <Button type="primary" htmlType="submit">
                        {t("login.button")}
                    </Button>
                </Form.Item>
            </Form>
            <Text style={{ paddingTop: "2vh" }}>
                {t("login.registerMessage")} <Link to="/registerTeacher">{t("login.registerLink")}</Link>
            </Text>
        </Card>
    );
};

export default LoginTeacher;