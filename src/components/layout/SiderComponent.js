import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Drawer, Menu, Typography, } from "antd";
import { CloseOutlined } from '@ant-design/icons';

let SiderComponent = (props) => {

    let { open, setOpen, login, setLogin } = props;

    let { t } = useTranslation();

    let navigate = useNavigate();

    let disconnect = async () => {
        setLogin(false);
        navigate("/selectRole");
        setOpen(true);
    };

    let { Text } = Typography;

    return (
        <Drawer
            title={<Text style={{ color: "white", fontSize: "2vh" }}>{t("sider.profile")}</Text>}
            open={open}
            onClose={() => setOpen(false)}
            placement="left"
            styles={{ header: { backgroundColor: "#001628" } }}
            closeIcon={<CloseOutlined style={{color:"white"}}/>}>
            <Menu mode="vertical"
                items={!login ?
                    [
                        { key: "menuLogin", label: <Link to="/login">{t("sider.login")}</Link> }
                    ] :
                    [
                        { key: "menuDisconnect", label: <Link to="/disconnect" onClick={disconnect}>{t("sider.disconnect")}</Link> }
                    ]
                } />
        </Drawer>
    );
};

export default SiderComponent;