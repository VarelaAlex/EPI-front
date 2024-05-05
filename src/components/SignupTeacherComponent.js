import { Button, Form, Input, Card } from 'antd';
import { useTranslation } from 'react-i18next';
const SignupTeacherComponent = (props) => {

    let { setLogin } = props;

    let { t } = useTranslation();

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
                            message: 'Please input your nickname!',
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
                            message: 'Please input your nickname!',
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
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
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
                            message: 'Please input your password!',
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
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
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
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};
export default SignupTeacherComponent;