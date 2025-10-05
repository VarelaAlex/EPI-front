import { Button, Flex, Image } from "antd";
import { useTranslation }      from "react-i18next";
import { useNavigate }         from "react-router-dom";

let SelectMode = () => {

    let { t } = useTranslation();

    let navigate = useNavigate();

    return (
        <Flex justify="space-evenly" align="flex-start" style={ { width: "100%" } }>
            <Button  size="large" color="primary" variant="solid" block
                     style={ { width: "40%", height: "25vh", fontSize: "5vmin" } }
                     onClick={ () => navigate("/students/pretraining/block/1/activity/1") }>
                <Flex vertical align="center" justify="space-between" gap={ 20 } style={ { paddingTop: "1vmax" } }>
                    <Image alt={t("student.mode.pretraining")} src="/icons/crawl.png" height="13vmin" width="13vmin" preview={ false }/>
                    { t("student.mode.pretraining").toUpperCase() }
                </Flex>
            </Button>
            <Button size="large" color="primary" variant="solid" block
                    style={ { width: "40%", height: "25vh", fontSize: "5vmin" } }
                    onClick={ () => navigate("/students/exercises") }>
                <Flex vertical align="center" justify="space-between" gap={ 20 } style={ { paddingTop: "1vmax" } }>
                    <Image alt={t("student.mode.training")} src="/icons/running.png" height="13vmin" width="13vmin" preview={ false }/>
                    { t("student.mode.training").toUpperCase() }
                </Flex>
            </Button>
        </Flex>
    );
};

export default SelectMode;