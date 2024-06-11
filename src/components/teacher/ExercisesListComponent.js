import { Empty, Button, Card, Table, Divider, Tooltip, Alert } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";
import { LineChartOutlined, DeleteOutlined } from "@ant-design/icons";
import { exercisesServiceURL } from "../../Globals";

let ExercisesList = (props) => {

    let { isMobile } = props;

    let [exercises, setExercises] = useState([]);
    let [message, setMessage] = useState(null);

    let { t } = useTranslation();
    let navigate = useNavigate();

    useEffect(() => {
        getExercises();
    }, []);

    const columns = [
        {
            title: t("exercises.table.title"),
            dataIndex: 'title',
            render: (title, exercise) => <Link to={"/exercises/exerciseDetail/" + exercise.id}>{title}</Link>,
            fixed: "left"
        },
        {
            title: t("exercises.table.category"),
            dataIndex: 'category',
            align: "center"
        },
        {
            title: t("exercises.table.networkType"),
            dataIndex: 'networkType',
            align: "center"
        },
        {
            title: t("exercises.table.representation"),
            dataIndex: 'representation',
            align: "center"
        },
        {
            title: t("exercises.table.language"),
            dataIndex: 'language',
            align: "center"
        },
        {
            title: "Actions",
            dataIndex: "_id",
            align: "center",
            render: (_id) => (isMobile ?
                <>
                    <Tooltip title={t("classrooms.table.tooltips.seeStatistics")} mouseEnterDelay="0.3" trigger={["hover", "focus"]}>
                        <Button onClick={() => navigate("/teachers/classroomStatistics/" + _id)} icon={<LineChartOutlined />} style={{ marginRight: "1vmax" }} />
                    </Tooltip>
                    <Tooltip title={t("classrooms.table.tooltips.delete")} mouseEnterDelay="0.3" trigger={["hover", "focus"]}>
                        <Button
                            danger
                            type="primary"
                            onClick={() => { deleteClassroom(_id); }}
                            icon={<DeleteOutlined />}
                        />
                    </Tooltip>
                </>
                : <>
                    <Button onClick={() => navigate("/teachers/classroomStatistics/" + _id)} style={{ marginBottom: "1vmax" }}> {t("classrooms.table.buttons.seeStatistics")}</Button >
                    <Button danger type="primary" onClick={() => { deleteClassroom(_id); }}> {t("classrooms.table.buttons.delete")}</Button >
                </>
            )
        }
    ];

    let deleteClassroom = async (id) => {
        let response = await fetch(exercisesServiceURL + "/exercises/" + id + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "DELETE"
        });
        if (response.ok) {
        }
        getExercises();
    };

    let getExercises = async () => {
        let response = await fetch(exercisesServiceURL + "/exercises/teacher?apiKey=" + localStorage.getItem("apiKey"));

        if (response.ok) {
            let jsonData = await response.json();
            setExercises(jsonData);
        } else {
            let jsonData = await response.json();
            if (Array.isArray(jsonData.error)) {
                setMessage(jsonData.error);
            } else {
                let finalError = [];
                finalError.push(jsonData.error);
                setMessage(finalError);
            }
        }
    };

    return (
        <Card title={t("exercises.table.title")} style={{ width: "90%" }}>
            {exercises.length <= 0 ?
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("exercises.table.empty")} />
                : <Table bordered columns={columns} dataSource={exercises} scroll={{ x: 900, y: 300, }} />
            }
            <Divider orientation="left">{t("exercises.addClassroom.divider")}</Divider>
            {message?.error?.type && <Alert type="error" message={t(message?.error?.type)} showIcon style={{ marginBottom: "1vh" }} />}
            <Button type="primary" onClick={() => { navigate("/teachers/create"); }}>Crear nuevo ejercicio</Button>
        </Card>
    );
};

export default ExercisesList;