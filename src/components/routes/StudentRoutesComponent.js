import LoginStudent from '../student/LoginStudentComponent';
import DnDPhase1 from '../student/DnDPhase1Component';
import DnDPhase2 from '../student/DnDPhase2Component';
import TypePhase1 from '../student/TypePhase1Component';
import TypePhase2 from '../student/TypePhase2Component';
import ExercisesCarousel from '../student/ExercisesCarouselComponent';
import { Route, Routes } from 'react-router-dom';

let StudentRoutes = () => {

    return (
        <Routes>
            <Route path="/loginStudent" element={<LoginStudent />} />
            <Route path="/exerciseDnD/phase1" element={<DnDPhase1 />} />
            <Route path="/exerciseDnD/phase2" element={<DnDPhase2 />} />
            <Route path="/exerciseType/phase1" element={<TypePhase1 />} />
            <Route path="/exerciseType/phase2" element={<TypePhase2 />} />
            <Route path="/students/exercises" element={<ExercisesCarousel />} />
        </Routes>
    );
};

export default StudentRoutes;