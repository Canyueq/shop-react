import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import {
  Button,
  Card,
  Layout,
  Menu,
  message,
  theme,
  type MenuProps,
} from "antd";
import { toAntdFormItems } from "app/utils/getMenu";
import routes from "app/routes";
import { logout } from "app/api/employee";
import AuthGuard from "app/components/AuthGuard/AuthGuard";
import { LockOutlined } from "@ant-design/icons";
import { getStatus, setStatus } from "app/api/shop";

const { Header, Content, Sider } = Layout;
const router = await routes;
let res: MenuProps["items"] = toAntdFormItems(router as any);
const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const clickMenuItem = (v: any) => {
    // console.log(v);
    navigate(v.key);
  };
  const logoutButton = async () => {
    try {
      await logout();
      navigate("login");
    } catch (e) {
      message.error("token过期请重新登录");
    } finally {
      navigate("login");
    }
  };
  // console.log("res", routes);
  const [shopStatus, setShopStatus] = useState<number>(1);
  const handleStatusClick = async () => {
    const arg = shopStatus === 1 ? 0 : 1;
    await setStatus(arg).then((res) => {
      setShopStatus(arg);
    });
  };
  useEffect(() => {
    (async () => {
      await getStatus().then((res) => {
        setShopStatus(res.data);
      });
    })();
  }, []);
  return (
    <AuthGuard>
      <Layout style={{ height: "100%" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "white" }}>
            FG商城
            <span
              style={{
                color: shopStatus === 1 ? "green" : "red",
                marginLeft: "20px",
                fontSize: "20px",
              }}
            >
              {shopStatus === 1 ? "营业" : "打烊"}
            </span>
          </div>
          <div style={{ color: "white" }}>
            <Button
              icon={<LockOutlined />}
              onClick={handleStatusClick}
              style={{ marginRight: "20px" }}
            >
              营业状态设置
            </Button>
            <Button onClick={logoutButton}>退出</Button>
          </div>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: colorBgContainer }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderInlineEnd: 0 }}
              items={res}
              onClick={clickMenuItem}
            />
          </Sider>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Card
              style={{
                width: "99%",
                height: "99%",
                boxShadow: "0 0 0 1px grey",
              }}
            >
              <Outlet />
            </Card>
          </Content>
        </Layout>
      </Layout>
    </AuthGuard>
  );
};

export default App;
