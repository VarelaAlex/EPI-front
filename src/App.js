import { useEffect, useRef, useState, useCallback } from 'react';
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

let App = () => {


  const MOBILE_BREAKPOINT = 768;

  let [open, setOpen] = useState(false);
  let [login, setLogin] = useState(true);
  let [api, contextHolder] = notification.useNotification();
  let [isMobile, setIsMobile] = useState(false);
  let [menuItems, setMenuItems] = useState([]);

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

    let disconnect = async () => {
      setLogin(false);
      navigate("/selectRole");
    };

    let checkLogin = async () => {
      if (!login && !["/selectRole", "/loginTeacher", "/loginStudent", "/registerTeacher"].includes(location.pathname)) {
        navigate("/selectRole");
      } else {
        if (login && ["/selectRole", "/loginTeacher", "/loginStudent", "/registerTeacher"].includes(location.pathname)) {
          navigate("/menuTeacher");
        }
        setMenuItems(
          [
            { key: "classrooms", label: <Link to="/menuTeacher" onClick={() => setOpen(false)}> {"My classrooms"}</Link>, danger: false, icon: <ClassroomOutlined /> },
            { key: "exercises", label: <Link to="/manageExercises" onClick={() => setOpen(false)}> {"My exercises"}</Link>, danger: false, icon: <FormOutlined /> },
            { key: "about", label: <Link to="/aboutHYTEX" onClick={() => setOpen(false)}> {"About Hypertexto strategy"}</Link>, danger: false, icon: <InfoCircleOutlined /> },
            { key: "profile", label: <Link to="/profile" onClick={() => setOpen(false)}> {"My profile"}</Link>, danger: false, icon: <UserOutlined /> },
            { key: "menuDisconnect", label: <Link to="/disconnect" onClick={disconnect}>{t("sider.disconnect")}</Link>, danger: true, icon: <LogoutOutlined /> }
          ]);
      }
    };

    checkLogin();
  }, [login, navigate, location.pathname, t]);


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