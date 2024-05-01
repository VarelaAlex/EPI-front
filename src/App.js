import logo from './logo.png';
import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Card, Row, Col, Button, FloatButton, Image, Layout, Menu, Typography, notification, Dropdown, Space, Drawer } from "antd";
import LoginComponent from './components/LoginComponent';
import { DownloadOutlined, DownOutlined, TranslationOutlined, MenuOutlined } from '@ant-design/icons';
import SelectRoleComponent from './components/SelectRoleComponent';

let App = () => {

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  let { t, i18n } = useTranslation();

  let [isReadyForInstall, setIsReadyForInstall] = useState(false);

  async function downloadApp() {
    let promptEvent = window.deferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      await promptEvent.userChoice;
      window.deferredPrompt = null;
      setIsReadyForInstall(false);
    }
  }

  let [api, contextHolder] = notification.useNotification();
  let [message,] = useState([]);
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

  let disconnect = async () => {
    setLogin(false);
    navigate("/login");
  };

  useEffect(() => {

    let checkLogin = async () => {
      if (login) {
        navigate("/");
        return;
      } else {
        if (!["/a"].includes(location.pathname)) {
          navigate("/a");
        }
      }
    };

    checkLogin();
  }, [login, navigate, location.pathname]);

  useEffect(() => {

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      window.deferredPrompt = event;
      setIsReadyForInstall(true);
    });
  }, []);

  useEffect(() => {

    if (!notificationShown.current) {
      createNotification({
        message: "Welcome to HYTEX",
        description: "You can download the app by clicking on the button below",
        duration: "5"
      });
    }
    notificationShown.current = true;
  }, [createNotification]);

  let { Header, Content, Footer } = Layout;
  let { Title } = Typography;

  const handleMenuClick = (locale) => {
    i18n.changeLanguage(locale.key);
  };
  const items = [
    {
      label: t("language.spanish"),
      key: 'es'
    },
    {
      label: t("language.english"),
      key: 'en'
    }];
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <>
      {contextHolder}
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button ghost onClick={showDrawer} icon={<MenuOutlined />} />
          <Drawer
            title="Menu"
            placement="left"
            closable={true}
            onClose={onClose}
            open={open}
          >
            <Menu mode="vertical" disabledOverflow
              items={!login ?
                [
                  { key: "menuHome", label: <Link to="/">{t("menu.home")}</Link> },
                  { key: "menuLogin", label: <Link to="/login">{t("menu.login")}</Link> }
                ] :
                [
                  { key: "menuDisconnect", label: <Link to="/disconnect" onClick={disconnect}>{t("menu.disconnect")}</Link> }
                ]
              } />
          </Drawer>
          <Row>
            <Col style={{ display: 'flex', alignItems: 'center' }}>
              <Dropdown menu={menuProps}>
                <Button shape='round' ghost>
                  <Space>
                    <TranslationOutlined />
                    {t("language.button")}
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </Header>
        <Content style={{ padding: "auto" }}>
          <Routes>
            <Route path="/" element={
              <Row align="middle" justify="center" >
                <Col>
                  {message.length > 0 && message.map(e => { return <Alert type="error" message={e} showIcon />; })}
                  <Card title="Create list" style={{ width: "500px" }}>
                    <Title style={{ textAlign: "center", padding: "100px" }}>Welcome to Present4U!</Title>
                    <Image src={logo} alt="logo" />
                    <Title>{t('home.welcome-message')}</Title>
                  </Card>
                </Col>
              </Row>
            } />
            <Route path="/login" element={
              <LoginComponent setLogin={setLogin} />
            } />
            <Route path="/a" element={
              <SelectRoleComponent />
            } />
          </Routes>
        </Content>
        {isReadyForInstall && <FloatButton onClick={downloadApp} icon={<DownloadOutlined />} type='primary'></FloatButton>}
        <Footer style={{ textAlign: "center" }}>Present4U @ 2024<br />Made with ❤️ by Álex Álvarez Varela</Footer>
      </Layout >
    </>
  );
};

export default App;