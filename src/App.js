import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, matchPath, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Layout, notification, Flex } from "antd";
import SelectRole from './components/SelectRoleComponent';
import Header from './components/layout/HeaderComponent';
import Sider from "./components/layout/SiderComponent";
import { UserOutlined, InfoCircleOutlined, LogoutOutlined, FormOutlined } from "@ant-design/icons";
import ClassroomOutlined from './components/icons/ClassroomOutlined';
import HowToDoExercises from "./components/student/HowToDoExercisesComponent";
import CreateStudent from "./components/teacher/CreateStudentComponent";
import LoginTeacher from './components/teacher/LoginTeacherComponent';
import SignupTeacher from './components/teacher/SignupTeacherComponent';
import ClassroomsList from './components/teacher/ClassroomsListComponent';
import ExercisesList from './components/teacher/ExercisesListComponent';
import CreateExercise from './components/teacher/CreateExerciseComponent';
import LoginStudent from './components/student/LoginStudentComponent';
import DnDPhase1 from './components/student/DnDPhase1Component';
import DnDPhase2 from './components/student/DnDPhase2Component';
import TypePhase1 from './components/student/TypePhase1Component';
import TypePhase2 from './components/student/TypePhase2Component';
import ExercisesCarousel from './components/student/ExercisesCarouselComponent';
import { useSession }    from './components/SessionComponent';
import { jwtDecode }     from 'jwt-decode';
import NotFound from './components/NotFoundComponent';
import ClassroomDetail from './components/teacher/ClassroomDetailComponent';
import StudentDetail from './components/teacher/StudentDetailComponent';
import BlankPage from './components/BlankPageComponent';
import Profile from './components/teacher/ProfileComponent';
import ClassroomStatistics from './components/teacher/ClassroomStatisticsComponent';
import StudentStatistics from './components/teacher/StudentStatisticsComponent';
import AboutEPI from './components/teacher/AboutEPIComponent';

