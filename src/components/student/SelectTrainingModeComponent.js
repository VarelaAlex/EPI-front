import { Button, Flex, Image } from "antd";
import { useTranslation }      from "react-i18next";
import { useNavigate }         from "react-router-dom";

let SelectTrainingMode = () => {

    let { t } = useTranslation();

    let navigate = useNavigate();

    return (
        <Flex justify="space-evenly" align="flex-start" style={ { width: "100%" } }>
            <Button  size="large" color="primary" variant="solid" block
                     style={ { width: "40%", height: "25vh", fontSize: "5vmin" } }
                     onClick={ () => navigate("/students/exercises/free") }>
                <Flex vertical align="center" justify="space-between" gap={ 20 } style={ { paddingTop: "1vmax" } }>
                    <Image alt={t("student.trainingMode.free")} src="/icons/free.png" height="13vmin" width="13vmin" preview={ false }/>
                    { t("student.trainingMode.free").toUpperCase() }
                </Flex>
            </Button>
            <Button size="large" color="primary" variant="solid" block
                    style={ { width: "40%", height: "25vh", fontSize: "5vmin" } }
                    onClick={ () => navigate("/students/exercises/ruled") }>
                <Flex vertical align="center" justify="space-between" gap={ 20 } style={ { paddingTop: "1vmax" } }>
                    <Image alt={t("student.trainingMode.ruled")} src="/icons/ruled.png" height="13vmin" width="13vmin" preview={ false }/>
                    { t("student.trainingMode.ruled").toUpperCase() }
                </Flex>
            </Button>
        </Flex>
    );
};

export default SelectTrainingMode;