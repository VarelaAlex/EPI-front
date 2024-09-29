import LoginTeacher from '../teacher/LoginTeacherComponent';
import SignupTeacher from '../teacher/SignupTeacherComponent';
import ClassroomsList from '../teacher/ClassroomsListComponent';
import ExercisesList from '../teacher/ExercisesListComponent';
import CreateExercise from '../teacher/CreateExerciseComponent';
import { Route, Routes } from 'react-router-dom';

let TeacherRoutes = ({ isMobile }) => {
    return (
        <Routes>
            <Route path="/loginTeacher" element={<LoginTeacher />} />
            <Route path="/registerTeacher" element={<SignupTeacher />} />
            <Route path="/teachers/menuTeacher" element={<ClassroomsList isMobile={isMobile} />} />
            <Route path="/teachers/manageExercises" element={<ExercisesList isMobile={isMobile} />} />
            <Route path="/teachers/create" element={<CreateExercise isMobile={isMobile} />} />
        </Routes>
    );
};

export default TeacherRoutes;