import { Empty, Button, Card, Table, Flex, Divider, Input, Tooltip, Form, Alert } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";
import { LineChartOutlined, DeleteOutlined } from "@ant-design/icons";
import { usersServiceURL } from "../Globals";

let ClassroomsListComponent = (props) => {

  let { isMobile } = props;

  let [classrooms, setClassrooms] = useState([]);
  let [message, setMessage] = useState(null);

  let { t } = useTranslation();
  let navigate = useNavigate();

  useEffect(() => {
    getClassrooms();
  }, []);

  const columns = [
    {
      title: t("classrooms.table.className"),
      dataIndex: 'name',
      render: (name, classroom) => { return <Link to={"/teachers/classroomDetail/" + classroom.id}>{name}</Link>; }
    },
    {
      title: t("classrooms.table.numberStudents"),
      dataIndex: 'numberStudents',
      align: "center"
    },
    {
      title: "",
      dataIndex: "id",
      render: (id) => (
        <Flex justify="end" align="center" gap="1vw">
          {isMobile ?
            <>
              <Tooltip title={t("classrooms.table.tooltips.seeStatistics")} mouseEnterDelay="0.3" trigger={["hover", "focus"]}>
                <Button onClick={() => navigate("/teachers/classroomStatistics/" + id)} icon={<LineChartOutlined />} />
              </Tooltip>
              <Tooltip title={t("classrooms.table.tooltips.delete")} mouseEnterDelay="0.3" trigger={["hover", "focus"]}>
                <Button
                  danger
                  type="primary"
                  onClick={() => deleteClassroom(id)}
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </>
            : <>
              <Button onClick={() => navigate("/teachers/classroomStatistics/" + id)} > {t("classrooms.table.buttons.seeStatistics")}</Button >
              <Button danger type="primary" onClick={() => deleteClassroom(id)}> {t("classrooms.table.buttons.delete")}</Button >
            </>}
        </Flex>
      )
    }
  ];

  let getClassrooms = async () => {
    let response = await fetch(usersServiceURL + "/classrooms/list?apiKey=" + localStorage.getItem("apiKey"));

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
  };

  let onFinish = async (values) => {
    let { name } = values;

    let response = null;
    try {
      response = await fetch(usersServiceURL + "/classrooms/?apiKey=" + localStorage.getItem("apiKey"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name
        })
      });
    } catch (e) {
      setMessage({ error: { type: "internalServerError", message: e } });
      return;
    }

    let jsonData = await response?.json();
    if (response?.ok) {
      if (jsonData?.classroom != null) {
      }
    } else {
      setMessage({ error: jsonData?.error });
    }
    getClassrooms();
  };

  let deleteClassroom = async (id) => {
    let response = await fetch(usersServiceURL + "/classrooms/" + id + "?apiKey=" + localStorage.getItem("apiKey"), {
      method: "DELETE"
    });
    if (response.ok) {
    }
    getClassrooms();
  };

  return (
    <Card title={t("classrooms.table.title")} style={{ minWidth: "55vw" }}>
      {classrooms.length <= 0 ?
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("classrooms.table.empty")} />
        : <Table columns={columns} dataSource={classrooms} />
      }
      <Divider orientation="left">{t("classrooms.addClassroom.divider")}</Divider>
      {message?.error?.type && <Alert type="error" message={t(message?.error?.type)} showIcon style={{ marginBottom: "1vh" }} />}
      <Form
        name="addClassroom"
        labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 18 } }}
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
          <Input placeholder={t("classrooms.addClassroom.placeholder")} onInput={() => setMessage(null)} />
        </Form.Item>
        <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } }}>
          <Button type="primary" htmlType="submit">
            {t("classrooms.addClassroom.button")}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ClassroomsListComponent;