import React, { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Row, Col, Card, Typography } from "antd";
import "../assets/styles/PictogramActivity.css";

const { Title } = Typography;

const pictograms = [
	{ id: "es", label: "ES", audio: "/sounds/is.mp3" },
	{ id: "es_para", label: "ES PARA", audio: "/sounds/isFor.mp3"},
	{ id: "es_parte_de", label: "ES PARTE DE", audio: "/sounds/isPartOf.mp3"},
];

function DraggablePictogram({ pictogram, isBlinking, isEscaping, onPlay, forwardRef }) {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "PICTO",
		item: { id: pictogram.id },
		collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
	}));

	// soporte forwardRef tanto si es función como ref object
	const setRef = (node) => {
		drag(node);
		if (!forwardRef) return;
		if (typeof forwardRef === "function") forwardRef(node);
		else forwardRef.current = node;
	};

	return (
		<div
			ref={setRef}
			className={`pictogram-card ${isBlinking ? "blink" : ""} ${isEscaping ? "escape" : ""}`}
			style={{ opacity: isDragging ? 0 : 1 }}
			onClick={() => onPlay(pictogram.id)}
		>
			<Card hoverable style={{ width: 140, height: 140, textAlign: "center" }}>
				<div style={{ fontWeight: "700" }}>{pictogram.label}</div>
			</Card>
		</div>
	);
}

function DropZone({ blinking, onDrop, forwardRef }) {
	const [, drop] = useDrop(() => ({
		accept: "PICTO",
		drop: (item) => onDrop(item.id),
		collect: (monitor) => ({ isOver: !!monitor.isOver() }),
	}));

	const setRef = (node) => {
		drop(node);
		if (!forwardRef) return;
		if (typeof forwardRef === "function") forwardRef(node);
		else forwardRef.current = node;
	};

	return (
		<div
			ref={setRef}
			className={`dropzone ${blinking ? "blink" : ""}`}
		>
			<div style={{ fontSize: 18, fontWeight: 600 }}>Arrastra aquí</div>
		</div>
	);
}

export default function PictogramActivity() {
	const [help, setHelp] = useState(false);
	const [escapingId, setEscapingId] = useState(null);

	const pictogramRefs = useRef({});
	const dropRef = useRef(null);
	const handRef = useRef(null);
	const targetRef = useRef("es");
	const attemptsRef = useRef(0);

	const audiosRef = useRef({});
	const correctAudioRef = useRef(null);
	const errorAudioRef = useRef(null);
	const repeatTimerRef = useRef(null);

	useEffect(() => {
		pictograms.forEach((p) => {
			audiosRef.current[p.id] = new Audio(p.audio);
		});
		correctAudioRef.current = new Audio("/sounds/correct.mp3");
		errorAudioRef.current = new Audio("/sounds/error.mp3");

		return () => {
			if (repeatTimerRef.current) clearInterval(repeatTimerRef.current);
		};
	}, []);

	// Repetir audio objetivo cada 2s (o guide si help)
	useEffect(() => {
		function playTargetAudio() {
			audiosRef.current[targetRef.current]?.play().catch(() => {});
		}
		// play immediately
		if (!help) {
			playTargetAudio();
		}

		if (repeatTimerRef.current) clearInterval(repeatTimerRef.current);
		repeatTimerRef.current = setInterval(() => {
			if (!help) playTargetAudio();
		}, 2000);

		return () => {
			if (repeatTimerRef.current) clearInterval(repeatTimerRef.current);
		};
	}, [targetRef, help]);

	function playPictogramAudio(id) {
		audiosRef.current[id]?.play().catch(() => {});
	}

	function handleDrop(draggedId) {
		if (draggedId === targetRef.current) {
			correctAudioRef.current?.play().catch(() => {});
			attemptsRef.current = 0;
			setHelp(false);
			setEscapingId(null);
			const nextIds = pictograms.map((p) => p.id).filter((id) => id !== targetRef.current);
			targetRef.current = nextIds[Math.floor(Math.random() * nextIds.length)];
		} else {
			errorAudioRef.current?.play().catch(() => {});
			setEscapingId(draggedId);
			setTimeout(() => setEscapingId(null), 700);
			attemptsRef.current = attemptsRef.current + 1;
			if (attemptsRef.current >= 5) {
				setHelp(true);
				setTimeout(() => animateHandGuide(), 50);
			}
		}
	}

	// anima la mano desde pictograma objetivo al drop 3 veces (vuelta instantánea/no animada)
	function animateHandGuide() {
		const handEl = handRef.current;
		const pictEl = pictogramRefs.current[targetRef.current];
		const dropEl = dropRef.current;
		if (!handEl || !pictEl || !dropEl) return;

		const pictRect = pictEl.getBoundingClientRect();
		const dropRect = dropEl.getBoundingClientRect();
		const containerRect = handEl.parentElement.getBoundingClientRect();

		const startX = pictRect.left - containerRect.left + pictRect.width / 2;
		const startY = pictRect.top - containerRect.top + pictRect.height / 2;
		const endX = dropRect.left - containerRect.left + dropRect.width / 2;
		const endY = dropRect.top - containerRect.top + dropRect.height / 2;

		const dx = endX - startX;
		const dy = endY - startY;

		// colocar mano sobre el centro del pictograma (usamos translate(-50%,-50%) para centrar)
		handEl.style.left = `${startX}px`;
		handEl.style.top = `${startY}px`;
		handEl.style.opacity = "1";
		handEl.style.transition = "none";
		handEl.style.transform = "translate(-50%, -50%)";

		let count = 0;
		const doMove = () => {
			// animar hacia el drop (manteniendo el offset -50%,-50%)
			handEl.style.transition = "transform 1.5s ease-in-out";
			handEl.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
			count++;
			if (count < 3) {
				// volver instantáneamente a start (sin animación)
				setTimeout(() => {
					handEl.style.transition = "none";
					handEl.style.transform = "translate(-50%, -50%)";
					// pequeño delay para que el jump se aplique
					setTimeout(doMove, 300);
				}, 1500);
			} else {
				// tras tercera vez, hacemos desaparecer la mano suavemente y ocultamos help
				setTimeout(() => {
					handEl.style.transition = "opacity 1500ms";
					handEl.style.opacity = "0";
					setTimeout(() => setHelp(false), 300);
				}, 1500);
			}
		};
		// arrancar
		setTimeout(doMove, 90);
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<div style={{ padding: 20, position: "relative" }}>
				<Title level={3} style={{ textAlign: "center" }}>Actividad: Reconocimiento de Pictogramas</Title>

				<Row justify="center" gutter={[16,16]} style={{ marginBottom: 24 }}>
					{pictograms.map((p) => (
						<Col key={p.id}>
							<DraggablePictogram
								pictogram={p}
								isBlinking={p.id === targetRef.current}
								isEscaping={escapingId === p.id}
								forwardRef={(el) => {pictogramRefs.current[p.id] = el; }}
								onPlay={(id) => playPictogramAudio(id)}
							/>
						</Col>
					))}
				</Row>

				<Row justify="center">
					<Col>
						<DropZone blinking={true} forwardRef={dropRef} onDrop={handleDrop} />
					</Col>
				</Row>

				{help && <span ref={handRef} className="hand-guide">🖐️</span>}
			</div>
		</DndProvider>
	);
}