import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Alert, Card, DatePicker } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CreateStudent = ({ classroomName }) => {

	let [message, setMessage] = useState(null);
	let navigate = useNavigate();
	const { t } = useTranslation();

	const onFinish = async (values) => {
		const { name, lastName, age, school, classroomNumber, birthDate } = values;

		try {
			const response = await fetch(
				`${process.env.REACT_APP_USERS_SERVICE_URL}/students`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					},
					body: JSON.stringify({
						                     name,
						                     lastName,
						                     age,
						                     school,
						                     classroomNumber,
						                     birthDate: birthDate?.format("YYYY-MM-DD"),
						                     classroomName
					                     }),
				}
			);

			const jsonData = await response.json();
			if (response.ok) {
				navigate("/teachers/menuTeacher");
			} else {
				setMessage({ error: jsonData?.error });
			}
		} catch (e) {
			setMessage({ error: { type: "internalServerError", message: e } });
		}
	};

	return (
		<Card title={t("classrooms.detail.addStudent.title")} style={{ width: "70vw", margin: "auto" }}>
			{message?.error?.type && (
				<Alert
					type="error"
					message={t(message?.error?.type)}
					showIcon
					style={{ marginBottom: "1vh" }}
				/>
			)}
			<Form
				name="addStudent"
				labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
				wrapperCol={{ xs: { span: 24 }, sm: { span: 14 } }}
				onFinish={onFinish}
				scrollToFirstError
			>
				<Form.Item
					name="name"
					label={t("classrooms.detail.addStudent.label.name")}
					rules={[
						{
							required: true,
							message: t("classrooms.detail.addStudent.error.name"),
						},
					]}
					validateStatus={message?.error?.name ? "error" : undefined}
					help={message?.error?.name ? t(message?.error?.name) : undefined}
					hasFeedback
				>
					<Input
						placeholder={t("classrooms.detail.addStudent.placeholder.name")}
						onInput={() => setMessage(null)}
					/>
				</Form.Item>
				<Form.Item
					name="lastName"
					label={t("classrooms.detail.addStudent.label.lastName")}
					rules={[
						{
							required: true,
							message: t("classrooms.detail.addStudent.error.lastName"),
						},
					]}
					validateStatus={message?.error?.lastName ? "error" : undefined}
					help={message?.error?.lastName ? t(message?.error?.lastName) : undefined}
					hasFeedback
				>
					<Input
						placeholder={t("classrooms.detail.addStudent.placeholder.lastName")}
						onInput={() => setMessage(null)}
					/>
				</Form.Item>
				<Form.Item
					name="age"
					label={t("classrooms.detail.addStudent.label.age")}
					rules={[
						{
							required: true,
							type: "number",
							message: t("classrooms.detail.addStudent.error.age"),
						},
					]}
					validateStatus={message?.error?.age ? "error" : undefined}
					help={message?.error?.age ? t(message?.error?.age) : undefined}
					hasFeedback
				>
					<InputNumber
						placeholder={t("classrooms.detail.addStudent.placeholder.age")}
						onInput={() => setMessage(null)}
					/>
				</Form.Item>
				<Form.Item
					name="school"
					label={t("classrooms.detail.addStudent.label.school")}
					rules={[
						{
							required: true,
							message: t("classrooms.detail.addStudent.error.school"),
						},
					]}
					hasFeedback
				>
					<Input placeholder={t("classrooms.detail.addStudent.placeholder.school")} />
				</Form.Item>
				<Form.Item
					name="classroomNumber"
					label={t("classrooms.detail.addStudent.label.classroomNumber")}
					rules={[
						{
							required: true,
							type: "number",
							message: t("classrooms.detail.addStudent.error.classroomNumber"),
						},
					]}
					hasFeedback
				>
					<InputNumber placeholder={t("classrooms.detail.addStudent.placeholder.classroomNumber")} />
				</Form.Item>
				<Form.Item
					name="birthDate"
					label={t("classrooms.detail.addStudent.label.birthDate")}
					rules={[
						{
							required: true,
							message: t("classrooms.detail.addStudent.error.birthDate"),
						},
					]}
					hasFeedback
				>
					<DatePicker
						style={{ width: "100%" }}
						placeholder={t("classrooms.detail.addStudent.placeholder.birthDate")}
					/>
				</Form.Item>
				<Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }}>
					<Button type="primary" htmlType="submit">
						{t("classrooms.detail.addStudent.button")}
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default CreateStudent;