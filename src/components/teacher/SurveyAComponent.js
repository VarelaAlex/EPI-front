import { Alert, Button, Card, Flex, Form, Radio, Steps, Typography } from "antd";
import {useEffect, useState} from "react";
import { useTranslation }                                            from "react-i18next";
import { useNavigate, useParams }                                    from "react-router-dom";

const { Step } = Steps;

const SurveyA = () => {

	let { studentId, classroomName } = useParams();
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [currentStep, setCurrentStep] = useState(0);
	const [form] = Form.useForm();
	const [message, setMessage] = useState(null);
	const [surveyId, setSurveyId] = useState(null);

	const responseOptions = [
		{ label: t("surveyA.options.never"), value: 0 },
		{ label: t("surveyA.options.almostNever"), value: 1 },
		{ label: t("surveyA.options.fewTimes"), value: 2 },
		{ label: t("surveyA.options.sometimes"), value: 3 },
		{ label: t("surveyA.options.often"), value: 4 },
		{ label: t("surveyA.options.unknown"), value: -1 }
	];

	useEffect(() => {
		const loadSurvey = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_USERS_SERVICE_URL}/surveys/${studentId}/A`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("accessToken")}`
						}
					}
				);

				if (!response.ok) return;

				const data = await response.json();

				// Campos que NO son respuestas
				const {
					id,
					studentId: responseStudentId,
					teacherId,
					score,
					date,
					surveyCode,
					...responses
				} = data;

				setSurveyId(data.id);


				// Cargamos SOLO lo que exista
				form.setFieldsValue(responses);

			} catch (e) {
				console.error("Error cargando encuesta", e);
			}
		};

		if (studentId) {
			loadSurvey();
		}
	}, [studentId, form]);

	const steps = [
		{
			title:   t("surveyA.steps.generalBehavior"),
			content: (
				         <>
					         <Form.Item name="generalBehavior_1" label="En la libreta, deja muchas marcas de goma de borrar, incluso se rompe o se arruga la hoja de tanto borar" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="generalBehavior_2" label="Su comportamiento para la tarea de casa es irregular" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="generalBehavior_3" label="El comportamiento en la clase es bueno, pero su rendimiento es bajo" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyA.steps.speechAbility"),
			content: (
				         <>
					         <Form.Item name="speechAbility_1" label="Reacciona lentamente cuando tiene que contestar preguntas de forma oral" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="speechAbility_2" label="Se expresa oralmente con dificultad (por ejemplo, no encuentra las palabras para expresar sus ideas)" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="speechAbility_3" label="Comete errores gramaticales cuando habla" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="speechAbility_4" label="Tiene dificultades para pronunciar bien" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyA.steps.memoryAbility"),
			content: (
				         <>
					         <Form.Item name="memoryAbility_1"
					                    label="Pierde sus pertenencias personales, tales como libretas, lápices, o estuches, o se olvida de hacer o traer los deberes">
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_2" label="Le cuesta seguir una serie de varias indicaciones seguidas" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_3"
					                    label="Necesita que otras personas le recuerden varias veces ciertas informaciones, como traer de casa algunos materiales para trabajar en el aula">
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_4" label="Le cuesta aprender de memoria los nombres de personas o lugares" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_5" label="Le cuesta aprender canciones o poemas infantiles, incluso los que son sencillos" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_6" label="Tiene dificultad para aprender un horario que sea un poco complejo" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_7"
					                    label="Tiene dificultad para recordar sus datos personales, tales como su fecha de nacimiento, su número de teléfono, su dirección, etc.">
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyA.steps.attentionAbility"),
			content: (
				         <>
					         <Form.Item name="attentionAbility_1" label="Se distrae con facilidad" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="attentionAbility_2"
					                    label="Tiene dificultad para concentrarse en una cosa durante mucho tiempo (por ejemplo, cuando hace tareas, se para con frecuencia, se levanta a hablar con otros/as compañeros/as)">
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="attentionAbility_3"
					                    label="Tiene dificultad para repetir datos que acaba de escuchar, como números de teléfono, nombres de personas o contenido de cuentos">
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyA.steps.sequenceAbility"),
			content: (
				         <>
					         <Form.Item name="sequenceAbility_1" label="Tiene dificultad para asimilar los conceptos de tiempo (no distingue ayer, hoy y mañana)" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="sequenceAbility_2"
					                    label="Se equivoca de orden cuando tiene que aprender de memoria algunas palabras o números en una secuencia (por ejemplo, el orden de las cuatro estaciones o nmeros de teléfono)">
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="sequenceAbility_3" label="Necesita mucho tiempo para aprender a decir la hora" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyA.steps.muscleCoordination"),
			content: (
				         <>
					         <Form.Item name="muscleCoordination_1" label="Cuando colorea un dibujo se sale de los límites" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_2" label="Tiene dificultad cuando corre y salta (por ejemplo, se cae a menudo o se lesiona)"rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_3" label="Cuando hace juegos con mucho movimiento, por ejemplo, saltar la cuerda, se cansa con facilidad" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_4"
					                    label="Su rendimiento motor es bajo (por ejemplo, no puede cumplir los movimientos que le indica el profesorado)">
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_5" label="Le cuesta saltar la cuerda, tirar, coger o dar patadas a la pelota" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_6" label="En la clase no puede dar palmadas siguiendo ritmos sencillos" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_7" label="Le cuesta atarse los cordones y abrocharse los botones mas que a los ninos de su edad" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyA.steps.spatialOrientation"),
			content: (
				         <>
					         <Form.Item name="spatialOrientation_1" label="Le cuesta distinguir entre arriba y abajo o entre izquierda y derecha" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="spatialOrientation_2"
					                    label="Tiene dificultad para orientarse (por ejemplo, necesita mucho tiempo para saber como ir a las diferentes aulas, salas del profesorado o sala de música)">
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyA.steps.emotionsSocialAdaptation"),
			content: (
				         <>
					         <Form.Item name="emotionsSocialAdaptation_1"
					                    label="Le cuesta relacionarse con otras personas (por ejemplo, a menudo discute con los hermanos o con los companeros)">
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="emotionsSocialAdaptation_2" label="Tiene mala imagen de sí mismo" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="emotionsSocialAdaptation_3" label="Se desanima o desiste de hacer las cosas con facilidad" rules={[{ required: true, message: 'Por favor selecciona una opción' }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="emotionsSocialAdaptation_4"
					                    label="Tiene dolor de cabeza, dolor de estómago, se enfada o se pone nervioso cuando se siente presionado">
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}
	];

	const onNext = () => {
		form
			.validateFields()
			.then(() => {
				setMessage(null);
				setCurrentStep(currentStep + 1);
			})
			.catch(() => setMessage({ error: { type: "surveyA.validationError" } }));
	};

	const onPrev = () => {
		setCurrentStep(currentStep - 1);
	};

	const onFinish = async () => {
		const allValues = form.getFieldsValue(true);
		let total = Object.values(allValues).reduce((acc, val) => {
			if ( Number.isInteger(val) && val > 0 ) {
				return acc + val;
			}
			return acc + 0;
		}, 0);
		delete allValues.remember

		let response = null;
		try {
			const url = surveyId
				? `${process.env.REACT_APP_USERS_SERVICE_URL}/surveys/${surveyId}/A`
				: `${process.env.REACT_APP_USERS_SERVICE_URL}/surveys/A`;

			const method = surveyId ? "PUT" : "POST";

			response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`
				},
				body: JSON.stringify({
					studentId,
					score: total,
					responses: allValues
				})
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

	const { Title } = Typography;

	return (
		<Card title={ <Title level={ 3 } style={ { whiteSpace: "normal", wordBreak: "break-word" } }>{ t("surveyA.title") }</Title> } style={ { maxWidth: "70vw" } }>
			{ message?.error?.type && (
				<Alert type="error" message={ t(message?.error?.type) } showIcon style={ { marginBottom: "1vh" } }/>
			) }
			<Steps current={ currentStep } size="small" labelPlacement="vertical" onChange={ (value) => setCurrentStep(value) }>
				{ steps.map((item) => (
					<Step key={ item.title } title={ item.title }/>
				)) }
			</Steps>
			<Flex justify="space-around">
				<Form labelWrap form={ form } name="surveyA" layout="vertical" onFinish={ onFinish } initialValues={ { remember: true } } style={ { marginTop: "2rem" } }>
					{ steps[ currentStep ].content }
					<Flex justify="space-between" gap={ 30 }>
						{ currentStep > 0 && <Button block onClick={ onPrev }>{ t("surveyA.button.prev") }</Button> }
						{ currentStep < steps.length - 1 && <Button block type="primary" onClick={ onNext }>{ t("surveyA.button.next") }</Button> }
						{ currentStep === steps.length - 1 && <Button block type="primary" htmlType="submit">{ t("surveyA.button.submit") }</Button> }
					</Flex>
				</Form>
			</Flex>
		</Card>
	);
};

export default SurveyA;