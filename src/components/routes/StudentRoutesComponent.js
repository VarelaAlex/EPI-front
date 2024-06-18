import LoginStudent from '../student/LoginStudentComponent';
import DnDPhase1 from '../student/DnDPhase1Component';
import DnDPhase2 from '../student/DnDPhase2Component';
import TypePhase1 from '../student/TypePhase1Component';
import TypePhase2 from '../student/TypePhase2Component';
import ExercisesCarousel from '../student/ExercisesCarouselComponent';
import { Route, Routes } from 'react-router-dom';

let StudentRoutes = ({ setLogin, exercise, setExercise }) => {

    return (
        <Routes>
            <Route path="/loginStudent" element={
                <LoginStudent setLogin={setLogin} />
            } />
            <Route path="/exerciseDnD/phase1" element={
                <DnDPhase1 exercise={exercise} />
            } />
            <Route path="/exerciseDnD/phase2" element={
                <DnDPhase2 exercise={exercise} />
            } />
            <Route path="/exerciseType/phase1" element={
                <TypePhase1 exercise={exercise} />
            } />
            <Route path="/exerciseType/phase2" element={
                <TypePhase2 exercise={exercise} />
            } />
            <Route path="/students/exercises" element={
                <ExercisesCarousel setExercise={setExercise} />
            } />
        </Routes>
    );
};

export default StudentRoutes;