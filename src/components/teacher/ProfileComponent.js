import { Button, Card, Input, Form, Alert, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

let Profile = () => {
    const [form] = useForm();
    const [message, setMessage] = useState(null);
    const [communities, setCommunities] = useState([]);

    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const response = await fetch('https://servicios.ine.es/wstempus/js/ES/VALORES_VARIABLE/70');
                const data = await response.json();
                const filteredCommunities = data
                    .filter(item => item.Codigo && item.Codigo !== "" && item.Codigo !== "00" && item.Codigo !== "00000")
                    .map(item => ({
                        ...item,
                        Nombre: transformName(item.Nombre) // Apply transformation
                    })).sort((a, b) => a.Nombre.localeCompare(b.Nombre));
                setCommunities(filteredCommunities);
            } catch (error) {
                console.error('Error fetching communities:', error);
            }
        };
        fetchCommunities();
    }, []);

    let transformName = (name) => {
        const parts = name.split(",").map(part => part.trim());
        if (parts.length === 2) {
            return `${parts[1]} ${parts[0]}`;
        }
        return name; // Return the name unchanged if it doesn't match the expected format
    }

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_USERS_SERVICE_URL}/teachers/profile`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                    }
                );
                const jsonData = await response.json();

                if (response.ok) {
                    form.setFieldsValue({
                        name: jsonData.name,
                        lastName: jsonData.lastName,
                        email: jsonData.email,
                        teachingStage: jsonData.teachingStage,
                        schoolType: jsonData.schoolType,
                        schoolLocation: jsonData.schoolLocation,
                        gender: jsonData.gender,
                        experienceYears: jsonData.experienceYears,
                        community: jsonData.community,
                    });
                } else {
                    setMessage(Array.isArray(jsonData.error) ? jsonData.error : [jsonData.error]);
                }
            } catch (error) {
                setMessage({ error: { type: "internalServerError", message: error.message } });
            }
        };

        getProfile();
    }, [form]);

    const onFinish = async (values) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_USERS_SERVICE_URL}/teachers/profile`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    body: JSON.stringify(values),
                }
            );

            const jsonData = await response.json();

            if (response.ok) {
                navigate("/menuTeacher");
            } else {
                setMessage({ error: jsonData.error });
            }
        } catch (e) {
            setMessage({ error: { type: "internalServerError", message: e.message } });
        }
    };

    return (
        <Card title={t("profile.title")} style={{ width: "90vw" }}>
            {message?.error?.type && (
                <Alert
                    type="error"
                    message={t(message?.error?.type)}
                    showIcon
                    style={{ marginBottom: "1vh" }}
                />
            )}
            <Form
                form={form}
                name="modifyProfile"
                labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
                wrapperCol={{ xs: { span: 14 }, sm: { span: 6 } }}
                onFinish={onFinish}
                scrollToFirstError
            >
                {/* Basic Info */}
                <Form.Item
                    name="name"
                    label={t("profile.label.name")}
                    rules={[{ required: true, message: t("profile.error.name"), whitespace: true }]}
                >
                    <Input placeholder={t("profile.placeholder.name")} />
                </Form.Item>
                <Form.Item
                    name="lastName"
                    label={t("profile.label.lastName")}
                    rules={[{ required: true, message: t("profile.error.lastName"), whitespace: true }]}
                >
                    <Input placeholder={t("profile.placeholder.lastName")} />
                </Form.Item>
                <Form.Item
                    name="email"
                    label={t("profile.label.email")}
                    rules={[
                        { type: "email", message: t("profile.error.email.format") },
                        { required: true, message: t("profile.error.email.empty") },
                    ]}
                >
                    <Input placeholder={t("profile.placeholder.email")} />
                </Form.Item>

                {/* Additional Info */}
                <Form.Item
                    name="teachingStage"
                    label={t("profile.label.teachingStage")}
                    rules={[{ required: true, message: t("profile.error.teachingStage") }]}
                >
                    <Select placeholder={t("profile.placeholder.teachingStage")}>
                        <Option value="infantil">{t("profile.options.infantil")}</Option>
                        <Option value="primaria">{t("profile.options.primaria")}</Option>
                        <Option value="secundaria">{t("profile.options.secundaria")}</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="schoolType"
                    label={t("profile.label.schoolType")}
                    rules={[{ required: true, message: t("profile.error.schoolType") }]}
                >
                    <Select placeholder={t("profile.placeholder.schoolType")}>
                        <Option value="public">{t("profile.options.public")}</Option>
                        <Option value="concertado">{t("profile.options.concertado")}</Option>
                        <Option value="private">{t("profile.options.private")}</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="schoolLocation"
                    label={t("profile.label.schoolLocation")}
                    rules={[{ required: true, message: t("profile.error.schoolLocation") }]}
                >
                    <Select placeholder={t("profile.placeholder.schoolLocation")}>
                        <Option value="rural">{t("profile.options.rural")}</Option>
                        <Option value="urban">{t("profile.options.urban")}</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="gender"
                    label={t("profile.label.gender")}
                    rules={[{ required: true, message: t("profile.error.gender") }]}
                >
                    <Select placeholder={t("profile.placeholder.gender")}>
                        <Option value="male">{t("profile.options.male")}</Option>
                        <Option value="female">{t("profile.options.female")}</Option>
                        <Option value="nonBinary">{t("profile.options.nonBinary")}</Option>
                        <Option value="preferNotToSay">{t("profile.options.preferNotToSay")}</Option>
                    </Select>
                </Form.Item>

                {/* Final Info */}
                <Form.Item
                    name="experienceYears"
                    label={t("profile.label.experienceYears")}
                    rules={[{ required: true, message: t("profile.error.experienceYears") }]}
                >
                    <Input type="number" placeholder={t("profile.placeholder.experienceYears")} />
                </Form.Item>
                <Form.Item
                    name="community"
                    label={t("profile.label.community")}
                    rules={[{ required: true, message: t("profile.error.community.empty") }]}
                >
                    <Select placeholder={t("profile.placeholder.community")}>
                        {communities.map((community) => (
                            <Select.Option key={community.Id} value={community.Nombre}>
                                {community.Nombre}
                            </Select.Option>
                        ))}
                    </Select>
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