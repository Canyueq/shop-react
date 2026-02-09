// app/components/AuthGuard.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useUserStore from "app/store/userStore";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasNavigated = useRef(false); // 防重复跳转
  const [isReady, setIsReady] = useState(false); // 标记是否可以执行校验

  // ✅ 关键：直接从 localStorage 读取 Token，绕开 Zustand 订阅延迟
  const getTokenFromStorage = () => {
    const stored = localStorage.getItem("employee_token");
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      return parsed.state.token; // 取 persist 存储的 token
    } catch (e) {
      return null;
    }
  };

  // 仅执行一次最终校验（确保只跳转一次）
  useEffect(() => {
    // 先尝试直接读 localStorage
    const initialToken = getTokenFromStorage();
    if (initialToken) {
      setIsReady(true);
      return;
    }

    // 没读到则等待 300ms（给 persist 足够加载时间）
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 300);
    if (!isReady || hasNavigated.current) return;
    // 白名单处理
    const whiteList = ["/login"];
    const currentPath = location.pathname.replace(/\/$/, "").toLowerCase();
    const isInWhiteList = whiteList.includes(currentPath);

    // ✅ 直接从 Store 拿最新 Token（双重保障）
    const token = useUserStore.getState().token || getTokenFromStorage();
    const isExpired = useUserStore.getState().isTokenExpired();

    console.log("===== 最终校验 =====");
    console.log("Token：", token);
    console.log("是否过期：", isExpired);
    console.log("是否在白名单：", isInWhiteList);

    // 核心跳转逻辑（只执行一次）
    if (!isInWhiteList) {
      if (!token || isExpired) {
        hasNavigated.current = true;
        navigate("/login", { state: { from: currentPath }, replace: true });
      }
    }

    // 兜底：如果 Token 有效但页面还在跳转，强制取消
    return () => {
      clearTimeout(timer);
      hasNavigated.current = false;
    };
  }, [isReady, location.pathname, navigate]);

  // 加载中显示空白（避免页面闪烁）
  if (!isReady) return null;

  return <>{children}</>;
};

export default AuthGuard;
