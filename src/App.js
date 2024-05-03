import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Layout, notification, Steps, Flex } from "antd";
import LoginTeacherComponent from './components/LoginTeacherComponent';
import LoginStudentComponent from './components/LoginStudentComponent';
import SelectRoleComponent from './components/SelectRoleComponent';
import HeaderComponent from './components/layout/HeaderComponent';
import SiderComponent from "./components/layout/SiderComponent";

let App = () => {

  let [collapsed, setCollapsed] = useState(true);
  let [login, setLogin] = useState(false);
  let [role, setRole] = useState(null);
  let [current, setCurrent] = useState(0);
  let [api, contextHolder] = notification.useNotification();

  let { t } = useTranslation();
  let { Content, Footer } = Layout;

  let notificationShown = useRef(false);
  let navigate = useNavigate();
  let location = useLocation();

  let onChange = (value) => {
    setCurrent(value);
    setRole(null);
    value === 0 && navigate("/");
  };

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

    let checkRole = async () => {
      switch (role) {
        case "T":
          navigate("/loginTeacher");
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
        if (!["/selectRole", "/loginTeacher", "/loginStudent"].includes(location.pathname)) {
          navigate("/selectRole");
        }
      }
    };

    checkRole();
    checkLogin();
  }, [login, navigate, location.pathname]);


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
      <Layout style={{ minHeight: "98vh" }}>
        <HeaderComponent
          login={login}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <Layout hasSider>
          {login &&
            <SiderComponent
              login={login}
              setLogin={setLogin}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />}
          <Content>
            <Flex justify="center">
              <Steps
                style={{ padding: "3vh 0vh 7vh", width: "40vmax" }}
                current={current}
                onChange={onChange}
                direction="horizontal"
                responsive={false}
                items={[
                  {
                    title: 'Select role',
                  },
                  {
                    title: 'Log in',
                    disabled: true
                  }
                ]}
              />
            </Flex>
            <Routes>
              <Route path="/loginTeacher" element={
                <LoginTeacherComponent setLogin={setLogin} />
              } />
              <Route path="/loginStudent" element={
                <LoginStudentComponent setLogin={setLogin} />
              } />
              <Route path="/selectRole" element={
                <SelectRoleComponent setCurrent={setCurrent} setRole={setRole} />
              } />
            </Routes>
          </Content>
        </Layout>
        <Footer style={{ textAlign: "center" }}>Present4U @ 2024<br />Made with ❤️ by Álex Álvarez Varela</Footer>
      </Layout >
    </>
  );
};

export default App;