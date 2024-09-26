import LoginStudent from '../student/LoginStudentComponent';
import DnDPhase1 from '../student/DnDPhase1Component';
import DnDPhase2 from '../student/DnDPhase2Component';
import TypePhase1 from '../student/TypePhase1Component';
import TypePhase2 from '../student/TypePhase2Component';
import ExercisesCarousel from '../student/ExercisesCarouselComponent';
import { Route, Routes } from 'react-router-dom';

let StudentRoutes = ({ setLogin, exercise, setExercise, feedback, setFeedback }) => {

    return (
        <Routes>
            <Route path="/loginStudent" element={
                <LoginStudent setLogin={setLogin} />
            } />
            <Route path="/exerciseDnD/phase1" element={
                <DnDPhase1 exercise={exercise} feedback={feedback} setFeedback={setFeedback} />
            } />
            <Route path="/exerciseDnD/phase2" element={
                <DnDPhase2 exercise={exercise} feedback={feedback} setFeedback={setFeedback} />
            } />
            <Route path="/exerciseType/phase1" element={
                <TypePhase1 exercise={exercise} feedback={feedback} setFeedback={setFeedback} />
            } />
            <Route path="/exerciseType/phase2" element={
                <TypePhase2 exercise={exercise} feedback={feedback} setFeedback={setFeedback} />
            } />
            <Route path="/students/exercises" element={
                <ExercisesCarousel setExercise={setExercise} setFeedback={setFeedback} />
            } />
        </Routes>
    );
};

export default StudentRoutes;