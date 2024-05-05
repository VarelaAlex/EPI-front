import { useTranslation } from 'react-i18next';
import { Button, Card, Flex, Input, Form } from "antd";

let LoginStudentComponent = (props) => {

    let { setLogin } = props;

    let { t } = useTranslation();

    let onFinish = async () => {
        setLogin(true);
    };

    return (
            <Card title={t("login.title")} style={{ width: "80vmin" }}>
                <Form
                    name="login"
                    labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
                    wrapperCol={{ xs: { span: 24 }, sm: { span: 18 } }}
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Form.Item
                        name="email"
                        label={t("login.form.label.username")}
                        rules={[
                            {
                                required: true,
                                message: t("login.error.username.empty"),
                            },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder={t("login.form.placeholder.username")} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } }}>
                        <Button type="primary" htmlType="submit">
                            {t("login.button")}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
    );
};

export default LoginStudentComponent;