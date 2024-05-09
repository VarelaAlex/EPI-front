import { Empty, Button, Card, Table, Flex, Divider, Input, Tooltip } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";
import { LineChartOutlined, DeleteOutlined } from "@ant-design/icons";

let ClassroomsListComponent = (props) => {

  let { isMobile } = props;

  let { t } = useTranslation();

  let [classrooms, setClassrooms] = useState([]);

  let navigate = useNavigate();

  let [lastKey, setLasKey] = useState(0);

  const columns = [
    {
      title: 'Class name',
      dataIndex: 'name',
      render: (text) => <Link to="/example">{text}</Link>
    },
    {
      title: 'Number of students',
      dataIndex: 'numberStudents',
      align: "center"
    },
    {
      title: "",
      render: (record) => (
        <Flex justify="end" align="center" gap="1vw">
          {isMobile ?
            <>
              <Tooltip title="See statistics" mouseEnterDelay="0.3" trigger={["hover", "focus"]}>
                <Button onClick={() => navigate("/example")} icon={<LineChartOutlined />} />
              </Tooltip>
              <Tooltip title="Delete" mouseEnterDelay="0.3" trigger={["hover", "focus"]}>
                <Button
                  danger
                  type="primary"
                  onClick={() => deleteClassroom(record)}
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </>
            : <>
              <Button onClick={() => navigate("/example")} > See statistics</Button >
              <Button
                danger
                type="primary"
                onClick={() => deleteClassroom(record)}
              > Delete</Button >
            </>}
        </Flex>
      )
    }
  ];

  let [className, setClassName] = useState("");
  let classNameInput = useRef("");

  let addFriend = async () => {
    setClassrooms([...classrooms, {
      key: lastKey,
      name: className,
      numberStudents: 0
    }]);

    setLasKey(lastKey + 1);

    setClassName("");
  };

  let deleteClassroom = (record) => {
    setClassrooms(classrooms.filter(classroom => classroom.key !== record.key));
  };

  return (
    <Card title={t("menuTeacher.classrooms")} style={{ minWidth: "55vw" }}>
      {classrooms.length <= 0 ?
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You don't have classrooms" />
        : <Table columns={columns} dataSource={classrooms} />
      }
      <Divider orientation="left">Add a new classroom</Divider>
      <Flex gap="1vw" align="start" justify="center" vertical={isMobile}>
        <Input
          ref={classNameInput}
          type="text"
          placeholder="Classroom name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <Button type="primary" onClick={addFriend}>Add classroom</Button>
      </Flex>
    </Card>
  );
};

export default ClassroomsListComponent;