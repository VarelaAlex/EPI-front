import { Button, Form, Input, Card, Typography, Alert } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { usersServiceURL } from '../../Globals';

const SignupTeacherComponent = () => {

    let { t } = useTranslation();
    let { Text } = Typography;

    let [message, setMessage] = useState(null);

    let navigate = useNavigate();

    let onFinish = async (values) => {
        let { name, lastName, email, password } = values;

        let response = null;
        try {
            response = await fetch(usersServiceURL + "/teachers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    lastName,
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
            navigate("/loginTeacher");
        } else {
            setMessage({ error: jsonData?.error });
        }
    };

    return (
        <Card title={t("signup.title")} style={{ width: "80vw" }}>
            {message?.error?.type && <Alert type="error" message={t(message?.error?.type)} showIcon style={{ marginBottom: "1vh" }} />}
            <Form
                name="register"
                labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
                wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="name"
                    label={t("signup.form.label.name")}
                    rules={[
                        {
                            required: true,
                            message: t("signup.error.name"),
                            whitespace: true,
                        },
                    ]}
                    validateStatus={message?.error?.name ? 'error' : undefined}
                    help={message?.error?.name ? t(message?.error?.name) : undefined}
                    hasFeedback
                >
                    <Input placeholder={t("signup.form.placeholder.name")} onInput={() => setMessage(null)} />
                </Form.Item>
                <Form.Item
                    name="lastName"
                    label={t("signup.form.label.lastName")}
                    rules={[
                        {
                            required: true,
                            message: t("signup.error.lastName"),
                            whitespace: true,
                        },
                    ]}
                    validateStatus={message?.error?.lastName ? 'error' : undefined}
                    help={message?.error?.lastName ? t(message?.error?.lastName) : undefined}
                    hasFeedback
                >
                    <Input placeholder={t("signup.form.placeholder.lastName")} onInput={() => setMessage(null)} />
                </Form.Item>
                <Form.Item
                    name="email"
                    label={t("signup.form.label.email")}
                    rules={[
                        {
                            type: 'email',
                            message: t("signup.error.email.format"),
                        },
                        {
                            required: true,
                            message: t("signup.error.email.empty"),
                        },
                    ]}
                    validateStatus={message?.error?.email ? 'error' : undefined}
                    help={message?.error?.email ? t(message?.error?.email) : undefined}
                    hasFeedback
                >
                    <Input placeholder={t("signup.form.placeholder.email")} onInput={() => setMessage(null)} />
                </Form.Item>

                <Form.Item
                    name="password"
                    label={t("signup.form.label.password")}
                    rules={[
                        {
                            required: true,
                            message: t("signup.error.password.empty"),
                        },
                        {
                            pattern: /^(?=.*[\d])(?=.*[!@#$%&*])[\w!@#$%&*]{8,12}$/,
                            message:
                                <>
                                    {t("signup.error.password.format.mustHave")} <br />
                                    <span style={{ marginLeft: "2vmax" }} /> {t("signup.error.password.format.between")}  <br />
                                    <span style={{ marginLeft: "2vmax" }} />{t("signup.error.password.format.digit")} <br />
                                    <span style={{ marginLeft: "2vmax" }} />{t("signup.error.password.format.special")}
                                </>
                        }
                    ]}
                    validateStatus={message?.error?.password ? 'error' : undefined}
                    help={message?.error?.password ? t(message?.error?.password) : undefined}
                    hasFeedback
                >
                    <Input.Password
                        placeholder={t("signup.form.placeholder.password")} onInput={() => setMessage(null)} />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label={t("signup.form.label.confirm")}
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: t("signup.error.password.confirm"),
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t("signup.error.password.unmatch")));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        placeholder={t("login.form.placeholder.password")}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }}>
                    <Button type="primary" htmlType="submit">
                        {t("signup.button")}
                    </Button>
                </Form.Item>
            </Form>
            <Text style={{ paddingTop: "2vh" }}>
                {t("signup.loginMessage")} <Link to="/loginTeacher">{t("signup.loginLink")}</Link>
            </Text>
        </Card>
    );
};
export default SignupTeacherComponent;