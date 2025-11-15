import { HomeOutlined, ReloadOutlined }                                               from "@ant-design/icons";
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors }   from "@dnd-kit/core";
import { Card, Col, Divider, Flex, Row }                                              from "antd";
import React, { useEffect, useRef, useState }                                         from "react";
import {useNavigate, useParams} from "react-router-dom";
import useFullscreen                                                                  from "../../hooks/useFullscreen";
import { useSession }                                                                 from "../SessionComponent";
import DraggablePhase2                                                                from "./DraggablePhase2Component";
import DroppablePhase2                                                                from "./DroppablePhase2Component";
import { nexusX, nodes, pathBottom, pathBottom2, pathTop, stopX, viewBoxWidth, X, Y } from "./NetworkProps";
import "../assets/fonts/massallera.TTF";
import {finishExperiment, finishTracking, initTracking, registerElement} from "../../scriptTest2";
import {useCompleteExercise} from "../../hooks/useCompleteExercise";
import {useExerciseProgressUpdater} from "../../hooks/useExerciseProgressUpdater";

let DnDPhase2 = () => {

    let {trainingMode} = useParams();

	useFullscreen();

	const INITIAL_ELEMENT = 0;

	let { setExercise, feedback, setFeedback, exercise } = useSession();
    let {completeExercise, message} = useCompleteExercise();
    const updateExerciseProgress = useExerciseProgressUpdater();

    let exerciseNodes = nodes(exercise);

	useEffect(() => {
		exerciseNodes.forEach((node) => {
			registerElement(`${exercise.title}_${exercise.representation}_${exercise.networkType}.phase2`, 1, document.getElementById(node.id));
		})
		initTracking(`${exercise.title}_${exercise.representation}_${exercise.networkType}.phase2`);
	}, []);

	useEffect(() => {
		if ( feedback?.phase2?.elapsedTime ) {
			saveFeedback(feedback);
		}
	}, [feedback]);

	let startTime = useRef(Date.now());

	let navigate = useNavigate();
	let [showGif, setShowGif] = useState(false);
	let [element, setElement] = useState();

	const INITIAL_EXTENDED_NODES = [
		{ ...exerciseNodes[ 0 ], order: 0, id: "1-1" },
		{ ...exerciseNodes[ 0 ], order: 1, id: "1-2" },
		...exerciseNodes.slice(1, 3),
		{ ...exerciseNodes[ 5 ], order: 4, id: "6-2", type: "type6-2", src: `${ process.env.REACT_APP_ARASAAC_URL }/pictograms/8289`, bigStop: true },
		{ ...exerciseNodes[ 0 ], order: 5, id: "1-3" },
		...exerciseNodes.slice(3, 5),
		...exerciseNodes.slice(6),
		{
			...exerciseNodes[ 5 ],
			order:   exerciseNodes.length + 2,
			id:      "6-3",
			type:    "type6-3",
			posX:    nexusX(exercise?.networkType) + stopX(exercise?.networkType),
			src:     `${ process.env.REACT_APP_ARASAAC_URL }/pictograms/8289`,
			bigStop: true
		}
	];

	let [extendedNodes, setExtendedNodes] = useState(INITIAL_EXTENDED_NODES);

	let [droppableNodes, setDroppableNodes] = useState(JSON.parse(JSON.stringify(INITIAL_EXTENDED_NODES)));
	let [current, setCurrent] = useState(INITIAL_ELEMENT);
	let [timer, setTimer] = useState(undefined);

	let saveFeedback = async (feedback) => {

		try {
			await fetch(`${ process.env.REACT_APP_EXERCISES_SERVICE_URL }/statistics`, {
				method:  "POST", headers: {
					"Content-Type": "application/json", Authorization: `Bearer ${ localStorage.getItem("accessToken") }`
				}, body: JSON.stringify({ feedback })
			});
		}
		catch ( e ) {

		}
	};

	let handleDragStart = (event) => {
		setElement(event.active);
	};

	let handleDragEnd = (event) => {
		let { active, over } = event;
		let node = null;
		let correct = false;
		let sintactic = element.data.current.stop || element.data.current.bigStop;
		let semantic = element.data.current.nexus;
		if ( over ) {
			if ( over.data.current.accepts.includes(active.data.current.type) ) {
				let updated = extendedNodes.map((element) => {
					if ( element.id === active.id ) {
						if ( element.order === current ) {
							element.ok = true;
							node = element;
							setCurrent(current + 1);
							correct = true;
						} else {
							setFeedback({
								            phase1: { ...feedback.phase1 }, phase2: sintactic ? {
									...feedback.phase2,

									incorrectOrderSintactic: feedback?.phase2?.incorrectOrderSintactic == null ? 1 : feedback?.phase2?.incorrectOrderSintactic + 1
								} : semantic ? {
									...feedback.phase2, incorrectOrderSemantic: feedback?.phase2?.incorrectOrderSemantic == null ? 1 : feedback?.phase2?.incorrectOrderSemantic + 1
								} : {
									...feedback.phase2, incorrectOrderLexical: feedback?.phase2?.incorrectOrderLexical == null ? 1 : feedback?.phase2?.incorrectOrderLexical + 1
								}
							            });
						}
					}
					return element;
				});
				setExtendedNodes(updated);
				correct && setDroppableNodes(updated);
			} else {
				setFeedback({
					            phase1: { ...feedback.phase1 }, phase2: sintactic ? {
						...feedback.phase2,

						incorrectPosSintactic: feedback?.phase2?.incorrectPosSintactic == null ? 1 : feedback?.phase2?.incorrectPosSintactic + 1
					} : semantic ? {
						...feedback.phase2, incorrectPosSemantic: feedback?.phase2?.incorrectPosSemantic == null ? 1 : feedback?.phase2?.incorrectPosSemantic + 1
					} : {
						...feedback.phase2, incorrectPosLexical: feedback?.phase2?.incorrectPosLexical == null ? 1 : feedback?.phase2?.incorrectPosLexical + 1
					}
				            });
			}
		} else {
			setFeedback({
				            phase1: { ...feedback.phase1 }, phase2: sintactic ? {
					...feedback.phase2,

					outOfBoundsSintactic: feedback?.phase2?.outOfBoundsSintactic == null ? 1 : feedback?.phase2?.outOfBoundsSintactic + 1
				} : semantic ? {
					...feedback.phase2, outOfBoundsSemantic: feedback?.phase2?.outOfBoundsSemantic == null ? 1 : feedback?.phase2?.outOfBoundsSemantic + 1
				} : {
					...feedback.phase2, outOfBoundsLexical: feedback?.phase2?.outOfBoundsLexical == null ? 1 : feedback?.phase2?.outOfBoundsLexical + 1
				}
			            });
		}

		if ( node?.id === "6-3" ) {
			let endTime = Date.now();
			setFeedback({
				            phase1: { ...feedback.phase1 }, phase2: {
					...feedback.phase2,
					elapsedTime: (
						             endTime - startTime.current
					             ) / 1000
				}, title:           exercise.title, representation: exercise.representation, networkType: exercise.networkType, date: Date.now()
			            });
			setShowGif(true);
			setTimer(setTimeout(() => {
				finishExperiment();
				finishTracking("/students/exercises");
				setShowGif(false);
                completeExercise(exercise._id).then(()=> {
                    updateExerciseProgress(exercise.representation, exercise.networkType).then(() => {
                        navigate(`/students/exercises/${trainingMode}`)
                    })

                });
			}, 3000));
		}
		setElement(null);
	};

	const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

	const getImagePosition = (x, y, nexus, stop, bigStop, shape) => {
		if ( nexus ) {
			return { x: "1.5vmax", y: "0.6vmax", width: 80, height: 40 };
		}
		if ( stop ) {
			return { x: "0vmax", y: "0vmax", width: "2vmax", height: "2vmax" };
		}
		if ( bigStop ) {
			return { x: "0vmax", y: "0vmax", width: "3vmax", height: "3vmax" };
		}
		if ( shape === "ellipse" ) {
			return { x: 30, y: 0, width: "55", height: "55" };
		}
		return { x: 38, y: 2, width: "55", height: "55" };
	};

	const getTextPosition = (x, y, bigStop, stop, shape, text) => {
		if ( text==="and" ) {
			return { x: "3.3vmax", y: "2vmax", fontSize: "1.3vmax" };
		}
		if ( stop ) {
			return { x: "3vmax", y: "2vmax", fontSize: "2vmax" };
		}
		if ( bigStop ) {
			return { x: "3.5vmax", y: "3vmax", fontSize: "3vmax" };
		}
		if ( shape === "ellipse" ) {
			return { x: 60, y: 65, fontSize: "12" };
		}
		if ( shape === "rect" ) {
			return { x: 60, y: 68, fontSize: "13" };
		}
		return { x: "4.2vmax", y: "4vmax", fontSize: "1.2vmax" };
	};

	let strokeColor = () => {
		switch ( element.data.current.type ) {
			case "type5":
				return "rgb(255, 196, 101)";
			case "type8":
				return "rgb(21, 232, 223)";
			case "type10":
				return "rgb(207, 143, 251)";
			default:
				return "black";
		}
	};

	let getDragElement = () => {
		if ( element.data.current.nexus ) {
			return (
				<g>
					<image href={ element.data.current.src } { ...getImagePosition(
						element.data.current.x,
						element.data.current.y,
						element.data.current.nexus,
						element.data.current.stop,
						element.data.current.bigStop,
						element.data.current.shape
					) } />
					<text { ...getTextPosition(
						element.data.current.x,
						element.data.current.y,
						element.data.current.bigStop,
						element.data.current.stop,
						element.data.current.shape,
						element.data.current.text
					) } fill="black" textAnchor="middle" fontFamily="Massallera">
						{ element.data.current.text }
					</text>
				</g>
			);
		}
		if ( element.data.current.shape === "rect" ) {
			return (
				<g>
					<rect width="120" height="75" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" strokeWidth="3"/>
					<image href={ element.data.current.src } { ...getImagePosition(
						element.data.current.x,
						element.data.current.y,
						element.data.current.nexus,
						element.data.current.stop,
						element.data.current.bigStop,
						element.data.current.shape
					) } />
					<text { ...getTextPosition(
						element.data.current.x,
						element.data.current.y,
						element.data.current.bigStop,
						element.data.current.stop,
						element.data.current.shape,
						element.data.current.text
					) } fill="black" textAnchor="middle" fontFamily="Massallera">
						{ element.data.current.text }
					</text>
				</g>
			);
		}
		if ( element.data.current.shape === "ellipse" ) {
			return (
				<g>
					<ellipse
						cx="60"
						cy="40"
						rx="60"
						ry="40"
						fill="white"
						stroke={ strokeColor() }
						strokeWidth="3"
					/>
					<image href={ element.data.current.src } { ...getImagePosition(
						element.data.current.x,
						element.data.current.y,
						element.data.current.nexus,
						element.data.current.stop,
						element.data.current.bigStop,
						element.data.current.shape
					) } />
					<text { ...getTextPosition(
						element.data.current.x,
						element.data.current.y,
						element.data.current.bigStop,
						element.data.current.stop,
						element.data.current.shape,
						element.data.current.text
					) } fill="black" textAnchor="middle" fontFamily="Massallera">
						{ element.data.current.text }
					</text>
				</g>
			);
		}
		if ( element.data.current.stop ) {
			return (
				<g>
					<image href={ element.data.current.src } { ...getImagePosition(
						element.data.current.x,
						element.data.current.y,
						element.data.current.nexus,
						element.data.current.stop,
						element.data.current.bigStop,
						element.data.current.shape
					) } />
					<text { ...getTextPosition(
						element.data.current.x,
						element.data.current.y,
						element.data.current.bigStop,
						element.data.current.stop,
						element.data.current.shape,
						element.data.current.text
					) } fill="black" textAnchor="middle" fontFamily="Massallera">
						{ element.data.current.text }
					</text>
				</g>
			);
		}
		if ( element.data.current.bigStop ) {
			return (
				<g>
					<image href={ element.data.current.src } { ...getImagePosition(
						element.data.current.x,
						element.data.current.y,
						element.data.current.nexus,
						element.data.current.stop,
						element.data.current.bigStop,
						element.data.current.shape
					) } />
					<text { ...getTextPosition(
						element.data.current.x,
						element.data.current.y,
						element.data.current.bigStop,
						element.data.current.stop,
						element.data.current.shape,
						element.data.current.text
					) } fill="black" textAnchor="middle" fontFamily="Massallera">
						{ element.data.current.text }
					</text>
				</g>
			);
		}
	};

	let pathRect = (exercise) => {
		if ( "I-I" === exercise?.networkType ) {
			return "220";
		}
		if ( "I-II" === exercise?.networkType ) {
			return "310";
		}
		if ( "I-III" === exercise?.networkType ) {
			return "460";
		}
	};

	return (
		<Card style={ { height: "53vmax", width: "95%" } }>
			<div style={ { position: "absolute", top: "10px", right: "10px" } }>
				<ReloadOutlined style={ { fontSize: "45px", cursor: "pointer" } } onClick={ () => {
					setExercise(exercise);
					setExtendedNodes(INITIAL_EXTENDED_NODES);
					setDroppableNodes(INITIAL_EXTENDED_NODES);
					startTime.current = Date.now();
					setCurrent(INITIAL_ELEMENT);
					setFeedback({ phase1: { ...feedback.phase1 } });
				} }/>
				<HomeOutlined style={ { fontSize: "45px", cursor: "pointer", paddingLeft: "20px" } } onClick={ () => {
					setExercise(undefined);
					setExtendedNodes(undefined);
					setDroppableNodes(undefined);
					startTime.current = undefined;
					setCurrent(undefined);
					setFeedback(undefined);
					clearTimeout(timer);
					navigate(`/students/exercises/${trainingMode}`);
				} }/>
			</div>
			<Flex align="center" vertical>
				<DndContext onDragStart={ handleDragStart } onDragEnd={ handleDragEnd } sensors={ sensors }>
					<Flex align="center" justify="center">
						<svg height="20vmax" viewBox={ `-2 -2 ${ viewBoxWidth(exercise?.networkType) } 250` }>
							<path d={ `M ${ pathRect(exercise) } 70 L ${ pathRect(exercise) } 85 ${ pathTop(exercise?.networkType) }` } fill="none" stroke="rgb(255, 196, 101)"
							      strokeWidth="3"/>
							<path d={ `M ${ pathRect(exercise) } 70 L ${ pathRect(exercise) } 85 L 60 85 L 60 95` } fill="none" stroke="rgb(0, 0, 0)" strokeWidth="3"/>
							<path d="M 60 150 L 60 165" fill="none" stroke="rgb(0, 0, 0)" strokeWidth="3"/>
							<path d={ `M 350 165 ${ pathBottom(exercise?.networkType) }` } fill="none" stroke="rgb(255, 196, 101)" strokeWidth="3"/>
							{ ["I-II", "I-III"].includes(exercise?.networkType) && <path
								d={ pathBottom2(exercise?.networkType) }
								fill="none"
								stroke="rgb(21, 232, 223)"
								strokeWidth="3"
							/> }

							{ exercise?.networkType === "I-III" && <path
								d="M 570 145 L 570 150 L 790 150 L 790 165"
								fill="none"
								stroke="rgb(207, 143, 251)"
								strokeWidth="3"
							/> }

							{ extendedNodes.slice().sort((a, b) => b.order - a.order).map((element) => <DraggablePhase2
								key={ element.id }
								id={ element.id }
								type={ element.type }
								x={ X + element.posX }
								y={ Y + element.posY }
								ok={ element.ok }
								src={ element.src }
								text={ element.text }
								stop={ element.stop }
								bigStop={ element.bigStop }
								nexus={ element.nexus }
								shape={ element.shape }
							/>) }
						</svg>
						<DragOverlay>
							{ element?.id ? <svg viewBox={ element?.data.current.shape ? `-2 -2 125 125` : null }>
								{ getDragElement() }
							</svg> : null }
						</DragOverlay>
					</Flex>
					<Divider style={ { backgroundColor: "grey" } }/>
					<Flex align="start" vertical style={ { padding: "1vmax 0vmax 5vh" } }>
						<Row>
							<Col>
								<DroppablePhase2
									id={ droppableNodes[ 0 ].id }
									type={ droppableNodes[ 0 ].type }
									x={ X + droppableNodes[ 0 ].posX }
									y={ Y + droppableNodes[ 0 ].posY }
									ok={ droppableNodes[ 0 ].ok }
									src={ droppableNodes[ 0 ].src }
									text={ droppableNodes[ 0 ].text }
									shape={ droppableNodes[ 0 ].shape }
								/>
							</Col>
						</Row>
						<Row>
							{ droppableNodes.slice(1, 5)
							                .map((element) => (
								                <Col key={ element.id } style={ { paddingRight: "0.5vmax" } }>
									                <DroppablePhase2
										                id={ element.id }
										                type={ element.type }
										                x={ X + element.posX }
										                y={ Y + element.posY }
										                ok={ element.ok }
										                src={ element.src }
										                text={ element.text }
										                shape={ element.shape }
										                stop={ element.stop }
										                bigStop={ element.bigStop }
										                nexus={ element.nexus }
									                />
								                </Col>
							                )) }
						</Row>
						<Row>
							{ droppableNodes.slice(5)
							                .map((element) => (
								                <Col key={ element.id } style={ { paddingRight: "0.5vmax" } }>
									                <DroppablePhase2
										                id={ element.id }
										                type={ element.type }
										                x={ X + element.posX }
										                y={ Y + element.posY }
										                ok={ element.ok }
										                src={ element.src }
										                text={ element.text }
										                shape={ element.shape }
										                stop={ element.stop }
										                bigStop={ element.bigStop }
										                nexus={ element.nexus }
									                />
								                </Col>
							                )) }
						</Row>
					</Flex>
				</DndContext>
				{ showGif && <img
					src="/reinforcement/pawpatrol.webp"
					className="moving-image"
					alt="Moving"
					style={ {
						position: "fixed", right: "20vw", bottom: "50vh", height: "20vmax", transform: "scaleX(-1)"
					} }/> }
			</Flex>
		</Card>
	);
};

export default DnDPhase2;