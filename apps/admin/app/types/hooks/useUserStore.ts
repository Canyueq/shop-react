export type UseUserStore = {
  token: string | null;
  isTokenExpired: Function;
  setToken: (newToken: string | null) => void;
  removeToken: () => void;
};
