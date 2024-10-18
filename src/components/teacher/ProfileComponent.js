import { Button, Card, Input, Form, Alert } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

let Profile = () => {

    let [form] = useForm();
    let [message, setMessage] = useState(null);
    let navigate = useNavigate();

    let { t } = useTranslation();

    useEffect(() => {
        let getProfile = async () => {

            try {
                let response = await fetch(
                    process.env.REACT_APP_USERS_SERVICE_URL + "/teachers/profile",
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                    }
                );

                let jsonData = await response.json();

                if (response.ok) {
                    form.setFieldsValue({
                        name: jsonData.name,
                        lastName: jsonData.lastName,
                        email: jsonData.email
                    });
                } else {
                    setMessage(Array.isArray(jsonData.error) ? jsonData.error : [jsonData.error]);
                }
            } catch (error) {
            }
        };

        getProfile();
    }, [form]);


    let onFinish = async (values) => {
        let { name, lastName, email } = values;

        let response = null;
        try {
            response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/teachers/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    name,
                    lastName,
                    email
                })
            });
        } catch (e) {
            setMessage({ error: { type: "internalServerError", message: e } });
            return;
        }

        let jsonData = await response?.json();
        if (response?.ok) {
            navigate("/menuTeacher");
        } else {
            setMessage({ error: jsonData?.error });
        }
    };

    return (
        <Card title={t("profile.title")} style={{ width: "90vw" }}>
            {message?.error?.type && <Alert type="error" message={t(message?.error?.type)} showIcon style={{ marginBottom: "1vh" }} />}
            <Form
                form={form}
                name="modifyProfile"
                labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
                wrapperCol={{ xs: { span: 14 }, sm: { span: 6 } }}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="name"
                    label={t("profile.label.name")}
                    rules={[
                        {
                            required: true,
                            message: t("profile.error.name")
                        },
                    ]}
                    validateStatus={message?.error?.name ? 'error' : undefined}
                    help={message?.error?.name ? t(message?.error?.name) : undefined}
                    hasFeedback
                >

                    <Input placeholder={t("profile.placeholder.name")} onInput={() => setMessage(null)} />
                </Form.Item>
                <Form.Item
                    name="lastName"
                    label={t("profile.label.lastName")}
                    rules={[
                        {
                            required: true,
                            message: t("profile.error.lastName")
                        },
                    ]}
                    validateStatus={message?.error?.lastName ? 'error' : undefined}
                    help={message?.error?.lastName ? t(message?.error?.lastName) : undefined}
                    hasFeedback
                >
                    <Input placeholder={t("profile.placeholder.lastName")} onInput={() => setMessage(null)} />
                </Form.Item>
                <Form.Item
                    name="email"
                    label={t("profile.label.email")}
                    rules={[
                        {
                            type: 'email',
                            message: t("profile.error.email.format"),
                        },
                        {
                            required: true,
                            message: t("profile.error.email.empty"),
                        },
                    ]}
                    validateStatus={message?.error?.email ? 'error' : undefined}
                    help={message?.error?.email ? t(message?.error?.email) : undefined}
                    hasFeedback
                >
                    <Input placeholder={t("profile.placeholder.email")} onInput={() => setMessage(null)} />
                </Form.Item>
                <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } }}>
                    <Button type="primary" htmlType="submit">
                        {t("profile.button")}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default Profile;