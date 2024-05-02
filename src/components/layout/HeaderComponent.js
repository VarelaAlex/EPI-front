import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Row, Col, Button, Dropdown, Space, Layout } from "antd";
import { DownloadOutlined, DownOutlined, TranslationOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

let HeaderComponent = (props) => {

    let { login, collapsed, setCollapsed } = props;

    let [highlighted, setHighlighted] = useState(true);
    let [isReadyForInstall, setIsReadyForInstall] = useState(false);
    let [deferredPrompt, setDeferredPrompt] = useState(null);

    let { Header } = Layout;
    let { t, i18n } = useTranslation();

    let items = [
        {
            label: t("language.spanish"),
            key: 'es'
        },
        {
            label: t("language.english"),
            key: 'en'
        }
    ];

    let menuProps = {
        items,
        onClick: (locale) => {
            i18n.changeLanguage(locale.key);
        },
    };

    useEffect(() => {

        setTimeout(() => {
            setHighlighted(false);
        }, 4000);

        window.addEventListener("beforeinstallprompt", (event) => {
            event.preventDefault();
            setDeferredPrompt(event);
            setIsReadyForInstall(true);
        });
    }, []);

    let downloadApp = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            setDeferredPrompt(null);
            setIsReadyForInstall(false);
        }
    };

    return (
        <Header style={{ padding: "0vh 3vh", display: 'flex', justifyContent: 'space-between' }}>
            {login ?
                <Button
                    ghost
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                /> :
                <div></div>
            }
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
                <Col style={{ paddingLeft: "10px" }}>
                    {isReadyForInstall &&
                        <Button
                            onClick={downloadApp}
                            icon={<DownloadOutlined />}
                            ghost
                            style={highlighted ? { boxShadow: '0px 0px 20px 5px rgba(255, 221, 0, 1)' } : {}}
                        />
                    }
                </Col>
            </Row>
        </Header>
    );
};

export default HeaderComponent;