import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Layout, notification, Flex } from "antd";
import SelectRole from './components/SelectRoleComponent';
import HeaderComponent from './components/layout/HeaderComponent';
import Sider from "./components/layout/SiderComponent";
import { usersServiceURL } from './Globals';
import { UserOutlined, InfoCircleOutlined, LogoutOutlined, FormOutlined } from "@ant-design/icons";
import ClassroomOutlined from './components/icons/ClassroomOutlined';
import StudentRoutes from './components/routes/StudentRoutesComponent';
import TeacherRoutes from './components/routes/TeacherRoutesComponent';

let App = () => {

  const MOBILE_BREAKPOINT = 430;

  let [open, setOpen] = useState(false);
  let [login, setLogin] = useState(false);
  let [api, contextHolder] = notification.useNotification();
  let [isMobile, setIsMobile] = useState(false);
  let [exercise, setExercise] = useState({});
  let [feedback, setFeedback] = useState({});

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
    let response = await fetch(usersServiceURL + "/teachers/disconnect?apiKey=" + localStorage.getItem("apiKey"));
    if (response.ok) {
      localStorage.removeItem("apiKey");
      localStorage.removeItem("idUser");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      setLogin(false);
      navigate("/selectRole");
      setFeedback({})
      setExercise({})
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
          response = await fetch(usersServiceURL + "/teachers/checkLogin?apiKey=" + localStorage.getItem("apiKey"));
        }
        if (role === "S") {
          response = await fetch(usersServiceURL + "/students/checkLogin?apiKey=" + localStorage.getItem("apiKey"));
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
                <Route path="/selectRole" element={
                  <SelectRole />
                } />
              </Routes>
              <TeacherRoutes setLogin={setLogin} isMobile={isMobile} />
              <StudentRoutes setLogin={setLogin} exercise={exercise} setExercise={setExercise} feedback={feedback} setFeedback={setFeedback} />
            </Flex>
          </Content>
        </Layout>
        <Footer style={{ textAlign: "center", backgroundColor: "#001628", color: "white" }}>HYTEX @ 2024<br />Made with ❤️ by Álex & UniOvi</Footer>
      </Layout >
    </>
  );
};

export default App;