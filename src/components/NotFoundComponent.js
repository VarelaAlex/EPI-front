import { useTranslation } from 'react-i18next';
import { Flex, Typography } from "antd";

let NotFound = () => {

    let { t } = useTranslation();
    let { Title } = Typography;

    return (
        <Flex align="center" vertical style={{ width: "80%", height: "80vh" }}>
            <Title>{t("pageNotFound.message1")}</Title>
            <Title level={2}>{t("pageNotFound.message2")}</Title>
        </Flex>
    );
};

export default NotFound;