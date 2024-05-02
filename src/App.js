import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Layout, notification } from "antd";
import LoginComponent from './components/LoginComponent';
import SelectRoleComponent from './components/SelectRoleComponent';
import HeaderComponent from './components/layout/HeaderComponent';
import SiderComponent from "./components/layout/SiderComponent";

let App = () => {

  const [collapsed, setCollapsed] = useState(true);
  let { t } = useTranslation();

  let [api, contextHolder] = notification.useNotification();
  let [login, setLogin] = useState(false);
  let notificationShown = useRef(false);
  let navigate = useNavigate();
  let location = useLocation();

  let createNotification = useCallback(({ message, description = message, type = "info", placement = "top", duration = "3" }) => {
    api[type]({
      message,
      description,
      placement,
      duration
    });
  }, [api]);

  useEffect(() => {

    let checkLogin = async () => {
      if (login) {
        navigate("/");
        return;
      } else {
        if (!["/selectRole"].includes(location.pathname)) {
          navigate("/selectRole");
        }
      }
    };

    checkLogin();
  }, [login, navigate, location.pathname]);


  useEffect(() => {

    if (!notificationShown.current) {
      createNotification({
        message: t("pwa.notificationMessage"),
        description: t("pwa.notificationDescription"),
        duration: "4"
      });
    }
    notificationShown.current = true;
  }, [createNotification, t]);

  let { Content, Footer } = Layout;

  return (
    <>
      {contextHolder}
      <Layout style={{ minHeight: "90vh" }}>
        <HeaderComponent login={login} collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout hasSider>
         {login && <SiderComponent login={login} setLogin={setLogin} collapsed={collapsed} />}
          <Content>
            <Routes>
              <Route path="/login" element={
                <LoginComponent setLogin={setLogin} />
              } />
              <Route path="/selectRole" element={
                <SelectRoleComponent />
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