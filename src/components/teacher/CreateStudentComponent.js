import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space, Steps } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const { Step } = Steps;
const { Option } = Select;

const CreateStudent = () => {

	let { classroomName } = useParams();
	const [currentStep, setCurrentStep] = useState(0);
	const [form] = Form.useForm();
	const [message, setMessage] = useState(null);
	const [showOtherSupportNeeds, setShowOtherSupportNeeds] = useState(false);
	const [showOtherEducationalSupport, setShowOtherEducationalSupport] = useState(false);
	const [showNEAE, setShowNEAE] = useState(false);
	const [showOtherNationalOrigin, setShowOtherNationalOrigin] = useState(false);
	const [showEducationalSupport, setShowEducationalSupport] = useState(false);
	const navigate = useNavigate();
	const { t } = useTranslation();

	const steps = [
		{
			title:   t("signup.student.steps.basicInformation"),
			fields: ['name', 'lastName', 'age', 'birthDate', 'classroomNumber', 'school'],
			content: (
				<>
					<Form.Item
						name="name"
						label={t("signup.form.label.name")}
						rules={[{ required: true, message: t("signup.error.name") }]}
					>
						<Input placeholder={t("signup.error.name")} />
					</Form.Item>

					<Form.Item
						name="lastName"
						label={t("signup.form.label.lastName")}
						rules={[{ required: true, message: t("signup.error.lastName") }]}
					>
						<Input placeholder={t("signup.error.lastName")} />
					</Form.Item>

					<Row justify="start" gutter={32}>
						<Col>
							<Form.Item
								name="age"
								label={t("signup.form.label.age")}
								rules={[{ required: true, type: "number", message: t("signup.error.age") }]}
							>
								<InputNumber style={{ width: "15rem" }} placeholder={t("signup.error.age")} />
							</Form.Item>
						</Col>

						<Col>
							<Form.Item
								name="birthDate"
								label={t("signup.form.label.birthDate")}
								rules={[{ required: true, message: t("signup.error.birthDate") }]}
							>
								<DatePicker style={{ width: "15rem" }} placeholder={t("signup.error.birthDate")} />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item
						name="classroomNumber"
						label={t("signup.form.label.classroomNumber")}
						rules={[{ required: true, type: "number", message: t("signup.error.classroomNumber") }]}
					>
						<InputNumber style={{ width: "15rem" }} placeholder={t("signup.error.classroomNumber")} />
					</Form.Item>

					<Form.Item
						name="school"
						label={t("signup.form.label.school")}
						rules={[{ required: true, message: t("signup.error.school") }]}
					>
						<Input placeholder={t("signup.error.school")} />
					</Form.Item>
				</>
			)
		}, {
			title:   t("signup.student.steps.familyBackground"),
			fields: [],
			content: (
				<>
					<Form.Item
						name="socioEconomicLevel"
						label={t("signup.form.label.socioEconomicLevel")}
					>
						<Select placeholder={t("select")} allowClear>
							<Option value="bajo">{t("students.socioeconomicLevel.low")}</Option>
							<Option value="medio">{t("students.socioeconomicLevel.medium")}</Option>
							<Option value="alto">{t("students.socioeconomicLevel.high")}</Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="nationalOrigin"
						label={t("signup.form.label.nationalOrigin")}
					>
						<Select
							placeholder={t("select")}
							onChange={ (value) => setShowOtherNationalOrigin(value === "otro") }
							allowClear
						>
							<Option value="espania">{t("students.nationalOrigin.spain")}</Option>
							<Option value="europeo">{t("students.nationalOrigin.european")}</Option>
							<Option value="africano">{t("students.nationalOrigin.african")}</Option>
							<Option value="asiatico">{t("students.nationalOrigin.asian")}</Option>
							<Option value="norteamericano">{t("students.nationalOrigin.northAmerican")}</Option>
							<Option value="latinoamericano">{t("students.nationalOrigin.latinAmerican")}</Option>
							<Option value="otro">{t("students.nationalOrigin.other")}</Option>
						</Select>
					</Form.Item>
					{ showOtherNationalOrigin && (
						<Form.Item name="otherNationalOrigin" label="Especifique el País">
							<Input/>
						</Form.Item>
					) }
				</>
			)
		}, {
			title:   t("signup.student.steps.educationalNeeds"),
			fields: [], // Paso sin campos requeridos
			content: (
				<>
					<Form.Item
						name="learningReadingRisk"
						label={t("signup.form.label.learningReadingRisk")}
					>
						<Select placeholder={t("select")} allowClear>
							<Option value="si">{t("yes")}</Option>
							<Option value="no">{t("no")}</Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="learningWritingRisk"
						label={t("signup.form.label.learningWritingRisk")}
					>
						<Select placeholder={t("select")} allowClear>
							<Option value="si">{t("yes")}</Option>
							<Option value="no">{t("no")}</Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="familyBackground"
						label={t("signup.form.label.familyBackground")}
					>
						<Select placeholder={t("select")} allowClear>
							<Option value="padre">{t("students.familyBackground.father")}</Option>
							<Option value="madre">{t("students.familyBackground.mother")}</Option>
							<Option value="ambos">{t("students.familyBackground.both")}</Option>
							<Option value="ninguno">{t("students.familyBackground.none")}</Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="neae"
						label={t("signup.form.label.neae")}
					>
						<Select placeholder={t("select")}
								onChange={ (value) => setShowNEAE(value === "si") }
								allowClear>
							<Option value="si">{t("yes")}</Option>
							<Option value="no">{t("no")}</Option>
						</Select>
					</Form.Item>
					{ showNEAE && (
						<Form.Item
							name="specificSupportNeeds"
							label={t("signup.form.label.specificSupportNeeds")}
						>
							<Checkbox.Group
								onChange={ (checkedValues) => setShowOtherSupportNeeds(checkedValues.includes("otro")) }>
								<Row gutter={ [8, 16] }>
									<Col span={ 8 }><Checkbox value="trastornoLenguaje">{t("students.specificSupportNeeds.languageDisorder")}</Checkbox></Col>
									<Col span={ 8 }><Checkbox value="tdah">{t("students.specificSupportNeeds.adhd")}</Checkbox></Col>
									<Col span={ 8 }><Checkbox value="autismo">{t("students.specificSupportNeeds.asd")}</Checkbox></Col>
									<Col span={ 16 }><Checkbox value="pendienteEvaluacion">{t("students.specificSupportNeeds.awaitingEvaluation")}</Checkbox></Col>
									<Col span={ 8 }><Checkbox value="altasCapacidades">{t("students.specificSupportNeeds.highAbilities")}</Checkbox></Col>
									<Col span={ 8 }><Checkbox value="discapacidadCognitiva">{t("students.specificSupportNeeds.cognitiveDisability")}</Checkbox></Col>
									<Col span={ 8 }><Checkbox value="discapacidadFisica">{t("students.specificSupportNeeds.physicalDisability")}</Checkbox></Col>
									<Col span={ 8 }><Checkbox value="dificultadesEspecificas">{t("students.specificSupportNeeds.specificLearningDisability")}</Checkbox></Col>
									<Col span={ 8 }><Checkbox value="otro">{t("students.specificSupportNeeds.other")}</Checkbox></Col>
								</Row>
							</Checkbox.Group>
						</Form.Item>
					) }
					{ showOtherSupportNeeds && (
						<Form.List name="otherSpecificSupportNeeds">
							{ (fields, { add, remove }) => (
								<>
									{ fields.map(({ key, name, ...restField }) => (
										<Space
											key={ key }
											style={ {
												display: "flex", marginBottom: 8
											} }
											align="baseline"
										>
											<Form.Item
												name={ name }
												{ ...restField }
											>
												<Space>{t("signup.form.label.specificSupportNeeds")}<Input/></Space>
											</Form.Item>
											<MinusCircleOutlined onClick={ () => remove(name) }/>
										</Space>
									)) }
									<Form.Item>
										<Button type="dashed" onClick={ () => add() } block
												icon={ <PlusOutlined/> }>
											{t("addField")}
										</Button>
									</Form.Item>
								</>
							) }
						</Form.List>
					) }
					<Form.Item
						name="learningDiagnosedDifficulties"
						label={t("signup.form.label.learningDiagnosedDifficulties")}
					>
						<Checkbox.Group>
							<Checkbox value="lectura">{t("students.learningDiagnosedDifficulties.reading")}</Checkbox>
							<Checkbox value="escritura">{t("students.learningDiagnosedDifficulties.writing")}</Checkbox>
							<Checkbox value="matematicas">{t("students.learningDiagnosedDifficulties.math")}</Checkbox>
						</Checkbox.Group>
					</Form.Item>
					<Form.Item
						name="needEducationalSupport"
						label={t("signup.form.label.needEducationalSupport")}
					>
						<Select placeholder={t("select")}
								onChange={ (value) => setShowEducationalSupport(value === "si") }
								allowClear>
							<Option value="si">{t("yes")}</Option>
							<Option value="no">{t("no")}</Option>
						</Select>
					</Form.Item>
					{ showEducationalSupport && <Form.Item
						name="educationalSupport"
						label={t("signup.form.label.educationalSupport")}
					>
						<Checkbox.Group
							onChange={ (checkedValues) => setShowOtherEducationalSupport(checkedValues.includes("otros")) }>
							<Checkbox value="PT">{t("students.educationalSupport.pt")}</Checkbox>
							<Checkbox value="AL">{t("students.educationalSupport.al")}</Checkbox>
							<Checkbox value="otros">{t("students.educationalSupport.other")}</Checkbox>
						</Checkbox.Group>
					</Form.Item> }
					{ showOtherEducationalSupport && (
						<Form.List name="otherEducationalSupport">
							{ (fields, { add, remove }) => (
								<>
									{ fields.map(({ key, name, ...restField }) => (
										<Space
											key={ key }
											style={ {
												display: "flex", marginBottom: 8
											} }
											align="baseline"
										>
											<Form.Item
												name={ name }
												{ ...restField }
											>
												<Space>{t("signup.form.label.otherSpecialists")}<Input/></Space>
											</Form.Item>
											<MinusCircleOutlined onClick={ () => remove(name) }/>
										</Space>
									)) }
									<Form.Item>
										<Button type="dashed" onClick={ () => add() } block
												icon={ <PlusOutlined/> }>
											{t("addField")}
										</Button>
									</Form.Item>
								</>
							) }
						</Form.List>
					) }
					<Form.Item
						name="firstWords"
						label={t("signup.form.label.firstWords")}
					>
						<Select placeholder={t("select")} allowClear>
							<Option value="antesUno">{t("students.firstWords.before12Months")}</Option>
							<Option value="entreUnoYUnoMedio">{t("students.firstWords.between12And18Months")}</Option>
							<Option value="entreUnoMedioYDos">{t("students.firstWords.between18And24Months")}</Option>
							<Option value="entreDosYDosMedio">{t("students.firstWords.between24And30Months")}</Option>
							<Option value="despuesDos">{t("students.firstWords.after30Months")}</Option>
							<Option value="noComunica">{t("students.firstWords.dontComunicate")}</Option>
						</Select>
					</Form.Item>
				</>
			)
		}
	];

	const next = async () => {
		try {
			// Validar solo los campos del paso actual
			const currentFields = steps[currentStep].fields;
			if (currentFields && currentFields.length > 0) {
				await form.validateFields(currentFields);
			}
			setCurrentStep(currentStep + 1);
			setMessage(null);
		} catch (error) {
			// Los errores de validación se mostrarán automáticamente en los campos
			console.log('Validation failed:', error);
		}
	};

	const prev = () => {
		setCurrentStep(currentStep - 1);
		setMessage(null);
	};

	let onFinish = async () => {
		// Validar todos los campos requeridos antes de enviar
		try {
			await form.validateFields(['name', 'lastName', 'age', 'birthDate', 'classroomNumber', 'school']);
		} catch (error) {
			setMessage({ error: { message: t("signup.validationError") } });
			setCurrentStep(0);
			return;
		}

		let {
			name,
			lastName,
			age,
			school,
			classroomNumber,
			birthDate,
			socioEconomicLevel,
			nationalOrigin,
			otherNationalOrigin,
			learningReadingRisk,
			learningWritingRisk,
			familyBackground,
			specificSupportNeeds,
			otherSpecificSupportNeeds,
			learningDiagnosedDifficulties,
			educationalSupport,
			otherEducationalSupport,
			firstWords
		} = form.getFieldsValue(true);

		// Handle specific support needs: convert array to a string or process 'Otro' case
		if ( specificSupportNeeds && specificSupportNeeds.includes("otro") && !otherSpecificSupportNeeds ) {
			setMessage({
				error: {
					type: "validationError", message: t("signup.error.neae")
				}
			});
			return;
		}

		// Handle educational support: convert array to a string or process 'Otros especialistas' case
		if ( educationalSupport && educationalSupport.includes("otros") && !otherEducationalSupport ) {
			setMessage({
				error: {
					type: "validationError", message: t("signup.error.specialists")
				}
			});
			return;
		}

		// Handle 'Otro' national origin case
		if ( nationalOrigin === "otro" && !otherNationalOrigin ) {
			setMessage({
				error: { type: "validationError", message: t("signup.error.nationalOrigin") }
			});
			return;
		}

		// Prepare payload for the API request
		const payload = {
			name,
			lastName,
			age,
			birthDate,
			school,
			classroomNumber,
			socioEconomicLevel: socioEconomicLevel || "",
			nationalOrigin:            nationalOrigin === "otro" ? otherNationalOrigin : (nationalOrigin || ""),
			learningReadingRisk,
			learningWritingRisk,
			familyBackground,
			specificSupportNeeds:      specificSupportNeeds || [],
			otherSpecificSupportNeeds: otherSpecificSupportNeeds || "",
			classroomName,
			learningDiagnosedDifficulties,
			educationalSupport:        educationalSupport || [],
			otherEducationalSupport:   otherEducationalSupport || "",
			firstWords
		};

		let response = null;
		try {
			response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/students", {
				method:  "POST", headers: {
					"Content-Type": "application/json", Authorization: `Bearer ${ localStorage.getItem("accessToken") }`
				}, body: JSON.stringify(payload)
			});
		}
		catch ( e ) {
			setMessage({ error: { type: "internalServerError", message: e.message } });
			return;
		}

		if ( response?.ok ) {
			navigate("/teachers/classrooms/" + classroomName);
		} else {
			let jsonData = await response?.json();
			setMessage({ error: jsonData?.error || { type: "unknownError", message: t("signup.form.unknownError") } });
		}
	};

	return (
		<Card title={t("signup.student.title")} style={ { margin: "auto" } }>
			{ message && (
				Array.isArray(message) ? (
					message.map((msg, index) => (
						<Alert
							key={index}
							type="error"
							message={msg.error?.message || msg.message || t("signup.validationError")}
							showIcon
							style={{ marginBottom: "1vh" }}
						/>
					))
				) : (
					<Alert
						type="error"
						message={message.error?.message || message.message || t("signup.validationError")}
						showIcon
						style={{ marginBottom: "1vh" }}
					/>
				)
			) }
			<Form
				form={ form }
				layout="vertical"
				onFinish={ onFinish }
				style={ { width: "40rem" } }
			>
				<Steps current={ currentStep } labelPlacement="vertical">
					{ steps.map((item) => (
						<Step key={ item.title } title={ item.title }/>
					)) }
				</Steps>
				<div style={ { marginTop: "1.5rem" } }>{ steps[ currentStep ].content }</div>
				<Form.Item>
					<div style={ { display: "flex", gap: "1rem" } }>
						{ currentStep > 0 && (
							<Button block onClick={ prev } style={ { flex: "100%" } }>
								{t("signup.button.prev")}
							</Button>
						) }
						{ currentStep < steps.length - 1 && (
							<Button block type="primary" onClick={ next } style={ { flex: "100%" } }>
								{t("signup.button.next")}
							</Button>
						) }
						{ currentStep === steps.length - 1 && (
							<Button block type="primary" htmlType="submit" style={ { flex: "100%" } }>
								{t("signup.button.submit")}
							</Button>
						) }
					</div>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default CreateStudent;