import {Empty, Button, Card, Table, Divider, Input, Tooltip, Form, Alert, Spin, Cascader} from "antd";
import {useEffect, useState} from "react";
import {useTranslation} from 'react-i18next';
import {Link, useNavigate} from "react-router-dom";
import {LineChartOutlined, DeleteOutlined} from "@ant-design/icons";

let ClassroomsList = (props) => {

    let {isMobile, setClassroomId} = props;

    let [loading, setLoading] = useState(true);
    let [classrooms, setClassrooms] = useState([]);
    let [message, setMessage] = useState(null);

    let {t} = useTranslation();
    let navigate = useNavigate();

    const options = [
        {
            value: 'EI',
            label: 'Educación Infantil',
            children: [
                {value: "1", label: "3 años de Educación Infantil"},
                {value: "2", label: "4 años de Educación Infantil"},
                {value: "3", label: "5 años de Educación Infantil"}
            ],
        },
        {
            value: 'EP',
            label: 'Educación Primaria',
            children: [
                {value: "1", label: "1º de Educación Primaria"},
                {value: "2", label: "2º de Educación Primaria"},
                {value: "3", label: "3º de Educación Primaria"},
                {value: "4", label: "4º de Educación Primaria"},
                {value: "5", label: "5º de Educación Primaria"},
                {value: "6", label: "6º de Educación Primaria"}
            ],
        },
    ];

    useEffect(() => {
        getClassrooms();
    }, []);

    const columns = [
        {
            title: t("classrooms.table.className"),
            dataIndex: 'name',
            render: (name) => {
                return <Link to={"/teachers/classroomDetail/" + name}>{name}</Link>;
            }
        },
        {
            title: t("classrooms.table.numberStudents"),
            dataIndex: 'numberStudents',
            align: "center"
        },
        {
            title: "Actions",
            dataIndex: "name",
            align: "right",
            render: (name, classroom) => (
                isMobile ?
                    <div style={{float: "right"}}>
                        <Tooltip title={t("classrooms.table.tooltips.seeStatistics")} mouseEnterDelay="0.3"
                                 trigger={["hover", "focus"]}>
                            <Button onClick={() => {
                                setClassroomId(classroom.id);
                                navigate("/teachers/classroomStats/" + name);
                            }} icon={<LineChartOutlined/>} style={{marginRight: "1vmax"}}/>
                        </Tooltip>
                        <Tooltip title={t("classrooms.table.tooltips.delete")} mouseEnterDelay="0.3"
                                 trigger={["hover", "focus"]}>
                            <Button
                                danger
                                type="primary"
                                onClick={() => deleteClassroom(name)}
                                icon={<DeleteOutlined/>}
                            />
                        </Tooltip>
                    </div>
                    : <div style={{float: "right"}}>
                        <Button onClick={() => {
                            setClassroomId(classroom.id);
                            navigate("/teachers/classroomStats/" + name);
                        }} style={{marginRight: "1vmax"}}> {t("classrooms.table.buttons.seeStatistics")}</Button>
                        <Button danger type="primary"
                                onClick={() => deleteClassroom(name)}> {t("classrooms.table.buttons.delete")}</Button>
                    </div>
            )
        }
    ];

    let getClassrooms = async () => {
        setLoading(true);
        let response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms/list",
            {
                method: "GET",
                headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
            }
        );

        if (response.ok) {
            let jsonData = await response.json();
            setClassrooms(jsonData);
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
        setLoading(false);
    };

    let onFinish = async (values) => {
        let {name, level} = values;

        let levelValue = level[1] + '-' + level[0];

        let response = null;
        try {
            response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    name,
                    level: levelValue,
                })
            });
        } catch (e) {
            setMessage({error: {type: "internalServerError", message: e}});
            return;
        }

        let jsonData = await response?.json();
        if (response?.ok) {
            if (jsonData?.classroom != null) {
            }
        } else {
            setMessage({error: jsonData?.error});
        }
        getClassrooms();
    };

    let deleteClassroom = async (name) => {
        await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms/" + name, {
            method: "DELETE",
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        });
        getClassrooms();
    };

    return (
        <Spin spinning={loading} tip="Loading" size="large">
            <Card title={t("classrooms.table.title")} style={{width: "90vw"}}>
                {classrooms.length <= 0 ?
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("classrooms.table.empty")}/>
                    : <Table bordered columns={columns} dataSource={classrooms}/>
                }
                <Divider orientation="left">{t("classrooms.addClassroom.divider")}</Divider>
                {message?.error?.type &&
                    <Alert type="error" message={t(message?.error?.type)} showIcon style={{marginBottom: "1vh"}}/>}
                <Form
                    name="addClassroom"
                    labelCol={{xs: {span: 24}, sm: {span: 6}}}
                    wrapperCol={{xs: {span: 24}, sm: {span: 18}}}
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Form.Item
                        name="name"
                        label={t("classrooms.addClassroom.label")}
                        rules={[
                            {
                                required: true,
                                message: t("classrooms.addClassroom.error")
                            },
                        ]}
                        validateStatus={message?.error?.name ? 'error' : undefined}
                        help={message?.error?.name ? t(message?.error?.name) : undefined}
                        hasFeedback
                    >
                        <Input placeholder={t("classrooms.addClassroom.placeholder")} onInput={() => setMessage(null)}/>
                    </Form.Item>
                    <Form.Item
                        name="level"
                        label={t('signup.form.label.level')}
                        rules={[{required: true, message: t('signup.error.level.empty')}]}
                    >
                        <Cascader
                            placeholder={t("classrooms.level.placeholder")}
                            options={options}
                            expandTrigger="hover"
                            displayRender={(labels) => labels[labels.length - 1]}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{xs: {span: 24, offset: 0}, sm: {span: 16, offset: 6}}}>
                        <Button type="primary" htmlType="submit">
                            {t("classrooms.addClassroom.button")}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Spin>
    );
};

export default ClassroomsList;