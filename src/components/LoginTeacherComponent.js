import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, Input, Typography, Form } from "antd";

let LoginTeacherComponent = (props) => {

    let { setLogin } = props;

    let { t } = useTranslation();
    let { Text } = Typography;

    let navigate = useNavigate();

    let onFinish = async () => {
        setLogin(true);
        navigate("/menuTeacher");
    };

    return (
        <Card title={t("login.title")} style={{ width: "80vw" }}>
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
                        },
                    ]}
                    hasFeedback
                >
                    <Input placeholder={t("login.form.placeholder.email")} />
                </Form.Item>
                <Form.Item
                    name="password"
                    label={t("login.form.label.password")}
                    rules={[
                        {
                            required: true,
                            message: t("login.error.password.empty"),
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        placeholder={t("login.form.placeholder.password")}
                    />
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

export default LoginTeacherComponent;