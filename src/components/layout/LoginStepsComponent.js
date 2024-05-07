import { Steps, Flex } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

let LoginStepsComponent = (props) => {

    let { current, setCurrent } = props;

    let { t } = useTranslation();

    let navigate = useNavigate();

    let items = [
        {
            title: t("steps.role")
        },
        {
            title: t("steps.login"),
            disabled: true
        }
    ];

    let onChange = (value) => {
        setCurrent(value);
        value === 0 && navigate("/");
    };

    return (
        <Flex justify="center">
            <Steps
                style={{ padding: "3vh 0vh 7vh", width: "40vmax" }}
                current={current}
                onChange={onChange}
                direction="horizontal"
                responsive={false}
                labelPlacement="vertical"
                items={items}
            />
        </Flex>
    );
};

export default LoginStepsComponent;