import { Drawer, Menu, Typography, } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";

let SiderComponent = (props) => {

    let { open, setOpen, menuItems } = props;

    let { t } = useTranslation();
    let { Text } = Typography;

    let [menu, footer] = menuItems.reduce(
        (acc, item) => {
            acc[item.danger ? 1 : 0].push(item);
            return acc;
        },
        [[], []]
    );

    return (
        <Drawer
            title={<Text style={{ color: "white", fontSize: "2vh" }}>{t("sider.teacher.welcomeMessage") + ", " + localStorage.getItem("name")}</Text>}
            open={open}
            onClose={() => setOpen(false)}
            placement="left"
            styles={{
                header: { backgroundColor: "#001628" },
                footer: { fontSize: "2vh" }
            }}
            closeIcon={<CloseOutlined style={{ color: "white" }} />}
            footer={<Menu mode="vertical" items={footer} />}
        >
            <Menu mode="vertical" items={menu} defaultSelectedKeys={menu[0]?.key} />
        </Drawer>
    );
};

export default SiderComponent;