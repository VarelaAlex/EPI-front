import { MinusCircleOutlined, PlusOutlined }                                                                   from "@ant-design/icons";
import { Alert, Button, Card, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space, Steps } from "antd";
import React, { useState }                                                                                     from "react";
import { useTranslation }                                                                                      from "react-i18next";
import { useNavigate, useParams }                                                                              from "react-router-dom";

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
			title:   "Información Básica",
			content: (
				         <>
					         <Form.Item
						         name="name"
						         label="Nombre"
						         rules={ [{ required: true, message: "Por favor, ingrese el nombre" }] }
					         >
						         <Input/>
					         </Form.Item>
					         <Form.Item
						         name="lastName"
						         label="Apellido"
						         rules={ [{ required: true, message: "Por favor, ingrese el apellido" }] }
					         >
						         <Input/>
					         </Form.Item>
					         <Form.Item style={ { margin: "0" } }>
						         <Form.Item
							         name="age"
							         label="Edad"
							         rules={ [
								         {
									         required: true, type: "number", message: "Por favor, ingrese la edad"
								         }
							         ] }
							         style={ {
								         display: "inline-block"
							         } }
						         >
							         <InputNumber style={ { width: "10rem" } }/>
						         </Form.Item>
						         <span style={ { display: "inline-block", margin: "2rem 2rem 0 2rem" } }>-</span>
						         <Form.Item
							         name="birthDate"
							         label="Fecha de Nacimiento"
							         rules={ [{ required: true, message: "Seleccione la fecha de nacimiento" }] }
							         style={ {
								         display: "inline-block"
							         } }
						         >
							         <DatePicker style={ { width: "10rem" } }/>
						         </Form.Item>
						         <span style={ { display: "inline-block", margin: "2rem 2rem 0 2rem" } }>-</span>
						         <Form.Item
							         name="classroomNumber"
							         label="Número de Clase"
							         rules={ [
								         {
									         required: true, type: "number", message: "Por favor, ingrese el número de clase"
								         }
							         ] }
							         style={ {
								         display: "inline-block"
							         } }
						         >
							         <InputNumber style={ { width: "10rem" } }/>
						         </Form.Item>
					         </Form.Item>
					         <Form.Item
						         name="school"
						         label="Colegio"
						         rules={ [{ required: true, message: "Por favor, ingrese el colegio" }] }
					         >
						         <Input/>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   "Contexto Familiar",
			content: (
				         <>
					         <Form.Item
						         name="socioEconomicLevel"
						         label="Nivel Socioeconómico"
					         >
						         <Select placeholder="Seleccione" allowClear>
							         <Option value="bajo">Bajo</Option>
							         <Option value="medio">Medio</Option>
							         <Option value="alto">Alto</Option>
						         </Select>
					         </Form.Item>
					         <Form.Item
						         name="nationalOrigin"
						         label="Origen Nacional"
					         >
						         <Select
							         placeholder="Seleccione"
							         onChange={ (value) => setShowOtherNationalOrigin(value === "otro") }
							         allowClear
						         >
							         <Option value="espania">España</Option>
							         <Option value="europeo">Otro país europeo</Option>
							         <Option value="africano">País africano</Option>
							         <Option value="asiatico">País asiático</Option>
							         <Option value="norteamericano">País norteamericano</Option>
							         <Option value="latinoamericano">País latinoamericano</Option>
							         <Option value="otro">Otro</Option>
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
			title:   "Necesidades Educativas",
			content: (
				         <>
					         <Form.Item
						         name="learningReadingRisk"
						         label="¿Alumno en riesgo de dificultades de aprendizaje de la lectura?"
					         >
						         <Select placeholder="Seleccione" allowClear>
							         <Option value="si">Sí</Option>
							         <Option value="no">No</Option>
						         </Select>
					         </Form.Item>
					         <Form.Item
						         name="learningWritingRisk"
						         label="¿Alumno en riesgo de dificultades de aprendizaje de la escritura?"
					         >
						         <Select placeholder="Seleccione" allowClear>
							         <Option value="si">Sí</Option>
							         <Option value="no">No</Option>
						         </Select>
					         </Form.Item>
					         <Form.Item
						         name="familyBackground"
						         label="Alguno de los progenitores del alumno presentó dificultades de aprendizaje de la lectura o la escritura"
					         >
						         <Select placeholder="Seleccione" allowClear>
							         <Option value="padre">Sí, el padre</Option>
							         <Option value="madre">Sí, la madre</Option>
							         <Option value="ambos">Sí, ambos progenitores</Option>
							         <Option value="ninguno">No</Option>
						         </Select>
					         </Form.Item>
					         <Form.Item
						         name="neae"
						         label="El alumno presenta Necesidades Específicas de Apoyo Educativo (NEAE)"
					         >
						         <Select placeholder="Seleccione"
						                 onChange={ (value) => setShowNEAE(value === "si") }
						                 allowClear>
							         <Option value="si">Sí</Option>
							         <Option value="no">No</Option>
						         </Select>
					         </Form.Item>
					         { showNEAE && (
						         <Form.Item
							         name="specificSupportNeeds"
							         label="Necesidades Específicas"
						         >
							         <Checkbox.Group
								         onChange={ (checkedValues) => setShowOtherSupportNeeds(checkedValues.includes("otro")) }>
								         <Row gutter={ [8, 16] }>
									         <Col span={ 8 }><Checkbox value="trastornoLenguaje">Trastorno del desarrollo del lenguaje y la comunicación</Checkbox></Col>
									         <Col span={ 8 }><Checkbox value="tdah">Trastorno por déficit de atención con hiperactividad</Checkbox></Col>
									         <Col span={ 8 }><Checkbox value="autismo">Trastorno del espectro del autismo</Checkbox></Col>
									         <Col span={ 16 }><Checkbox value="pendienteEvaluacion">Alumno pendiente de evaluación psicopedagógica</Checkbox></Col>
									         <Col span={ 8 }><Checkbox value="altasCapacidades">Altas capacidades</Checkbox></Col>
									         <Col span={ 8 }><Checkbox value="discapacidadCognitiva">Discapacidad cognitiva</Checkbox></Col>
									         <Col span={ 8 }><Checkbox value="discapacidadFisica">Discapacidad física</Checkbox></Col>
									         <Col span={ 8 }><Checkbox value="dificultadesEspecificas">Dificultades Específicas de Aprendizaje</Checkbox></Col>
									         <Col span={ 8 }><Checkbox value="otro">Otro</Checkbox></Col>
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
												         <Input addonBefore="Necesidades Específicas"/>
											         </Form.Item>
											         <MinusCircleOutlined onClick={ () => remove(name) }/>
										         </Space>
									         )) }
									         <Form.Item>
										         <Button type="dashed" onClick={ () => add() } block
										                 icon={ <PlusOutlined/> }>
											         Add field
										         </Button>
									         </Form.Item>
								         </>
							         ) }
						         </Form.List>
					         ) }
					         <Form.Item
						         name="learningDiagnosedDifficulties"
						         label="Dificultades de Aprendizaje Diagnosticadas"
					         >
						         <Checkbox.Group>
							         <Checkbox value="lectura">En lectura</Checkbox>
							         <Checkbox value="escritura">En escritura</Checkbox>
							         <Checkbox value="matematicas">En matemáticas</Checkbox>
						         </Checkbox.Group>
					         </Form.Item>
					         <Form.Item
						         name="needE
						         ducationalSupport"
						         label="El alumno recibe apoyo educativo"
					         >
						         <Select placeholder="Seleccione"
						                 onChange={ (value) => setShowEducationalSupport(value === "si") }
						                 allowClear>
							         <Option value="si">Sí</Option>
							         <Option value="no">No</Option>
						         </Select>
					         </Form.Item>
					         { showEducationalSupport && <Form.Item
						         name="educationalSupport"
						         label="Apoyo educativo"
					         >
						         <Checkbox.Group
							         onChange={ (checkedValues) => setShowOtherEducationalSupport(checkedValues.includes("otros")) }>
							         <Checkbox value="PT">PT</Checkbox>
							         <Checkbox value="AL">AL</Checkbox>
							         <Checkbox value="otros">Otros especialistas</Checkbox>
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
												         <Input addonBefore="Otros especialistas"/>
											         </Form.Item>
											         <MinusCircleOutlined onClick={ () => remove(name) }/>
										         </Space>
									         )) }
									         <Form.Item>
										         <Button type="dashed" onClick={ () => add() } block
										                 icon={ <PlusOutlined/> }>
											         Add field
										         </Button>
									         </Form.Item>
								         </>
							         ) }
						         </Form.List>
					         ) }
					         <Form.Item
						         name="firstWords"
						         label="La emisión de las primeras palabras se inició "
					         >
						         <Select placeholder="Seleccione" allowClear>
							         <Option value="antesUno">Antes del año</Option>
							         <Option value="entreUnoYUnoMedio">Entre el año y el año y medio</Option>
							         <Option value="entreUnoMedioYDos">Entre el año y medio y los dos años</Option>
							         <Option value="entreDosYDosMedio">Entre los dos años y los dos años y
								         medio</Option>
							         <Option value="despuesDos">Después de los dos años y medio</Option>
							         <Option value="noComunica">No se comunica oralmente</Option>
						         </Select>
					         </Form.Item>
				         </>
			         )
		}
	];

	const next = () => setCurrentStep(currentStep + 1);
	const prev = () => setCurrentStep(currentStep - 1);

	let onFinish = async () => {
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
					           type: "validationError", message: "Por favor, ingrese la descripción de las necesidades específicas."
				           }
			           });
			return;
		}

		// Handle educational support: convert array to a string or process 'Otros especialistas' case
		if ( educationalSupport && educationalSupport.includes("otros") && !otherEducationalSupport ) {
			setMessage({
				           error: {
					           type: "validationError", message: "Por favor, ingrese los especialistas."
				           }
			           });
			return;
		}

		// Handle 'Otro' national origin case
		if ( nationalOrigin === "otro" && !otherNationalOrigin ) {
			setMessage({
				           error: { type: "validationError", message: "Por favor, ingrese el país de origen." }
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
			socioEconomicLevel,
			nationalOrigin:            nationalOrigin === "otro" ? otherNationalOrigin : nationalOrigin,
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
			setMessage({ error: jsonData?.error || { type: "unknownError", message: "Error desconocido" } });
		}
	};

	return (
		<Card title="Agregar Estudiante" style={ { margin: "auto" } }>
			{ message && (
				<Alert type="error" message={ message } showIcon style={ { marginBottom: "1vh" } }/>
			) }
			<Form
				form={ form }
				layout="vertical"
				onFinish={ onFinish }
				initialValues={ { socioEconomicLevel: "", nationalOrigin: "" } }
				style={ { width: "40rem" } }
			>
				<Steps current={ currentStep } labelPlacement="vertical" onChange={ value => setCurrentStep(value) }>
					{ steps.map((item) => (
						<Step key={ item.title } title={ item.title }/>
					)) }
				</Steps>
				<div style={ { marginTop: "1.5rem" } }>{ steps[ currentStep ].content }</div>
				<Form.Item>
					<div style={ { display: "flex", gap: "1rem" } }>
						{ currentStep > 0 && (
							<Button block onClick={ prev } style={ { flex: "100%" } }>
								Anterior
							</Button>
						) }
						{ currentStep < steps.length - 1 && (
							<Button block type="primary" onClick={ next } style={ { flex: "100%" } }>
								Siguiente
							</Button>
						) }
						{ currentStep === steps.length - 1 && (
							<Button block type="primary" htmlType="submit" style={ { flex: "100%" } }>
								Finalizar
							</Button>
						) }
					</div>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default CreateStudent;
