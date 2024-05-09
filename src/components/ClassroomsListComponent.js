import { Empty, Button, Card, Table, Flex, Divider, Input, Tooltip } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";
import { LineChartOutlined, DeleteOutlined } from "@ant-design/icons";

let ClassroomsListComponent = (props) => {

  let { isMobile } = props;

  let [lastKey, setLasKey] = useState(0);
  let [classrooms, setClassrooms] = useState([]);
  let [className, setClassName] = useState("");

  let classNameInput = useRef("");

  let { t } = useTranslation();

  let navigate = useNavigate();

  const columns = [
    {
      title: t("classrooms.table.className"),
      dataIndex: 'name',
      render: (text) => <Link to="/example">{text}</Link>
    },
    {
      title: t("classrooms.table.numberStudents"),
      dataIndex: 'numberStudents',
      align: "center"
    },
    {
      title: "",
      render: (record) => (
        <Flex justify="end" align="center" gap="1vw">
          {isMobile ?
            <>
              <Tooltip title={t("classrooms.table.tooltips.seeStatistics")} mouseEnterDelay="0.3" trigger={["hover", "focus"]}>
                <Button onClick={() => navigate("/example")} icon={<LineChartOutlined />} />
              </Tooltip>
              <Tooltip title={t("classrooms.table.tooltips.delete")} mouseEnterDelay="0.3" trigger={["hover", "focus"]}>
                <Button
                  danger
                  type="primary"
                  onClick={() => deleteClassroom(record)}
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </>
            : <>
              <Button onClick={() => navigate("/example")} > {t("classrooms.table.buttons.seeStatistics")}</Button >
              <Button danger type="primary" onClick={() => deleteClassroom(record)}> {t("classrooms.table.buttons.delete")}</Button >
            </>}
        </Flex>
      )
    }
  ];

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
    <Card title={t("classrooms.table.title")} style={{ minWidth: "55vw" }}>
      {classrooms.length <= 0 ?
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("classrooms.table.empty")} />
        : <Table columns={columns} dataSource={classrooms} />
      }
      <Divider orientation="left">{t("classrooms.addClassroom.divider")}</Divider>
      <Flex gap="1vw" align="start" justify="center" vertical={isMobile}>
        <Input
          ref={classNameInput}
          type="text"
          placeholder={t("classrooms.addClassroom.placeholder")}
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <Button type="primary" onClick={addFriend}>{t("classrooms.addClassroom.button")}</Button>
      </Flex>
    </Card>
  );
};

export default ClassroomsListComponent;