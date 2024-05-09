import { Drawer, Menu, Typography, } from "antd";
import { CloseOutlined } from '@ant-design/icons';

let SiderComponent = (props) => {

    let { open, setOpen, menuItems } = props;

    let [menu, footer] = menuItems.reduce(
        (acc, item) => {
            acc[item.danger ? 1 : 0].push(item);
            return acc;
        },
        [[], []]
    );

    let { Text } = Typography;

    return (
        <Drawer
            title={<Text style={{ color: "white", fontSize: "2vh" }}>{"Hello, Álex!"}</Text>}
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
            <Menu mode="vertical" items={menu} defaultSelectedKeys="classrooms" />
        </Drawer>
    );
};

export default SiderComponent;