import { Button, Form, Input, Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
const SignupTeacherComponent = (props) => {

    let { setLogin } = props;

    let { t } = useTranslation();
    let { Text } = Typography;

    let onFinish = async () => {
        setLogin(true);
    };

    return (
        <Card title={t("signup.title")} style={{ width: "80vw" }}>
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
                >
                    <Input placeholder={t("signup.form.placeholder.name")} />
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
                >
                    <Input placeholder={t("signup.form.placeholder.lastName")} />
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
                    hasFeedback
                >
                    <Input placeholder={t("signup.form.placeholder.email")} />
                </Form.Item>

                <Form.Item
                    name="password"
                    label={t("signup.form.label.password")}
                    rules={[
                        {
                            required: true,
                            message: t("signup.error.password.empty"),
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        placeholder={t("signup.form.placeholder.password")}
                    />
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