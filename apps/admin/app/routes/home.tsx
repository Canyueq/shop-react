import createWebSocket from "app/utils/webSocket";
import { useEffect } from "react";
import { Outlet } from "react-router";
const home = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
export default home;
