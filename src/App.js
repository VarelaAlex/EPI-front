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
import { UserOutlined, InfoCircleOutlined, LogoutOutlined, FormOutlined } from "@ant-design/icons";
import ClassroomOutlined from './components/icons/ClassroomOutlined';
import { backendURL } from './Globals';

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
      setLogin(false);
      navigate("/selectRole");
    }
  };

  let menuItems = [
    {
      key: "classrooms",
      label: <Link to="/menuTeacher" onClick={() => setOpen(false)}>{t("sider.teacher.classrooms")}</Link>,
      danger: false,
      icon: <ClassroomOutlined />
    },
    {
      key: "exercises",
      label: <Link to="/manageExercises" onClick={() => setOpen(false)}>{t("sider.teacher.exercises")}</Link>,
      danger: false,
      icon: <FormOutlined />
    },
    {
      key: "about",
      label: <Link to="/aboutHYTEX" onClick={() => setOpen(false)}>{t("sider.teacher.about")}</Link>,
      danger: false,
      icon: <InfoCircleOutlined />
    },
    {
      key: "profile",
      label: <Link to="/profile" onClick={() => setOpen(false)}>{t("sider.teacher.profile")}</Link>,
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
        let response = await fetch(backendURL + "/teachers/checkLogin?apiKey=" + localStorage.getItem("apiKey"));
        if (response.status === 200) {
          setLogin(true);
        } else {
          setLogin(false);
          navigate("/selectRole");
        }
      } else {
        if (!["/loginTeacher", "/loginStudent", "/registerTeacher", "/selectRole"].includes(location.pathname)) {
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
            <SiderComponent
              login={login}
              setLogin={setLogin}
              open={open}
              setOpen={setOpen}
              menuItems={menuItems}
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
                <Route path="/menuTeacher" element={
                  <ClassroomsListComponent isMobile={isMobile} />
                } />
                <Route path="/example" element={
                  <>a</>
                } />
                <Route path="/manageExercises" element={
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