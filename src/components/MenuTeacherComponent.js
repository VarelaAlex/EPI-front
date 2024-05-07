import { Card } from "antd";
import { useTranslation } from 'react-i18next';

let MenuTeacherComponent = () => {

    let { t } = useTranslation();

    return (
        <Card title={t("menuTeacher.classrooms")} style={{ width: "80vw" }}></Card>
    );
};

export default MenuTeacherComponent;