import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, Flex, Input, Typography, Form } from "antd";

let LoginTeacherComponent = (props) => {

    let { setLogin } = props;

    let { t } = useTranslation();
    let { Text } = Typography;

    let onFinish = async () => {
        setLogin(true);
    };

    return (
        <Flex align="center" justify="center" vertical>
            <Card title={t("login.title")} style={{ width: "80vmin" }}>
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
            </Card>
            <Text style={{ paddingTop: "4vh" }}>
                {t("login.registerMessage")} <Link to="/registerTeacher">{t("login.registerLink")}</Link>
            </Text>
        </Flex>
    );
};

export default LoginTeacherComponent;