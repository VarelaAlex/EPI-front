import { Card, Col, Divider, Image, Row, Typography } from "antd";
import React, { useState }                            from "react";

const { Title } = Typography;
const { Meta } = Card;

const HowToDoExercises = () => {
	const [selectedVideo, setSelectedVideo] = useState(null);

	const videos = [
		{
			id:          1,
			title:       "Icónica",
			thumbnail:   "/representations/iconicColor.png",
			videoSrc:    "/exerciseExamples/ExampleIconic.mp4",
			description: "Cómo hacer un ejercicio de representación icónica"
		}, {
			id:          2,
			title:       "Combinada",
			thumbnail:   "/representations/mixedColor.png",
			videoSrc:    "/exerciseExamples/ExampleMixed.mp4",
			description: "Cómo hacer un ejercicio de representación combinada"
		}, {
			id:          3,
			title:       "Simbólica",
			thumbnail:   "/representations/symbolicColor.png",
			videoSrc:    "/exerciseExamples/ExampleSymbolic.mp4",
			description: "Cómo hacer un ejercicio de representación simbólica"
		}
	];

	const handleVideoClick = (videoId) => {
		setSelectedVideo(videoId);
	};

	return (
		<div style={ { width: "100vw", padding: "1vw", overflow: "hidden" } }>
			<Title level={ 2 } style={ { textAlign: "center", marginBottom: "2rem" } }>
				¿Qué ejercicio quieres aprender a hacer?
			</Title>
			<Row gutter={[16, 16]} justify="center">
				{ videos.map(video => (
					<Col key={ video.id } xs={ 24 } sm={ 12 } md={ 8 }>
						<Card onClick={() => handleVideoClick(video.id)}>
							<Title level={3} style={{ textAlign: "center", marginBottom: "2rem" }}>
								{video.title}
							</Title>
							<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
								<Image
									width="30%"
									preview={false}
									alt={video.title}
									src={video.thumbnail}
									style={{ borderRadius: "8px" }}
								/>
							</div>
							<Divider />
							<Meta description={video.description} />
						</Card>

					</Col>
				)) }
			</Row>
			{ selectedVideo && (
				<div style={ { marginTop: "2rem", textAlign: "center" } }>
					<video
						src={ videos.find((video) => video.id === selectedVideo).videoSrc }
						controls
						muted
						style={ {
							width: "80%", borderRadius: "8px", border: "1px solid #f0f0f0"
						} }
					/>
				</div>
			) }
		</div>
	);
};

export default HowToDoExercises;
