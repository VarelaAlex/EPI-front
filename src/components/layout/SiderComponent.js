import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, } from "antd";

let SiderComponent = (props) => {

    let { collapsed, setCollapsed, login, setLogin } = props;

    let { t } = useTranslation();
    let { Sider } = Layout;

    let navigate = useNavigate();

    let disconnect = async () => {
        setLogin(false);
        navigate("/selectRole");
        setCollapsed(true);
    };

    return (
        <Sider collapsible collapsedWidth={0} collapsed={collapsed} trigger={null}>
            <Menu mode="vertical"
                items={!login ?
                    [
                        { key: "menuLogin", label: <Link to="/login">{t("menu.login")}</Link> }
                    ] :
                    [
                        { key: "menuDisconnect", label: <Link to="/disconnect" onClick={disconnect}>{t("menu.disconnect")}</Link> }
                    ]
                } />
        </Sider>
    );
};

export default SiderComponent;