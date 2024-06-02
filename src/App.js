import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Layout, notification, Flex } from "antd";
import LoginTeacherComponent from './components/LoginTeacherComponent';
import LoginStudentComponent from './components/LoginStudentComponent';
import SelectRoleComponent from './components/SelectRoleComponent';
import HeaderComponent from './components/layout/HeaderComponent';
import SiderComponent from "./components/layout/SiderComponent";
import SignupTeacherComponent from './components/SignupTeacherComponent';
import ClassroomsListComponent from './components/ClassroomsListComponent';
import { backendURL } from './Globals';
import { UserOutlined, InfoCircleOutlined, LogoutOutlined, FormOutlined } from "@ant-design/icons";
import ClassroomOutlined from './components/icons/ClassroomOutlined';
import DnDPhase1 from './components/DnDPhase1';
import DnDPhase2 from './components/DnDPhase2';
import TypePhase1 from './components/TypePhase1';
import TypePhase2 from './components/TypePhase2';
import ExercisesCarousel from './components/ExercisesCarousel';
import { nexusX } from './components/NetworkProps';

let App = () => {

  const MOBILE_BREAKPOINT = 500;

  let [open, setOpen] = useState(false);
  let [login, setLogin] = useState(false);
  let [api, contextHolder] = notification.useNotification();
  let [isMobile, setIsMobile] = useState(false);

  let { t } = useTranslation();
  let { Content, Footer } = Layout;

  let navigate = useNavigate();
  let location = useLocation();
  /*
    let createNotification =
      ({ message,
        description = message,
        type = "info",
        placement = "top",
        duration = "3"
      }) => {
        api[type]({
          message,
          description,
          placement,
          duration
        });
      };
  */

  let disconnect = async () => {
    let response = await fetch(backendURL + "/teachers/disconnect?apiKey=" + localStorage.getItem("apiKey"));
    if (response.ok) {
      localStorage.removeItem("apiKey");
      localStorage.removeItem("idUser");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      setLogin(false);
      navigate("/selectRole");
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
      label: <Link to="/teachers/aboutHYTEX" onClick={() => setOpen(false)}>{t("sider.teacher.about")}</Link>,
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
      label: <Link onClick={disconnect}>{t("sider.disconnect")}</Link>,
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
      label: <Link onClick={disconnect}>{t("sider.disconnect")}</Link>,
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

    let checkLogin = async () => {
      if (localStorage.getItem("apiKey")) {
        let response = null;
        let role = localStorage.getItem("role");
        if (role === "T") {
          response = await fetch(backendURL + "/teachers/checkLogin?apiKey=" + localStorage.getItem("apiKey"));
        }
        if (role === "S") {
          response = await fetch(backendURL + "/students/checkLogin?apiKey=" + localStorage.getItem("apiKey"));
        }
        if (response?.status === 200) {
          setLogin(true);
          if (role === "T" && (["/loginTeacher", "/loginStudent", "/registerTeacher", "/selectRole"].includes(location.pathname) || location.pathname.startsWith("/students/"))) {
            navigate("/teachers/menuTeacher");
          }
          if (role === "S" && (["/loginTeacher", "/loginStudent", "/registerTeacher", "/selectRole"].includes(location.pathname) || location.pathname.startsWith("/teachers/"))) {
            navigate("/students/exercises");
          }
        } else {
          setLogin(false);
          navigate("/selectRole");
        }
      } else {
        if (!["/loginTeacher", "/loginStudent", "/registerTeacher", "/selectRole"].includes(location.pathname)) {
          setLogin(false);
          navigate("/selectRole");
        }
      }
    };

    checkLogin();
  }, [location.pathname, navigate]);

  useEffect(() => {
    // TODO: Create notification when first session created
    if (!localStorage.getItem("pwaNotificationShown")) {
      api.info({
        message: t("pwa.notificationMessage"),
        description: t("pwa.notificationDescription"),
        duration: "4"
      });
      localStorage.setItem("pwaNotificationShown", true);
    }
  }, [api, t]);

  let networkType = 0;

  let nodes = [
    { id: "1", type: "type1", posX: 0, posY: 0, src: "/boca.png", text: "LA BOCA", shape: "rect" },
    { order: 2, id: "2", type: "type2", posX: -160, posY: 90, src: "/es_parte_de.png", nexus: true, text: "es parte de" },
    { order: 3, id: "3", type: "type3", posX: -160, posY: 170, shape: "ellipse", src: "/cara.png", text: "LA CARA" },
    { order: 6, id: "4", type: "type4", posX: nexusX[networkType], posY: 90, src: "/tiene.png", nexus: true, text: "tiene" },
    { order: 7, id: "5", type: "type5", posX: 130, posY: 170, shape: "ellipse", src: "/labios.png", text: "LABIOS" },
    { id: "6", type: "type6", posX: -70, posY: 190, text: "." },

    /*
    { order: 8, id: "7", type: "type7", posX: 260, posY: 190, text: "y", src: "/stop.png", stop: true },
    { order: 9, id: "8", type: "type8", posX: 390, posY: 170, shape: "ellipse", src: "/dientes.png", text: "DIENTES" },
    */

    /*
    { order: 8, id: "7", type: "type7", posX: 260, posY: 190, text: ",", src: "/stop.png", stop: true },
    { order: 9, id: "8", type: "type8", posX: 350, posY: 170, shape: "ellipse", src: "/dientes.png", text: "DIENTES" },
    { order: 10, id: "9", type: "type9", posX: 460, posY: 190, text: "y", src: "/stop.png", stop: true },
    { order: 11, id: "10", type: "type10", posX: 570, posY: 170, shape: "ellipse", src: "/lengua.png", text: "LENGUA" },
    */
  ];

  return (
    <>
      {contextHolder}
      <Layout>
        <HeaderComponent
          login={login}
          open={open}
          setOpen={setOpen}
          isMobile={isMobile}
        />
        <Layout hasSider>
          {login &&
            <SiderComponent
              login={login}
              setLogin={setLogin}
              open={open}
              setOpen={setOpen}
              menuItems={localStorage.getItem("role") === "T" ? teacherMenuItems : studentMenuItems}
            />
          }
          <Content style={{ minHeight: "78vh", marginTop: "2vh" }} >
            <Flex align="center" justify="center" style={{ height: "100%" }}>
              <Routes>
                <Route path="/loginTeacher" element={
                  <LoginTeacherComponent setLogin={setLogin} />
                } />
                <Route path="/loginStudent" element={
                  <LoginStudentComponent setLogin={setLogin} />
                } />
                <Route path="/selectRole" element={
                  <SelectRoleComponent />
                } />
                <Route path="/registerTeacher" element={
                  <SignupTeacherComponent />
                } />
                <Route path="/teachers/menuTeacher" element={
                  <ClassroomsListComponent isMobile={isMobile} />
                } />
                <Route path="/example" element={
                  <DnDPhase1 networkType={networkType} nodes={nodes} nexusX={nexusX} />
                } />
                <Route path="/example2" element={
                  <DnDPhase2 networkType={networkType} nodes={nodes} nexusX={nexusX} />
                } />
                <Route path="/example3" element={
                  <TypePhase1 networkType={networkType} nodes={nodes} nexusX={nexusX} />
                } />
                <Route path="/example4" element={
                  <TypePhase2 networkType={networkType} nodes={nodes} nexusX={nexusX} />
                } />
                <Route path="/students/exercises" element={
                  <ExercisesCarousel cardsPerRow={isMobile ? 3 : 4} />
                } />
                <Route path="/teachers/manageExercises" element={
                  <>a</>
                } />
              </Routes>
            </Flex>
          </Content>
        </Layout>
        <Footer style={{ textAlign: "center" }}>HYTEX @ 2024<br />Made with ❤️ by Álex Álvarez Varela</Footer>
      </Layout >
    </>
  );
};

export default App;