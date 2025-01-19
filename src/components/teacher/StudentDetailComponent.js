import { Select, Button, Card, Input, Form, Alert, Spin, InputNumber, DatePicker } from "antd";
import { useForm } from "antd/es/form/Form";
import moment                                                                      from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from "react-router-dom";

let StudentDetail = () => {

	let { studentId } = useParams();

	let [form] = useForm();
	let [classrooms, setClassrooms] = useState([]);
	let [loading, setLoading] = useState(true);
	let [message, setMessage] = useState(null);
	let navigate = useNavigate();

	let { t } = useTranslation();

	useEffect(() => {
		let getStudent = async () => {

			let jsonDataClassroom;
			try {
				let response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms/list",
				                           {
					                           method: "GET",
					                           headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
				                           }
				);

				jsonDataClassroom = await response.json();
				if (response.ok) {
					setClassrooms(jsonDataClassroom);
				} else {
					if (Array.isArray(jsonDataClassroom.error)) {
						setMessage(jsonDataClassroom.error);
					} else {
						let finalError = [];
						finalError.push(jsonDataClassroom.error);
						setMessage(finalError);
					}
				}
			} catch (error) {
			}

			try {
				setLoading(true);
				let response = await fetch(
					process.env.REACT_APP_USERS_SERVICE_URL + "/students/" + studentId,
					{
						method: "GET",
						headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
					}
				);

				let jsonDataStudent = await response.json();

				if (response.ok) {
					form.setFieldsValue({
						                    name: jsonDataStudent.name,
						                    lastName: jsonDataStudent.lastName,
						                    age: jsonDataStudent.age,
						                    classroom: jsonDataClassroom.find((c) => c.id === jsonDataStudent.classroomId).name,
						                    school: jsonDataStudent.school,
						                    classroomNumber: jsonDataStudent.classroomNumber,
						                    birthDate: jsonDataStudent.birthDate ? moment(jsonDataStudent.birthDate) : null,
					                    });
				} else {
					setMessage(Array.isArray(jsonDataStudent.error) ? jsonDataStudent.error : [jsonDataStudent.error]);
				}
			} catch (error) {
			} finally {
				setLoading(false);
			}
		};

		getStudent();
	}, [studentId, form]);


	let onFinish = async (values) => {
		let { name, lastName, age, classroom, school, classroomNumber, birthDate } = values;

		let response = null;
		try {
			response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/students/" + studentId, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`
				},
				body: JSON.stringify({
					                     name,
					                     lastName,
					                     age,
					                     classroomId: classrooms.find((c) => c.name === classroom).id,
					                     school,
					                     classroomNumber,
					                     birthDate: birthDate ? birthDate.format('YYYY-MM-DD') : null,
				                     })
			});
		} catch (e) {
			setMessage({ error: { type: "internalServerError", message: e } });
			return;
		}

		let jsonData = await response?.json();
		if (response?.ok) {
			navigate("/classroomDetail/" + classroom.name);
		} else {
			setMessage({ error: jsonData?.error });
		}
	};

	let { Option } = Select;
	return (
		<Spin spinning={loading} tip="Loading" size="large">
			<Card title={t("students.detail.title")} style={{ width: "90vw" }}>
				{message?.error?.type && <Alert type="error" message={t(message?.error?.type)} showIcon style={{ marginBottom: "1vh" }} />}
				<Form
					form={form}
					name="addStudent"
					labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
					wrapperCol={{ xs: { span: 14 }, sm: { span: 6 } }}
					onFinish={onFinish}
					scrollToFirstError
				>
					<Form.Item
						name="name"
						label={t("students.detail.update.label.name")}
						rules={[
							{
								required: true,
								message: t("students.detail.update.error.name")
							},
						]}
						validateStatus={message?.error?.name ? 'error' : undefined}
						help={message?.error?.name ? t(message?.error?.name) : undefined}
						hasFeedback
					>

						<Input placeholder={t("students.detail.update.placeholder.name")} onInput={() => setMessage(null)} />
					</Form.Item>
					<Form.Item
						name="lastName"
						label={t("students.detail.update.label.lastName")}
						rules={[
							{
								required: true,
								message: t("students.detail.update.error.lastName")
							},
						]}
						validateStatus={message?.error?.lastName ? 'error' : undefined}
						help={message?.error?.lastName ? t(message?.error?.lastName) : undefined}
						hasFeedback
					>
						<Input placeholder={t("students.detail.update.placeholder.lastName")} onInput={() => setMessage(null)} />
					</Form.Item>
					<Form.Item
						name="age"
						label={t("students.detail.update.label.age")}
						rules={[
							{
								required: true,
								type: "number",
								message: t("students.detail.update.error.age")
							},
						]}
						validateStatus={message?.error?.age ? 'error' : undefined}
						help={message?.error?.age ? t(message?.error?.age) : undefined}
						hasFeedback
					>
						<InputNumber placeholder={t("students.detail.update.placeholder.age")} onInput={() => setMessage(null)} />
					</Form.Item>
					<Form.Item
						name="school"
						label={t("students.detail.update.label.school")}
						rules={[
							{
								required: true,
								message: t("students.detail.update.error.school")
							},
						]}
						hasFeedback
					>
						<Input placeholder={t("students.detail.update.placeholder.school")} onInput={() => setMessage(null)} />
					</Form.Item>
					<Form.Item
						name="classroomNumber"
						label={t("students.detail.update.label.classroomNumber")}
						rules={[
							{
								required: true,
								message: t("students.detail.update.error.classroomNumber")
							},
						]}
						hasFeedback
					>
						<InputNumber placeholder={t("students.detail.update.placeholder.classroomNumber")} onInput={() => setMessage(null)} />
					</Form.Item>
					<Form.Item
						name="birthDate"
						label={t("students.detail.update.label.birthDate")}
						rules={[
							{
								required: true,
								message: t("students.detail.update.error.birthDate")
							},
						]}
						hasFeedback
					>
						<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} onChange={() => setMessage(null)} />
					</Form.Item>
					<Form.Item
						name="classroom"
						label={t("students.detail.update.label.classroom")}
						rules={[
							{
								required: true,
								message: t("students.detail.update.error.classroom")
							},
						]}
						validateStatus={message?.error?.age ? 'error' : undefined}
						help={message?.error?.age ? t(message?.error?.age) : undefined}
						hasFeedback
					>
						<Select
							placeholder={t("students.detail.update.placeholder.classroom")}
						>
							{classrooms.map((c) => (
								<Option key={c.id} value={c.name}>
									{c.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } }}>
						<Button type="primary" htmlType="submit">
							{t("students.detail.update.button")}
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</Spin>
	);
};

export default StudentDetail;