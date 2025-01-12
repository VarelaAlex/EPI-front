import { Button, Form, Input, Card, Alert, Steps, Select } from 'antd';
import {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {useNavigate} from "react-router-dom";

const { Step } = Steps;
const { Option } = Select;

const SignupTeacher = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [message, setMessage] = useState(null);
    const [communities, setCommunities] = useState([]);

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

    const steps = [
        {
            title: t("signup.steps.basicInfo"),
            content: (
                <>
                    <Form.Item
                        name="name"
                        label={t("signup.form.label.name")}
                        rules={[
                            { required: true, message: t("signup.error.name"), whitespace: true },
                        ]}
                    >
                        <Input placeholder={t("signup.form.placeholder.name")} />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label={t("signup.form.label.lastName")}
                        rules={[
                            { required: true, message: t("signup.error.lastName"), whitespace: true },
                        ]}
                    >
                        <Input placeholder={t("signup.form.placeholder.lastName")} />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label={t("signup.form.label.email")}
                        rules={[
                            { type: 'email', message: t("signup.error.email.format") },
                            { required: true, message: t("signup.error.email.empty") },
                        ]}
                    >
                        <Input placeholder={t("signup.form.placeholder.email")} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label={t("signup.form.label.password")}
                        rules={[
                            { required: true, message: t("signup.error.password.empty") },
                            {
                                pattern: /^(?=.*[\d])(?=.*[!@#$%&*])[\w!@#$%&*]{8,12}$/,
                                message: t("signup.error.password.format"),
                            },
                        ]}
                    >
                        <Input.Password placeholder="******" />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label={t("signup.form.label.confirm")}
                        dependencies={['password']}
                        rules={[
                            { required: true, message: t("signup.error.password.confirm") },
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
                        <Input.Password placeholder="******" />
                    </Form.Item>
                </>
            ),
        },
        {
            title: t("signup.steps.additionalInfo"),
            content: (
                <>
                    <Form.Item
                        name="teachingStage"
                        label={t("signup.form.label.teachingStage")}
                        rules={[{ required: true, message: t("signup.error.teachingStage") }]}
                    >
                        <Select placeholder={t("signup.form.placeholder.teachingStage")}>
                            <Option value="infantil">{t("signup.form.options.infantil")}</Option>
                            <Option value="primaria">{t("signup.form.options.primaria")}</Option>
                            <Option value="secundaria">{t("signup.form.options.secundaria")}</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="schoolType"
                        label={t("signup.form.label.schoolType")}
                        rules={[{ required: true, message: t("signup.error.schoolType") }]}
                    >
                        <Select placeholder={t("signup.form.placeholder.schoolType")}>
                            <Option value="public">{t("signup.form.options.public")}</Option>
                            <Option value="concertado">{t("signup.form.options.concertado")}</Option>
                            <Option value="private">{t("signup.form.options.private")}</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="schoolLocation"
                        label={t("signup.form.label.schoolLocation")}
                        rules={[{ required: true, message: t("signup.error.schoolLocation") }]}
                    >
                        <Select placeholder={t("signup.form.placeholder.schoolLocation")}>
                            <Option value="rural">{t("signup.form.options.rural")}</Option>
                            <Option value="urban">{t("signup.form.options.urban")}</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label={t("signup.form.label.gender")}
                        rules={[{ required: true, message: t("signup.error.gender") }]}
                    >
                        <Select placeholder={t("signup.form.placeholder.gender")}>
                            <Option value="male">{t("signup.form.options.male")}</Option>
                            <Option value="female">{t("signup.form.options.female")}</Option>
                            <Option value="nonBinary">{t("signup.form.options.nonBinary")}</Option>
                            <Option value="preferNotToSay">{t("signup.form.options.preferNotToSay")}</Option>
                        </Select>
                    </Form.Item>
                </>
            ),
        },
        {
            title: t("signup.steps.finalInfo"),
            content: (
                <>
                    <Form.Item
                        name="experienceYears"
                        label={t("signup.form.label.experienceYears")}
                        rules={[
                            { required: true, message: t("signup.error.experienceYears") },
                        ]}
                    >
                        <Input type="number" placeholder={t("signup.form.placeholder.experienceYears")} />
                    </Form.Item>
                    <Form.Item
                        name="community"
                        label={t('signup.form.label.community')}
                        rules={[{ required: true, message: t('signup.error.community.empty') }]}
                    >
                        <Select placeholder={t('signup.form.placeholder.community')}>
                            {communities.map((community) => (
                                <Select.Option key={community.Id} value={community.Nombre}>
                                    {community.Nombre}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </>
            ),
        },
    ];

    const onNext = () => {
        form
            .validateFields()
            .then(() => {
                setMessage(null);
                setCurrentStep(currentStep + 1);
            })
            .catch(() => setMessage({ error: { type: "validationError" } }));
    };

    const onPrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const onFinish = async () => {
        const {
            name,
            lastName,
            email,
            password,
            teachingStage,
            schoolType,
            schoolLocation,
            gender,
            experienceYears,
            community
        } = form.getFieldsValue(true);

        let response = null;

        try {
            // Llamada al servicio para registrar al profesor
            response = await fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/teachers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Token de autenticación
                },
                body: JSON.stringify({
                    name,
                    lastName,
                    email,
                    password,
                    teachingStage,
                    schoolType,
                    schoolLocation,
                    gender,
                    experienceYears: parseInt(experienceYears, 10), // Asegurarse de que sea un número
                    community
                }),
            });
        } catch (error) {
            console.error("Error al intentar conectarse al servidor:", error);
            setMessage({ error: { type: "internalServerError", message: error.message } });
            return;
        }

        // Parsear la respuesta del servidor
        let jsonData;
        try {
            jsonData = await response.json();
        } catch (error) {
            console.error("Error al intentar parsear la respuesta del servidor:", error);
            setMessage({ error: { type: "invalidServerResponse", message: error.message } });
            return;
        }

        // Manejo de la respuesta del servidor
        if (response.ok) {
            setMessage(null); // Limpia cualquier mensaje previo
            console.log("Usuario creado exitosamente:", jsonData);
            navigate("/loginTeacher"); // Redirige al login de profesor
        } else {
            console.error("Error al crear usuario:", jsonData);
            setMessage({ error: jsonData?.error || { type: "unknownError" } });
        }
    };

    return (
        <Card title={t("signup.title")} style={{ width: "80vw" }}>
            {message?.error?.type && (
                <Alert
                    type="error"
                    message={t(message?.error?.type)}
                    showIcon
                    style={{ marginBottom: "1vh" }}
                />
            )}
            <Steps current={currentStep}>
                {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <Form
                form={form}
                name="signup"
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ remember: true }}
                style={{ marginTop: "2rem" }}
            >
                {steps[currentStep].content}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
                    {currentStep > 0 && (
                        <Button onClick={onPrev}>{t("signup.button.prev")}</Button>
                    )}
                    {currentStep < steps.length - 1 && (
                        <Button type="primary" onClick={onNext}>
                            {t("signup.button.next")}
                        </Button>
                    )}
                    {currentStep === steps.length - 1 && (
                        <Button type="primary" htmlType="submit">
                            {t("signup.button.submit")}
                        </Button>
                    )}
                </div>
            </Form>
        </Card>
    );
};

export default SignupTeacher;
