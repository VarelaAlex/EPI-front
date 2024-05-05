import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Layout, notification, Flex } from "antd";
import LoginTeacherComponent from './components/LoginTeacherComponent';
import LoginStudentComponent from './components/LoginStudentComponent';
import SelectRoleComponent from './components/SelectRoleComponent';
import HeaderComponent from './components/layout/HeaderComponent';
import SiderComponent from "./components/layout/SiderComponent";
import SignupTeacherComponent from './components/SignupTeacherComponent';

let App = () => {

  const MOBILE_BREAKPOINT = 768;

  let [collapsed, setCollapsed] = useState(true);
  let [login, setLogin] = useState(false);
  let [role, setRole] = useState(null);
  let [api, contextHolder] = notification.useNotification();
  let [isMobile, setIsMobile] = useState(false);

  let { t } = useTranslation();
  let { Content, Footer } = Layout;

  let notificationShown = useRef(false);
  let navigate = useNavigate();
  let location = useLocation();

  let createNotification = useCallback(
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
    }, [api]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {

    let checkRole = async () => {
      switch (role) {
        case "T":
          if (!["/registerTeacher", "/loginTeacher"].includes(location.pathname)) {
            navigate("/loginTeacher");
          }
          break;
        case "S":
          navigate("/loginStudent");
          break;
        default:
          navigate("/selectRole");
      }
    };

    let checkLogin = async () => {
      if (login) {
        navigate("/");
      } else {
        if (!["/selectRole", "/loginTeacher", "/loginStudent", "/registerTeacher"].includes(location.pathname)) {
          navigate("/selectRole");
        }
      }
    };

    checkRole();
    checkLogin();
  }, [role, login, navigate, location.pathname]);


  useEffect(() => {

    // TODO: Create notification when first session created
    if (!notificationShown.current) {
      createNotification({
        message: t("pwa.notificationMessage"),
        description: t("pwa.notificationDescription"),
        duration: "4"
      });
    }
    notificationShown.current = true;
  }, [createNotification, t]);

  return (
    <>
      {contextHolder}
      <Layout>
        <HeaderComponent
          login={login}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setRole={setRole}
          isMobile={isMobile}
        />
        <Layout hasSider>
          {login &&
            <SiderComponent
              login={login}
              setLogin={setLogin}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
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
                  <SelectRoleComponent setRole={setRole} />
                } />
                <Route path="/registerTeacher" element={
                  <SignupTeacherComponent setRole={setRole} />
                } />
              </Routes>
            </Flex>
          </Content>
        </Layout>
        <Footer style={{ textAlign: "center" }}>Present4U @ 2024<br />Made with ❤️ by Álex Álvarez Varela</Footer>
      </Layout >
    </>
  );
};

export default App;