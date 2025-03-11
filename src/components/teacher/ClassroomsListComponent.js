import { DeleteOutlined, LineChartOutlined }                                                            from "@ant-design/icons";
import { Alert, Button, Card, Cascader, Divider, Empty, Form, Input, Popconfirm, Spin, Table, Tooltip } from "antd";
import { useEffect, useState }                                                                          from "react";
import { useTranslation }                                                                               from "react-i18next";
import { Link, useNavigate }                                                                            from "react-router-dom";

let ClassroomsList = (props) => {

	let { isMobile, setClassroomId } = props;

	let [loading, setLoading] = useState(true);
	let [classrooms, setClassrooms] = useState([]);
	let [message, setMessage] = useState(null);

	let { t } = useTranslation();
	let navigate = useNavigate();

	const [form] = Form.useForm();

	const options = [
		{
			value:    "EI",
			label:    t("classrooms.addClassroom.level.EI.label"),
			children: Object.entries(t("classrooms.addClassroom.level.EI.stage", { returnObjects: true }))
			                .map(([key, value]) => (
				                {
					                value: key, label: value
				                }
			                ))
		}, {
			value:    "EP",
			label:    t("classrooms.addClassroom.level.EP.label"),
			children: Object.entries(t("classrooms.addClassroom.level.EP.stage", { returnObjects: true }))
			                .map(([key, value]) => (
				                {
					                value: key, label: value
				                }
			                ))
		}
	];

	useEffect(() => {
		getClassrooms();
	}, []);

	const columns = [
		{
			title: t("classrooms.table.className"), dataIndex: "name", render: (name) => {
				return <Link to={ "/teachers/classrooms/" + name }>{ name }</Link>;
			}
		}, {
			title: t("classrooms.table.numberStudents"), dataIndex: "numberStudents", align: "center"
		}, {
			title:     t("classrooms.table.actions"),
			dataIndex: "name",
			align:     "right",
			render:    (name, classroom) => (
				isMobile ? <div style={ { float: "right" } }>
					<Tooltip title={ t("classrooms.table.tooltips.seeStatistics") } mouseEnterDelay="0.3"
					         trigger={ ["hover", "focus"] }>
						<Button onClick={ () => {
							setClassroomId(classroom.id);
							navigate("/teachers/classroomStats/" + name);
						} } icon={ <LineChartOutlined/> } style={ { marginRight: "1vmax" } }/>
					</Tooltip>
					<Tooltip title={ t("classrooms.table.tooltips.delete") } mouseEnterDelay="0.3"
					         trigger={ ["hover", "focus"] }>
						<Popconfirm
							title={ t("classrooms.delete.popconfirm.title") }
							description={ t("classrooms.delete.popconfirm.description") }
							okText={ t("classrooms.delete.popconfirm.okText") }
							okButtonProps={ { danger: true } }
							cancelText={ t("classrooms.delete.popconfirm.cancelText") }
							onConfirm={ () => deleteClassroom(name) }
						>
							<Button danger type="primary" icon={ <DeleteOutlined/> }> { t("classrooms.detail.table.buttons.delete") }</Button>
						</Popconfirm>
					</Tooltip>
				</div> : <div style={ { float: "right" } }>
					<Button onClick={ () => {
						setClassroomId(classroom.id);
						navigate("/teachers/classroomStats/" + name);
					} } style={ { marginRight: "1vmax" } }> { t("classrooms.table.buttons.seeStatistics") }</Button>
					<Popconfirm
						title={ t("classrooms.delete.popconfirm.title") }
						description={ t("classrooms.delete.popconfirm.description") }
						okText={ t("classrooms.delete.popconfirm.okText") }
						okButtonProps={ { danger: true } }
						cancelText={ t("classrooms.delete.popconfirm.cancelText") }
						onConfirm={ () => deleteClassroom(name) }
					>
						<Button danger type="primary"> { t("classrooms.table.buttons.delete") }</Button>
					</Popconfirm>
				</div>
			)
		}
	];

	let getClassrooms = async () => {
		setLoading(true);
		let response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms/list", {
			method: "GET", headers: { Authorization: `Bearer ${ localStorage.getItem("accessToken") }` }
		});

		if ( response.ok ) {
			let jsonData = await response.json();
			setClassrooms(jsonData);
		} else {
			let jsonData = await response.json();
			if ( Array.isArray(jsonData.error) ) {
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
		let { name, level } = values;

		let levelValue = level[ 1 ] + "-" + level[ 0 ];

		let response = null;
		try {
			response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms", {
				method:  "POST", headers: {
					"Content-Type": "application/json", Authorization: `Bearer ${ localStorage.getItem("accessToken") }`
				}, body: JSON.stringify({
					                        name, level: levelValue
				                        })
			});
		}
		catch ( e ) {
			setMessage({ error: { type: "internalServerError", message: e } });
			return;
		}

		let jsonData = await response?.json();
		if ( response?.ok ) {
			if ( jsonData?.classroom != null ) {
			}
		} else {
			setMessage({ error: jsonData?.error });
		}
		form.resetFields();
		getClassrooms();
	};

	let deleteClassroom = async (name) => {
		await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms/" + name, {
			method: "DELETE", headers: { Authorization: `Bearer ${ localStorage.getItem("accessToken") }` }
		});
		getClassrooms();
	};

	return (
		<Spin spinning={ loading } tip="Loading" size="large">
			<Card title={ t("classrooms.table.title") } style={ { width: "90vw" } }>
				{ classrooms.length <= 0 ? <Empty image={ Empty.PRESENTED_IMAGE_SIMPLE } description={ t("classrooms.table.empty") }/> : <Table bordered columns={ columns }
				                                                                                                                                dataSource={ classrooms }/> }
				<Divider orientation="left">{ t("classrooms.addClassroom.divider") }</Divider>
				{ message?.error?.type && <Alert type="error" message={ t(message?.error?.type) } showIcon style={ { marginBottom: "1vh" } }/> }
				<Form
					form={ form }
					name="addClassroom"
					labelCol={ { xs: { span: 24 }, sm: { span: 6 } } }
					wrapperCol={ { xs: { span: 24 }, sm: { span: 18 } } }
					onFinish={ onFinish }
					scrollToFirstError
				>
					<Form.Item
						name="name"
						label={ t("classrooms.addClassroom.label") }
						rules={ [
							{
								required: true, message: t("classrooms.addClassroom.error")
							}
						] }
						validateStatus={ message?.error?.name ? "error" : undefined }
						help={ message?.error?.name ? t(message?.error?.name) : undefined }
						hasFeedback
					>
						<Input placeholder={ t("classrooms.addClassroom.placeholder") } onInput={ () => setMessage(null) }/>
					</Form.Item>
					<Form.Item
						name="level"
						label={ t("classrooms.addClassroom.level.label") }
						rules={ [{ required: true, message: t("signup.error.level.empty") }] }
					>
						<Cascader
							placeholder={ t("classrooms.addClassroom.level.placeholder") }
							options={ options }
							expandTrigger="hover"
							displayRender={ (labels) => labels[ labels.length - 1 ] }
						/>
					</Form.Item>
					<Form.Item wrapperCol={ { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } } }>
						<Button type="primary" htmlType="submit">
							{ t("classrooms.addClassroom.button") }
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</Spin>
	);
};

export default ClassroomsList;