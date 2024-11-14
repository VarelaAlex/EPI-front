import { Button, Flex, Image } from "antd";
import { useTranslation }      from "react-i18next";
import { useNavigate }         from "react-router-dom";

let SelectRole = () => {

	let { t } = useTranslation();

	let navigate = useNavigate();

	return (
		<Flex justify="space-evenly" align="flex-start" style={ { width: "100%" } }>
			<Button  size="large" color="primary" variant="solid" block
			        style={ { width: "40%", height: "25vh", fontSize: "5vmin" } }
			        onClick={ () => navigate("/loginTeacher") }>
				<Flex vertical align="center" justify="space-between" gap={ 20 } style={ { paddingTop: "1vmax" } }>
					<Image alt={t("role.teacher")} src="icons/teacher.png" height="13vmin" width="13vmin" preview={ false }/>
					{ t("role.teacher").toUpperCase() }
				</Flex>
			</Button>
			<Button size="large" color="primary" variant="solid" block
			        style={ { width: "40%", height: "25vh", fontSize: "5vmin" } }
			        onClick={ () => navigate("/loginStudent") }>
				<Flex vertical align="center" justify="space-between" gap={ 20 } style={ { paddingTop: "1vmax" } }>
					<Image alt={t("role.student")} src="icons/student.png" height="13vmin" width="13vmin" preview={ false }/>
					{ t("role.student").toUpperCase() }
				</Flex>
			</Button>
		</Flex>
	);
};

export default SelectRole;