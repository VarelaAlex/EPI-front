import { Card, Col, Row, Typography }    from "antd";
import React, { useEffect, useState }    from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend }                  from "react-dnd-html5-backend";
import { useNavigate, useParams }        from "react-router-dom";

const { Title } = Typography;
const ItemTypes = { WORD: "word" };

const exercises = [
	{
		activity: "1", content: [
			{ id: 1, phrase: ["El perro", "es", "un animal"], audio: "/audios/perro-animal.mp3" },
			{ id: 2, phrase: ["El perro", "es parte de", "la familia"], audio: "/audios/perro-familia.mp3" },
			{ id: 3, phrase: ["La ballena", "es", "un mamífero"], audio: "/audios/ballena-mamifero.mp3" },
			{ id: 4, phrase: ["La casa", "es para", "vivir"], audio: "/audios/casa-vivir.mp3" }
		]
	}, {
		activity: "2", content: [
			{ id: 1, phrase: ["El perro", "tiene", "cola"], audio: "/audios/perro-cola.mp3" },
			{ id: 2, phrase: ["La ballena", "está en", "el mar"], audio: "/audios/ballena-mar.mp3" },
			{ id: 3, phrase: ["La sartén", "sirve para", "cocinar"], audio: "/audios/sarten-cocinar.mp3" }
		]
	}
];

function shuffledArray(arr) {
	const a = [...arr];
	for ( let i = a.length - 1 ; i > 0 ; i-- ) {
		const j = Math.floor(Math.random() * (
			i + 1
		));
		[a[ i ], a[ j ]] = [a[ j ], a[ i ]];
	}
	return a;
}

function DraggableCard({ id, text, disabled }) {
	const [{ isDragging }, drag] = useDrag(() => (
		{
			type:    ItemTypes.WORD,
			item:    { id, text },
			collect: (monitor) => (
				{ isDragging: !!monitor.isDragging() }
			),
			canDrag: () => !disabled
		}
	), [id, text, disabled]);

	return (
		<div ref={ drag } style={ { opacity: isDragging ? 0.4 : 1 } }>
			<Card
				hoverable
				style={ {
					width:          140,
					height:         80,
					display:        "flex",
					alignItems:     "center",
					justifyContent: "center",
					fontWeight:     600,
					cursor:         disabled ? "not-allowed" : "grab",
					opacity:        disabled ? 0.5 : 1
				} }
			>
				{ text }
			</Card>
		</div>
	);
}

function DropSlot({ index, expectedText, value, enabled, onDrop }) {
	const [{ isOver, canDrop }, drop] = useDrop(() => (
		{
			accept:  ItemTypes.WORD,
			canDrop: (item) => enabled && item.text === expectedText,
			drop:    (item) => onDrop(index, item),
			collect: (monitor) => (
				{ isOver: monitor.isOver(), canDrop: monitor.canDrop() }
			)
		}
	), [expectedText, enabled]);

	return (
		<div ref={ drop } style={ { margin: "0 8px" } }>
			<Card
				style={ {
					width:           140,
					height:          80,
					display:         "flex",
					alignItems:      "center",
					justifyContent:  "center",
					borderColor:     value ? "green" : isOver && canDrop ? "blue" : "#d9d9d9",
					backgroundColor: value ? "#d4edda" : "#fafafa",
					fontWeight:      600
				} }
			>
				{ value || "____" }
			</Card>
		</div>
	);
}

export default function PhrasesActivity() {
	const { activity } = useParams();
	const navigate = useNavigate();

	const [exerciseIndex, setExerciseIndex] = useState(0);
	const [slots, setSlots] = useState([]);
	const [pool, setPool] = useState([]);

	useEffect(() => {
		const ex = exercises.find(e=>e.activity===activity).content[ exerciseIndex ];
		if ( !ex ) {
			return;
		}

		setSlots(Array(ex.phrase.length).fill(null));

		const base = ex.phrase.map((text, i) => (
			{ id: `${ exerciseIndex }-${ i }`, text, used: false }
		));
		const shuffled = shuffledArray(base);
		setPool(shuffled);

		if ( ex.audio ) {
			try {
				new Audio(ex.audio).play().catch(() => {});
			}
			catch ( e ) {
			}
		}
	}, [activity, exerciseIndex]);

	function handleDrop(index, item) {
		const ex = exercises.find(e=>e.activity===activity).content[ exerciseIndex ];
		if ( !ex ) {
			return;
		}

		const expected = ex.phrase[ index ];
		if ( item.text === expected ) {
			setSlots(prev => {
				const next = [...prev];
				if ( !next[ index ] ) {
					next[ index ] = item.text;
				}
				return next;
			});
			setPool(prev => prev.map(p => (
				p.id === item.id ? { ...p, used: true } : p
			)));
		}
	}

	useEffect(() => {
		const ex = exercises.find(e=>e.activity===activity).content[ exerciseIndex ];
		if ( !ex ) {
			return;
		}
		const completed = slots.length > 0 && slots.every((s, i) => s === ex.phrase[ i ]);
		if ( completed ) {
			setTimeout(() => {
				if ( exerciseIndex < exercises.find(e=>e.activity===activity).content.length - 1 ) {
					setExerciseIndex(i => i + 1);
				} else {
					if (activity === "1") {
						navigate("/students/pretraining/block/2/activity/2");
					}
				}
			}, 600);
		}
	}, [slots, exerciseIndex, activity]);

	const currentExercise = exercises.find(e=>e.activity===activity).content[ exerciseIndex ];
	if ( !currentExercise ) {
		return <div>No hay ejercicios</div>;
	}

	const visiblePool = pool.filter(p => !p.used);

	return (
		<DndProvider backend={ HTML5Backend }>
			<div style={ { padding: 20 } }>
				<Title level={ 3 } style={ { textAlign: "center" } }>
					Actividad { activity || "?" }: Definiciones
				</Title>

				<Row gutter={ [16, 16] } justify="center" style={ { marginBottom: 40 } }>
					{ visiblePool.map(({ id, text }, idx) => (
						<Col key={ id }>
							<DraggableCard id={ id } text={ text }/>
						</Col>
					)) }
				</Row>

				<Row justify="center">
					{ currentExercise.phrase.map((expected, i) => (
						<DropSlot
							key={ i }
							index={ i }
							expectedText={ expected }
							value={ slots[ i ] }
							enabled={ i === 0 ? true : !!slots[ i - 1 ] }
							onDrop={ handleDrop }
						/>
					)) }
				</Row>
			</div>
		</DndProvider>
	);
}