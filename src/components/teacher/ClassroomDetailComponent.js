import {
    Empty,
    Button,
    Card,
    Table,
    Divider,
    Input,
    Tooltip,
    Alert,
    Spin,
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

    let {isMobile, setStudentName, setClassroomName} = props;
    let {classroomName} = useParams();

    let [students, setStudents] = useState([]);
    let [loading, setLoading] = useState(true);
    let [editing, setEditing] = useState(false);
    let [message, setMessage] = useState(null);
    let [inputName, setInputName] = useState(classroomName);
    let [inputLevel, setInputLevel] = useState([]);

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
        let getClassroomInfo = async () => {
            let response = null;
            try {
                response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms/" + classroomName, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                });
            } catch (e) {
                setMessage({error: {type: "internalServerError", message: e}});
                return;
            }

            let jsonData = await response?.json();
            if (response?.ok) {
                if (jsonData != null) {
                    const [mainLevel, subLevel] = jsonData[0].level.split("-");
                    setInputLevel([subLevel, mainLevel]);
                }
            } else {
                setMessage({error: jsonData?.error});
            }
        };

        getClassroomInfo();
        getStudents();
    }, [classroomName, getStudents]);

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
                    name: inputName,
                    level: inputLevel[1] + '-' + inputLevel[0]
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
                                        value={inputLevel}
                                        onChange={(value) => setInputLevel(value)}
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
	            {message?.error?.type &&
	             <Alert type="error" message={t(message?.error?.type)} showIcon style={{marginBottom: "1vh"}}/>}
                {students.length <= 0 ?
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("classrooms.detail.table.empty")}/>
                    : <Table bordered columns={columns} dataSource={students}/>
                }
                <Divider orientation="left">{t("classrooms.detail.addStudent.divider")}</Divider>
                <Button type="primary" htmlType="submit" onClick={()=> {
                    setClassroomName(classroomName);
                    navigate("/teachers/addStudent");
                }}>
                    {t("classrooms.detail.addStudent.button")}
                </Button>
            </Card>
        </Spin>
    );
};

export default ClassroomDetail;