let App = () => {

	let { login, setLogin, setFeedback, setExercise } = useSession();

	const MOBILE_BREAKPOINT = 430;

	let [open, setOpen] = useState(false);
	let [api, contextHolder] = notification.useNotification();
	let [isMobile, setIsMobile] = useState(false);
	let [classroomId, setClassroomId] = useState();
	let [classroomName, setClassroomName] = useState();
	let [studentName, setStudentName] = useState();

	let { t } = useTranslation();
	let navigate = useNavigate();
	let location = useLocation();
	let { Content, Footer } = Layout;

	let disconnect = useCallback(() => {
		logout();
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("name");
		localStorage.removeItem("role");
		setLogin(false);
		setFeedback({});
		setExercise({});
	}, [setExercise, setFeedback, setLogin]);

	let logout = async () => {
		let refreshToken = localStorage.getItem("refreshToken");

		try {
			await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/logout",
				{
					method: "POST",
					body: JSON.stringify({ token: refreshToken }),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`
					}
				}
			);
		} catch (e) {
		}
	};

	let isTokenExpired = (token) => {
		if (!token) return true;
		try {
			const decodedToken = jwtDecode(token);
			const currentTime = Date.now() / 1000;
			return decodedToken.exp < currentTime;
		} catch (error) {
			console.error('Error decoding token:', error);
			return true;
		}
	};

	let teacherMenuItems = [
		{
			key: "classrooms",
			label: <Link to="/teachers/menuTeacher" onClick={() => setOpen(false)}>{t("sider.teacher.classrooms")}</Link>,
			danger: false,
			icon: <ClassroomOutlined />
		},
		{
			key: "exercises",
			label: <Link to="/teachers/manageExercises" onClick={() => setOpen(false)}>{t("sider.teacher.exercises")}</Link>,
			danger: false,
			icon: <FormOutlined />
		},
		{
			key: "about",
			label: <Link to="/teachers/aboutEPI" onClick={() => setOpen(false)}>{t("sider.teacher.about")}</Link>,
			danger: false,
			icon: <InfoCircleOutlined />
		},
		{
			key: "profile",
			label: <Link to="/teachers/profile" onClick={() => setOpen(false)}>{t("sider.teacher.profile")}</Link>,
			danger: false,
			icon: <UserOutlined />
		},
		{
			key: "menuDisconnect",
			label: <Link to="/selectRole" onClick={disconnect}>{t("sider.disconnect")}</Link>,
			danger: true,
			icon: <LogoutOutlined />
		}
	];

	let studentMenuItems = [
		{
			key: "exercises",
			label: <Link to="/students/exercises" onClick={() => setOpen(false)}>{t("sider.student.exercises")}</Link>,
			danger: false,
			icon: <FormOutlined />
		},
		{
			key: "howto",
			label: <Link to="/students/howTo" onClick={() => setOpen(false)}>{t("sider.student.howto")}</Link>,
			danger: false,
			icon: <InfoCircleOutlined />
		},
		{
			key: "menuDisconnect",
			label: <Link to="/selectRole" onClick={disconnect}>{t("sider.disconnect")}</Link>,
			danger: true,
			icon: <LogoutOutlined />
		}
	];

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {

		let refresh = async () => {

			let refreshToken = localStorage.getItem("refreshToken");

			if (refreshToken) {
				if (isTokenExpired(refreshToken)) {
					disconnect();
					navigate('/selectRole');
				}

				let response;
				try {
					response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/token",
						{
							method: "POST",
							body: JSON.stringify({ refreshToken }),
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${localStorage.getItem("accessToken")}`
							}
						}
					);
					return await response.json();
				} catch (e) {
					disconnect();
					navigate("/selectRole");
				}
			}
		};

		const interval = setInterval(async () => {
			if (localStorage.getItem("refreshToken")) {
				localStorage.setItem("accessToken", await refresh());
			}
		}, 0.5 * 60 * 1000);

		return () => clearInterval(interval);
	}, [disconnect, navigate]);

	useEffect(() => {

		let checkLogin = async () => {

			let accessToken = localStorage.getItem("accessToken");

			if (accessToken) {
				if (isTokenExpired(accessToken)) {
					disconnect();
					navigate('/selectRole');
				}

				let response = null;
				let role = localStorage.getItem("role");
				if (role === "T") {
					response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/teachers/checkLogin",
						{
							method: "GET",
							headers: {
								Authorization: `Bearer ${accessToken}`
							}
						}
					);
				}

				if (role === "S") {
					response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/students/checkLogin", {
						method: "GET",
						headers: {
							Authorization: `Bearer ${accessToken}`
						}
					});
				}

				if (response?.status === 200) {
					setLogin(true);

					if (role === "T") {

						const isAllowedPath = matchPath("/teachers/:path/*", location.pathname);

						if (!isAllowedPath) {
							navigate("/teachers/menuTeacher");
						}
					}

					if (role === "S") {

						const isAllowedPath = matchPath("/students/:path/*", location.pathname) || location.pathname.startsWith("/exercise");

						if (!isAllowedPath) {
							navigate("/students/exercises");
						}
					}
				} else {
					disconnect();
					navigate("/selectRole");
				}
			} else {
				if (!["/loginTeacher", "/loginStudent", "/registerTeacher", "/selectRole"].includes(location.pathname)) {
					disconnect();
					navigate("/selectRole");
				}
			}
		};

		checkLogin();
	}, [location.pathname, navigate, setLogin, disconnect]);

	useEffect(() => {
		if (!localStorage.getItem("pwaNotificationShown")) {
			api.info({
				message: t("pwa.notificationMessage"),
				description: t("pwa.notificationDescription"),
				duration: "4"
			});
			localStorage.setItem("pwaNotificationShown", true);
		}
	}, [api, t]);

	return (
		<>
			{contextHolder}
			<Layout>
				<Header
					login={login}
					open={open}
					setOpen={setOpen}
					isMobile={isMobile}
				/>
				<Layout hasSider>
					{login &&
						<Sider
							login={login}
							setLogin={setLogin}
							open={open}
							setOpen={setOpen}
							menuItems={localStorage.getItem("role") === "T" ? teacherMenuItems : studentMenuItems}
						/>
					}
					<Content style={{ minHeight: "100vh", background: "url(/bg.svg) no-repeat", backgroundSize: "cover" }} >
						<Flex align="center" justify="center" style={{ minHeight: "100%" }}>
							<Routes>
								<Route path="/selectRole" element={<SelectRole />} />
								<Route path="/loginStudent" element={<LoginStudent />} />
								<Route path="/exerciseDnD/phase1" element={<DnDPhase1 />} />
								<Route path="/exerciseDnD/phase2" element={<DnDPhase2 />} />
								<Route path="/exerciseType/phase1" element={<TypePhase1 />} />
								<Route path="/exerciseType/phase2" element={<TypePhase2 />} />
								<Route path="/students/exercises" element={<ExercisesCarousel />} />
								<Route path="/students/howTo" element={<HowToDoExercises />} />
								<Route path="/loginTeacher" element={<LoginTeacher />} />
								<Route path="/registerTeacher" element={<SignupTeacher />} />
								<Route path="/teachers/menuTeacher" element={<ClassroomsList isMobile={isMobile} setClassroomId={setClassroomId} />} />
								<Route path="/teachers/classroomDetail/:classroomName" element={<ClassroomDetail isMobile={isMobile} setStudentName={setStudentName} setClassroomName={setClassroomName} />} />
								<Route path="/teachers/studentDetail/:studentId" element={<StudentDetail isMobile={isMobile} />} />
								<Route path="/teachers/addStudent" element={<CreateStudent classroomName={classroomName}/>} />
								<Route path="/teachers/manageExercises" element={<ExercisesList isMobile={isMobile} />} />
								<Route path="/teachers/create" element={<CreateExercise isMobile={isMobile} />} />
								<Route path='/teachers/profile' element={<Profile />} />
								<Route path='/teachers/classroomStats/:classroomName' element={<ClassroomStatistics classroomId={classroomId} />} />
								<Route path='/teachers/studentStats/:studentId' element={<StudentStatistics studentName={studentName} />} />
								<Route path='/teachers/aboutEPI' element={<AboutEPI />} />
								<Route path='/' element={<BlankPage />} />
								<Route path="*" element={<NotFound />} />
							</Routes>
						</Flex>
					</Content>
				</Layout>
				<Footer style={{backgroundColor: "#001628", color: "white"}}>
					<Flex align="center" justify="center" style={{ minHeight: "100%" }}>
						EPI @ 2024 Made with ❤️ by Álex & UniOvi
						<img
							src="https://static.arasaac.org/images/by-nc-sa.svg"
							alt="Creative Commons license CC BY-NC-SA"
							title="ARASAAC creative commons license CC BY-NC-SA"
							style={{marginLeft: "10px", height: "50px"}}
						/>
					</Flex>
				</Footer>

			</Layout>
		</>
	);
};

export default App;