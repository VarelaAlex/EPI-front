import React, { useState, useEffect, useRef } from 'react';
import {Card, Spin, Alert, Row, Col, Typography, Image, Divider, Flex} from 'antd';
import { CheckCircleOutlined, LockOutlined } from '@ant-design/icons';
import {useSession} from "../SessionComponent";
import {useNavigate} from "react-router-dom";
import {REPRESENTATION} from "../../Globals";
import {useTranslation} from "react-i18next";

const ClosedExercisesSelector = () => {
    let { setExercise, setFeedback, lang } = useSession();

    const [exercises, setExercises] = useState([]);
    const [enabledExerciseNumber, setEnabledExerciseNumber] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const lastEnabledRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const [lastTime, setLastTime] = useState(0);
    const velocity = useRef(0);

    let navigate = useNavigate();
    let {t} = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch de ejercicios habilitados
                const enabledResponse = await fetch(
                    `${process.env.REACT_APP_USERS_SERVICE_URL}/students/enabledExercises`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    }
                );

                if (!enabledResponse.ok) {
                    throw new Error('Error al obtener ejercicios habilitados');
                }

                const enabledData = await enabledResponse.json();
                setEnabledExerciseNumber(enabledData.enabledExercises);

                // Fetch de lista de ejercicios
                const exercisesResponse = await fetch(
                    `${process.env.REACT_APP_EXERCISES_SERVICE_URL}/exercises/list/${lang.split('-')[0]}?closedOrder=true`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    }
                );

                if (!exercisesResponse.ok) {
                    throw new Error('Error al obtener lista de ejercicios');
                }

                const exercisesData = await exercisesResponse.json();
                setExercises(exercisesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [lang]);

    useEffect(() => {
        // Scroll automático al último ejercicio habilitado
        if (lastEnabledRef.current && scrollContainerRef.current && !loading && exercises.length > 0) {
            setTimeout(() => {
                const element = lastEnabledRef.current;

                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    });
                }
            }, 300);
        }
    }, [exercises, enabledExerciseNumber, loading]);

    const getCardStyle = (exerciseNumber) => {
        if (exerciseNumber < enabledExerciseNumber) {
            // Ejercicio resuelto
            return { backgroundColor: '#eefff3', borderColor: '#c3e6cb' };
        } else if (exerciseNumber === enabledExerciseNumber) {
            // Último ejercicio habilitado
            return { backgroundColor: '#fffbee', borderColor: '#ffc107' };
        }
        return {};
    };

    const isEnabled = (exerciseNumber) => exerciseNumber <= enabledExerciseNumber;
    const isCompleted = (exerciseNumber) => exerciseNumber < enabledExerciseNumber;

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                style={{ margin: '20px' }}
            />
        );
    }

    const handleMouseDown = (e) => {
        if (scrollContainerRef.current) {
            setIsDragging(true);
            setStartY(e.pageY - scrollContainerRef.current.offsetTop);
            setScrollTop(scrollContainerRef.current.scrollTop);
            setLastTime(Date.now());
            // Previene la selección de texto
            e.preventDefault();
        }
    };

    const handleMouseLeaveOrUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const y = e.pageY - scrollContainerRef.current.offsetTop;
        const walkY = y - startY; // Distancia de arrastre
        scrollContainerRef.current.scrollTop = scrollTop - walkY;

        const now = Date.now();
        const elapsed = now - lastTime.current;
        velocity.current =
            startY / (
                elapsed + 1
            ) * 2;
    };

    // Estilo condicional para el cursor al arrastrar
    const conditionalCursorStyle = isDragging ? 'grabbing' : 'grab';
    const combinedScrollStyles = {
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: '10px',
        cursor: conditionalCursorStyle
    }

    const {Text, Title} = Typography;
    let { Meta } = Card;

    let networkTypeColors = {
        "I-I": "#ffc464", "I-II": "#16e8df", "I-III": "#cf8ffc"
    };

    let representationColors = {
        ICONIC:   "#FFADAD",
        MIXED:    "#7DE28F",
        GLOBAL:   "#FFD7A8",
        SYMBOLIC: "#8FD1FF"
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '40vmax',
            margin: '0 auto',
            padding: '2vmax'
        }}>
            <div
                ref={scrollContainerRef}
                style={combinedScrollStyles}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
            >
                <Row gutter={[16, 16]}>
                    {exercises.map((exercise) => {
                        const enabled = isEnabled(exercise.closedOrder);
                        const completed = isCompleted(exercise.closedOrder);
                        const isLastEnabled = exercise.closedOrder === enabledExerciseNumber;

                        return (
                            <Col span={24} key={exercise.id || exercise.closedOrder}>
                                {["ICONIC", "MIXED"].includes(exercise.representation) ? <Card
                                    key={exercise.id}
                                    ref={isLastEnabled ? lastEnabledRef : null}
                                    hoverable={enabled}
                                    style={{
                                        ...getCardStyle(exercise.closedOrder),
                                        textAlign: "center",
                                        alignItems: "center",
                                        minWidth: "20vmax",
                                        opacity: enabled ? 1 : 0.6,
                                        cursor: enabled ? 'pointer' : 'not-allowed'
                                    }}
                                    onClick={ () => {
                                        if ( velocity.current === 0 && (enabled || completed) ) {
                                            setExercise(exercise);
                                            setFeedback({});
                                            navigate(`/exerciseDnD/phase1/ruled`);
                                        }
                                    } }
                                    extra={completed ? (
                                        <div style={{ color: '#28a745', fontWeight: 'bold' }}>
                                            <CheckCircleOutlined style={{color: '#28a745'}}/> Completado
                                        </div>
                                    ) : !enabled && (
                                        <div style={{ color: '#6c757d', fontWeight: 'bold' }}>
                                            <LockOutlined style={{color: '#6c757d'}}/> Bloqueado
                                        </div>
                                    )}
                                >
                                        <Title level={ 4 } style={ { fontSize: "1.3vmax", textAlign: "center" } }>{ exercise.title }</Title>
                                        <Image alt={ exercise.title } draggable={ false } preview={ false } width="15vmax"
                                               src={ `${ process.env.REACT_APP_ARASAAC_URL }/pictograms/${ exercise.mainImage }` }/>
                                        <Divider style={ { marginTop: "1vmax", marginBottom: "1vmax" } }/>
                                        <Flex style={{width:'100%'}} justify='center' align='center' gap='small'>
                                            <Meta style={ { backgroundColor: representationColors[ exercise.representation ], borderRadius: "12px", width:'100%' } }
                                                  title={ <Text style={ { fontSize: "1.5vmax", textAlign: "center", color: "black" } }>{ t(`exercise.${exercise.representation}`) }</Text> }/>
                                            <Meta style={ { backgroundColor: networkTypeColors[ exercise.networkType ], borderRadius: "12px", width:'100%' } }
                                                  title={ <Text style={ { fontSize: "1.5vmax", textAlign: "center", color: "black" } }>{ exercise.networkType }</Text> }/>
                                        </Flex>
                                </Card> :
                                    <Card
                                        key={exercise.id}
                                        ref={isLastEnabled ? lastEnabledRef : null}
                                        hoverable={enabled}
                                        style={{
                                            ...getCardStyle(exercise.closedOrder),
                                            textAlign: "center",
                                            alignItems: "center",
                                            minWidth: "20vmax",
                                            opacity: enabled ? 1 : 0.6,
                                            cursor: enabled ? 'pointer' : 'not-allowed'
                                        }}
                                        onClick={ () => {
                                            if ( velocity.current === 0 && (enabled || completed) ) {
                                                setExercise(exercise);
                                                setFeedback({});
                                                if(exercise.representation === REPRESENTATION.SYMBOLIC) {
                                                    navigate(`/exerciseType/phase1/ruled`);
                                                }
                                                if(exercise.representation === REPRESENTATION.GLOBAL) {
                                                    navigate(`/exerciseDnD/phase1/ruled`);
                                                }
                                            }
                                        } }
                                        extra={completed ? (
                                            <div style={{ color: '#28a745', fontWeight: 'bold' }}>
                                                <CheckCircleOutlined style={{color: '#28a745'}}/> Completado
                                            </div>
                                        ) : !enabled && (
                                            <div style={{ color: '#6c757d', fontWeight: 'bold' }}>
                                                <LockOutlined style={{color: '#6c757d'}}/> Bloqueado
                                            </div>
                                        )}
                                    >
                                        <Title style={ { fontSize: "2.3vmax", textAlign: "center", paddingBottom: "2vmax" } }>{ exercise.title }</Title>
                                        <Divider style={ { marginTop: "1vmax", marginBottom: "1vmax" } }/>
                                        <Flex style={{width:'100%'}} justify='center' align='center' gap='small'>
                                            <Meta style={ { backgroundColor: representationColors[ exercise.representation ], borderRadius: "12px", width:'100%' } }
                                                  title={ <Text style={ { fontSize: "1.5vmax", textAlign: "center", color: "black" } }>{ t(`exercise.${exercise.representation}`) }</Text> }/>
                                            <Meta style={ { backgroundColor: networkTypeColors[ exercise.networkType ], borderRadius: "12px", width:'100%' } }
                                                  title={ <Text style={ { fontSize: "1.5vmax", textAlign: "center", color: "black" } }>{ exercise.networkType }</Text> }/>
                                        </Flex>
                                    </Card>
                                }
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </div>
    );
};

export default ClosedExercisesSelector;