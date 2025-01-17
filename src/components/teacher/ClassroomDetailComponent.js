import {
    Empty,
    Button,
    Card,
    Table,
    Divider,
    Input,
    Tooltip,
    Form,
    Alert,
    Spin,
    InputNumber,
    Space,
    Row,
    Typography,
    Cascader
} from "antd";
import {useCallback, useEffect, useState} from "react";
import {useTranslation} from 'react-i18next';
import {Link, useNavigate, useParams} from "react-router-dom";
import {LineChartOutlined, DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined} from "@ant-design/icons";

let ClassroomDetail = (props) => {

    let {isMobile, setStudentName} = props;
    let {classroomName} = useParams();

    let [students, setStudents] = useState([]);
    let [loading, setLoading] = useState(true);
    let [editing, setEditing] = useState(false);
    let [message, setMessage] = useState(null);
    let [inputName, setInputName] = useState(classroomName);
    let [inputLevel, setInputLevel] = useState(classroomName);

    let navigate = useNavigate();

    let {t} = useTranslation();

    let getStudents = useCallback(async () => {
        setLoading(true);
        let response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/students/list/" + classroomName,
            {
                method: "GET",
                headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
            }
        );

        if (response.ok) {
            let jsonData = await response.json();
            setStudents(jsonData);
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
    }, [classroomName]);

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


        getStudents();
    }, [getStudents]);

    let deleteStudent = async (id) => {
        await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/students/" + id, {
            method: "DELETE",
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        });
        getStudents();
    };

    const columns = [
        {
            title: t("classrooms.detail.table.studentUsername"),
            dataIndex: 'username',
            render: (username, student) => {
                return <Link to={"/teachers/studentDetail/" + student.id}>{username}</Link>;
            }
        },
        {
            title: t("classrooms.detail.table.studentName"),
            dataIndex: 'name',
            render: (name) => {
                return name;
            }
        },
        {
            title: t("classrooms.detail.table.studentLastName"),
            dataIndex: 'lastName',
            render: (lastName) => {
                return lastName;
            }
        },
        {
            title: t("classrooms.detail.table.studentAge"),
            dataIndex: 'age',
            render: (age) => {
                return age;
            }
        },
        {
            title: "Actions",
            dataIndex: "id",
            align: "right",
            render: (id, student) => (
                isMobile ?
                    <div style={{float: "right"}}>
                        <Tooltip title={t("classrooms.detail.table.tooltips.seeStatistics")} mouseEnterDelay="0.3"
                                 trigger={["hover", "focus"]}>
                            <Button onClick={() => {
                                setStudentName(student.name);
                                navigate("/teachers/studentStats/" + id);
                            }} icon={<LineChartOutlined/>} style={{marginRight: "1vmax"}}/>
                        </Tooltip>
                        <Tooltip title={t("classrooms.detail.table.tooltips.delete")} mouseEnterDelay="0.3"
                                 trigger={["hover", "focus"]}>
                            <Button
                                danger
                                type="primary"
                                onClick={() => deleteStudent(id)}
                                icon={<DeleteOutlined/>}
                            />
                        </Tooltip>
                    </div>
                    : <div style={{float: "right"}}>
                        <Button onClick={() => {
                            setStudentName(student.name);
                            navigate("/teachers/studentStats/" + id);
                        }} style={{marginRight: "1vmax"}}> {t("classrooms.detail.table.buttons.seeStatistics")}</Button>
                        <Button danger type="primary"
                                onClick={() => deleteStudent(id)}> {t("classrooms.detail.table.buttons.delete")}</Button>
                    </div>
            )
        }
    ];

    let onFinish = async (values) => {
        let {name, lastName, age} = values;

        let response = null;
        try {
            response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    name,
                    lastName,
                    age,
                    classroomName
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
        getStudents();
    };

    let changeClassroomName = async () => {

        let response = null;
        try {
            response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms/" + classroomName, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    name: inputName
                })
            });
        } catch (e) {
            setMessage({error: {type: "internalServerError", message: e}});
            return;
        }

        let jsonData = await response?.json();
        if (response?.ok) {
            if (jsonData?.updated != null) {
                setEditing(false);
                navigate("/teachers/classroomDetail/" + inputName);
            }
        } else {
            setMessage({error: jsonData?.error});
        }
    };

    return (
        <Spin spinning={loading} tip="Loading" size="large">
            <Card
                title={
                    !editing
                        ? <Space>{classroomName} <EditOutlined onClick={() => setEditing(true)}/></Space>
                        :
                        <><Row>
                            <Typography.Text style={{
                                "color": "red",
                                "fontSize": "11px"
                            }}>{message?.error?.repeatedName ? t(message?.error?.repeatedName) : undefined}</Typography.Text>
                        </Row>
                            <Row>
                                <Space.Compact style={{width: '40%'}}>
                                    <Input status={message?.error?.repeatedName && "error"} value={inputName}
                                           onChange={(e) => setInputName(e.target.value)}/>
                                    <Cascader
                                        placeholder={t("classrooms.level.placeholder")}
                                        value={inputName}
                                        onChange={(e) => setInputName(e.target.value)}
                                        options={options}
                                        expandTrigger="hover"
                                        displayRender={(labels) => labels[labels.length - 1]}
                                    />
                                    <Button color="primary" variant="outlined"
                                            onClick={changeClassroomName}><CheckOutlined/></Button>
                                    <Button color="danger" variant="outlined"
                                            onClick={() => setEditing(false)}><CloseOutlined/></Button>
                                </Space.Compact>
                            </Row>
                        </>
                } style={{width: "90vw"}}
            >
                {students.length <= 0 ?
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("classrooms.detail.table.empty")}/>
                    : <Table bordered columns={columns} dataSource={students}/>
                }
                <Divider orientation="left">{t("classrooms.detail.addStudent.divider")}</Divider>
                {message?.error?.type &&
                    <Alert type="error" message={t(message?.error?.type)} showIcon style={{marginBottom: "1vh"}}/>}
                <Form
                    name="addStudent"
                    labelCol={{xs: {span: 24}, sm: {span: 6}}}
                    wrapperCol={{xs: {span: 14}, sm: {span: 6}}}
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Form.Item
                        name="name"
                        label={t("classrooms.detail.addStudent.label.name")}
                        rules={[
                            {
                                required: true,
                                message: t("classrooms.detail.addStudent.error.name")
                            },
                        ]}
                        validateStatus={message?.error?.name ? 'error' : undefined}
                        help={message?.error?.name ? t(message?.error?.name) : undefined}
                        hasFeedback
                    >
                        <Input placeholder={t("classrooms.detail.addStudent.placeholder.name")}
                               onInput={() => setMessage(null)}/>
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label={t("classrooms.detail.addStudent.label.lastName")}
                        rules={[
                            {
                                required: true,
                                message: t("classrooms.detail.addStudent.error.lastName")
                            },
                        ]}
                        validateStatus={message?.error?.lastName ? 'error' : undefined}
                        help={message?.error?.lastName ? t(message?.error?.lastName) : undefined}
                        hasFeedback
                    >
                        <Input placeholder={t("classrooms.detail.addStudent.placeholder.lastName")}
                               onInput={() => setMessage(null)}/>
                    </Form.Item>
                    <Form.Item
                        name="age"
                        label={t("classrooms.detail.addStudent.label.age")}
                        rules={[
                            {
                                required: true,
                                type: "number",
                                message: t("classrooms.detail.addStudent.error.age")
                            },
                        ]}
                        validateStatus={message?.error?.age ? 'error' : undefined}
                        help={message?.error?.age ? t(message?.error?.age) : undefined}
                        hasFeedback
                    >
                        <InputNumber placeholder={t("classrooms.detail.addStudent.placeholder.age")}
                                     onInput={() => setMessage(null)}/>
                    </Form.Item>
                    <Form.Item wrapperCol={{xs: {span: 24, offset: 0}, sm: {span: 16, offset: 6}}}>
                        <Button type="primary" htmlType="submit">
                            {t("classrooms.detail.addStudent.button")}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Spin>
    );
};

export default ClassroomDetail;