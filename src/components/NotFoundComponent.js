import { useTranslation } from 'react-i18next';
import { Flex, Typography } from "antd";

let NotFound = () => {

    let { t } = useTranslation();
    let { Title } = Typography;

    return (
        <Flex align="center" vertical style={{ width: "80%", height: "40vh" }}>
            <Flex justify="space-evenly" align="center" style={{ width: "100%" }} >
                <Title>{t("pageNotFound")}</Title>
            </Flex>
        </Flex>
    );
};

export default NotFound;