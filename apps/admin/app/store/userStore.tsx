// app/store/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UseUserStore } from "app/types/hooks/useUserStore";
// 解析 JWT 获取过期时间（如果你的 token 是 JWT 格式）
const getTokenExpiration = (token: string | null): number | null => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000; // 转成毫秒时间戳
  } catch (error) {
    console.error("解析 token 失败:", error);
    return null;
  }
};

const useUserStore = create(
  persist<UseUserStore>(
    (set, get) => ({
      token: null,
      // 判断 token 是否过期
      isTokenExpired: () => {
        const token = get().token;
        if (!token) return true;
        const exp = getTokenExpiration(token);
        return exp ? Date.now() > exp : true;
      },
      setToken: (newToken: string | null) => set({ token: newToken }),
      removeToken: () => set({ token: null }),
    }),
    {
      name: "employee_token", // localStorage 存储的 key
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useUserStore;
