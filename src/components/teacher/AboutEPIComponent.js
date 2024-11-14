import { ClusterOutlined, EllipsisOutlined, UnorderedListOutlined }              from "@ant-design/icons";
import { Button, Card, Collapse, Flex, Image, Popover, Table, Tabs, Typography } from "antd";
import React, { useState }                                                       from "react";
import "../assets/styles/nestedList.css";

const AboutEPI = () => {
	let fontSize = "16px";

	const [activeTabKey, setActiveTabKey] = useState("1");

	const nivelesData = [
		{ key: "1", red: "Icónica", "I-I": "3 años", "I-II": "3-4 años", "I-III": "4 años" },
		{ key: "2", red: "Combinada", "I-I": "5 años", "I-II": "5-6 años", "I-III": "6 años" },
		{ key: "3", red: "Simbólica", "I-I": "7 años", "I-II": "7-8 años", "I-III": "8 años" }
	];

	const getColor = (value) => {
		const colors = {
			"3 años":   "rgb(0, 210, 0)",
			"3-4 años": "rgb(0, 180, 0)",
			"4 años":   "rgb(0, 150, 0)",
			"5 años":   "rgb(210, 210, 0)",
			"5-6 años": "rgb(180, 180, 0)",
			"6 años":   "rgb(150, 150, 0)",
			"7 años":   "rgb(240, 0, 0)",
			"7-8 años": "rgb(200, 0, 0)",
			"8 años":   "rgb(150, 0, 0)"
		};
		return colors[ value ];
	};

	const columns = [
		{ title: "", dataIndex: "red", key: "red", render: text => <b>{ text }</b> }, {
			title:     "Red I-I",
			dataIndex: "I-I",
			key:       "I-I",
			render:    text => <span style={ { color: getColor(text) } }>{ text }</span>
		}, {
			title:     "Red I-II",
			dataIndex: "I-II",
			key:       "I-II",
			render:    text => <span style={ { color: getColor(text) } }>{ text }</span>
		}, {
			title:     "Red I-III",
			dataIndex: "I-III",
			key:       "I-III",
			render:    text => <span style={ { color: getColor(text) } }>{ text }</span>
		}
	];

	const imagesLinearText = [
		{
			src:         "TextoLineal1-1Iconica.png",
			title:       "Icónica",
			description: "Texto lineal de una red I-I en representación icónica"
		}, {
			src:         "TextoLineal1-2Combinada.png",
			title:       "Combinada",
			description: "Texto lineal de una red I-II en representación combinada"
		}, {
			src:         "TextoLineal1-3Simbolica.png",
			title:       "Simbólica",
			description: "Texto lineal de una red I-III en representación simbólica"
		}
	];

	const imagesHypertext = [
		{
			src:         "Hypertexto1-1Iconica.png",
			title:       "Red I-I",
			description: "Hypertexto de una red I-I en representación icónica"
		}, {
			src:         "Hypertexto1-2Combinada.png",
			title:       "Red I-II",
			description: "Hypertexto de una red I-II en representación combinada"
		}, {
			src:         "Hypertexto1-3Simbolica.png",
			title:       "Red I-III",
			description: "Hypertexto de una red I-III en representación simbólica"
		}
	];

	const imagesMarks = [
		{
			src:         `${ process.env.REACT_APP_ARASAAC_URL }/pictograms/${ 8289 }`,
			title:       "Stop",
			description: "Esta imagen se utiliza en representación icónica y combinada para representar las pausas en una oración."
		}
	];

	const { Title, Paragraph, Text } = Typography;
	const { Meta } = Card;
	let { PreviewGroup } = Image;

	const handleHypertextoClick = () => {
		setActiveTabKey("2");
	};

	const [clicked, setClicked] = useState(false);
	const [hovered, setHovered] = useState(false);
	const hide = () => {
		setClicked(false);
		setHovered(false);
	};
	const handleHoverChange = (open) => {
		setHovered(open);
		setClicked(false);
	};
	const handleClickChange = (open) => {
		setHovered(false);
		setClicked(open);
	};
	let content = <Image
		alt="Pictogramas"
		src={ "/images/Pictogramas.png" }
		height="14vmax"
	/>;

	const tabItems = [
		{
			key:      "1",
			icon:     <UnorderedListOutlined/>,
			label:    "Texto lineal",
			children: (
				          <>
					          <Paragraph style={ { fontSize } }>
						          Un mensaje lineal puede representarse de tres maneras distintas:
					          </Paragraph>
					          <ol style={ { fontSize } }>
						          <li>
							          <b>Icónica:</b> Solo imágenes.
						          </li>
						          <li>
							          <b>Combinada:</b> Imágenes y palabras.
						          </li>
						          <li>
							          <b>Simbólica:</b> Solo palabras.
						          </li>
					          </ol>
					          <Paragraph style={ { fontSize } }>
						          Cada mensaje incluye un título y dos frases que definen y amplían el contenido. Las
						          imágenes que se
						          presentan a continuación son ejemplos de textos lineales en diferentes
						          representaciones y tipos de red,
						          que se explican en la sección{ " " }
						          <Text
							          strong
							          underline
							          onClick={ handleHypertextoClick }
							          style={ {
								          fontSize, cursor: "pointer", color: "#1890ff"
							          } }
						          >
							          Hypertexto
						          </Text>.
					          </Paragraph>
					          <Flex justify="center" wrap gap="large">
						          <PreviewGroup>
							          { imagesLinearText.map((image, index) => (
								          <Card
									          hoverable
									          key={ index }
									          cover={ <Image alt={image.description} src={ `/images/${ image.src }` } height="15vmax"/> }
								          >
									          <Meta title={ image.title } description={ image.description }/>
								          </Card>
							          )) }
						          </PreviewGroup>
					          </Flex>
				          </>
			          )
		}, {
			key:      "2",
			icon:     <ClusterOutlined/>,
			label:    "Hypertexto",
			children: (
				          <>
					          <Paragraph style={ { fontSize } }>
						          El texto lineal se organiza en una red o esquema de Hypertexto. Esta estructura puede
						          ser de tres tipos:
					          </Paragraph>
					          <ol style={ { fontSize } }>
						          <li>
							          <b>Red I-I:</b>
						          </li>
						          <li>
							          <b>Red I-II:</b>
						          </li>
						          <li>
							          <b>Red I-III:</b>
						          </li>
					          </ol>
					          <Paragraph style={ { fontSize } }>
						          Para organizar la información, se siguen ciertas normas, como colocar el título en un
						          rectángulo, los
						          contenidos en bolos y los{ " " }
						          <Popover
							          style={ { width: 500 } }
							          content={ content }
							          title="Pictogramas y sus verbos de enlace"
							          trigger="hover"
							          open={ hovered }
							          onOpenChange={ handleHoverChange }
						          >
							          <Popover
								          content={ <Flex vertical align="end" gap={ 15 }>
									          { content }
									          <Text
										          style={ {
											          fontSize, cursor: "pointer", color: "#1890ff"
										          } }
										          onClick={ hide }
									          >
										          Close
									          </Text>
								          </Flex> }
								          title="Pictogramas y sus verbos de enlace"
								          trigger="click"
								          open={ clicked }
								          onOpenChange={ handleClickChange }
							          >
								          <Button>pictogramas</Button>
							          </Popover>
						          </Popover>{ " " }
						          o verbos en los enlaces.
					          </Paragraph>
					          <Flex justify="center" wrap gap="large">
						          <PreviewGroup>
							          { imagesHypertext.map((image, index) => (
								          <Card
									          hoverable
									          key={ index }
									          cover={ <Image alt={ image.description } src={ `/images/${ image.src }` } height="14vmax"/> }
								          >
									          <Meta title={ image.title } description={ image.description }/>
								          </Card>
							          )) }
						          </PreviewGroup>
					          </Flex>
				          </>
			          )
		}, {
			key:      "3",
			icon:     <EllipsisOutlined/>,
			label:    "Signos de puntuación",
			children: (
				          <>
					          <Paragraph style={ { fontSize } }>
						          El programa también se enfoca en la expresión, incorporando pausas al organizar la
						          información. En las
						          representaciones icónica y combinada, se utilizan imágenes como <i>stop</i> grande
						          para el punto (.) y
						          <i>stop</i> pequeño para la coma (,) y la “y”. En la representación simbólica, se
						          emplean los signos de
						          puntuación: coma (,), “y” y punto (.).
					          </Paragraph>
					          <Flex justify="center" align="center" style={ { width: "100%" } }>
						          <PreviewGroup>
							          { imagesMarks.map((image, index) => (
								          <Card
									          hoverable
									          key={ index }
									          cover={ <div style={ {
										          display: "flex", justifyContent: "center", padding: "10px"
									          } }>
										          <Image alt={ image.description } src={ image.src } width="6vmax"/>
									          </div> }
								          >
									          <Meta
										          title={ image.title }
										          description={ image.description }
										          style={ {
											          wordWrap: "break-word", whiteSpace: "normal", maxWidth: "400px"
										          } }
									          />
								          </Card>
							          )) }
						          </PreviewGroup>
					          </Flex>
				          </>
			          )
		}
	];

	const collapseItems = [
		{
			key:      "1",
			label:    "Componentes principales de la estrategia Hypertexto",
			children: (
				          <Tabs activeKey={ activeTabKey } onChange={ setActiveTabKey } type="card" size="large"
				                items={ tabItems }/>
			          )
		}, {
			key:      "2",
			label:    "Niveles de Hypertexto",
			children: (
				          <>
					          <div style={ { paddingBottom: "10px" } }>
						          La edad recomendada para cada ejercicio depende del tipo de red y de la representación
						          de cada ejercicio.
					          </div>
					          <Table columns={ columns } dataSource={ nivelesData } pagination={ false } bordered/>
				          </>
			          )
		}, {
			key:      "3",
			label:    "Fases de un ejercicio",
			children: (
				          <>
					          La realización de un ejercicio en esta aplicación se compone de tres pasos fundamentales,
					          organizados en
					          dos fases distintas. Este enfoque estructurado no solo facilita la comprensión del
					          proceso, sino que
					          también fomenta el desarrollo de habilidades de lectoescritura en los alumnos. A
					          continuación, se
					          detallan las fases y pasos involucrados:
					          <ol className="outer-list">
						          <li>
							          <strong>Primera fase:</strong>
							          <br/>
							          En esta fase, el alumno se enfrenta a los dos primeros pasos del ejercicio,
							          diseñados para
							          fortalecer su capacidad de lectura y organización de la información.
							          <ol className="sub-list">
								          <li>
									          <i>Lee:</i> El alumno debe leer atentamente el texto lineal ubicado en la
									          parte superior de la
									          pantalla. Este primer paso es crucial, ya que promueve la atención y la
									          comprensión lectora.
									          Al interactuar con el contenido, el alumno no solo adquiere información,
									          sino que también se
									          familiariza con la estructura del texto, esencial para su desarrollo
									          lector.
								          </li>
								          <li>
									          <i>Ordena:</i> Después de la lectura, el alumno debe colocar cada elemento
									          del texto lineal en el
									          sitio correspondiente. Este ejercicio de ordenación ayuda a los
									          estudiantes a conectar ideas y
									          conceptos, desarrollando así habilidades críticas de organización y
									          síntesis de información. Al
									          realizar esta tarea, los alumnos refuerzan su capacidad para interpretar y
									          estructurar textos,
									          habilidades fundamentales en el aprendizaje de la lectoescritura.
								          </li>
							          </ol>
						          </li>
						          <li>
							          <strong>Segunda fase:</strong>
							          <br/>
							          En esta fase se lleva a cabo el último paso del ejercicio, donde el alumno aplica
							          lo aprendido en la
							          primera fase.
							          <ol className="sub-list">
								          <li>
									          <i>Expresa:</i> En este paso, la red Hypertexto se presenta en la parte
									          superior de la pantalla.
									          Aquí, el alumno debe ejecutar el proceso inverso, colocando ordenadamente
									          los elementos en el
									          texto lineal. Esta actividad no solo refuerza la comprensión del
									          contenido, sino que también
									          promueve la expresión escrita, al pasar a la representación simbólica. A
									          través de este
									          ejercicio, el alumno tiene la oportunidad de reorganizar la información y
									          articular sus
									          pensamientos de manera coherente, lo cual es fundamental para desarrollar
									          habilidades de
									          escritura efectiva y creativa.
								          </li>
							          </ol>
						          </li>
					          </ol>
					          A través de este proceso estructurado y dinámico, la aplicación no solo favorece la
					          lectoescritura, sino
					          que también brinda a los alumnos las herramientas necesarias para desarrollar una
					          comprensión profunda del
					          texto y la capacidad de expresarse de manera clara y organizada. Este enfoque no solo
					          mejora las
					          habilidades de lectura y escritura, sino que también fomenta un aprendizaje activo y
					          participativo.
				          </>
			          )
		}
	];

	return (
		<Card style={ { margin: "20px", width: "80%" } }>
			<Title>Estrategia Hypertexto</Title>
			<Paragraph style={ { fontSize } }>
				Hypertexto es una estrategia que facilita la gestión de la información, promoviendo el recuerdo, la
				comprensión y la expresión. Con Hypertexto, se aborda tanto la estructura de un contenido, organizándolo
				en redes, como el uso de signos y pictogramas para una comunicación más efectiva.
			</Paragraph>
			<Collapse items={ collapseItems } size="large" accordion/>
		</Card>
	);
};

export default AboutEPI;