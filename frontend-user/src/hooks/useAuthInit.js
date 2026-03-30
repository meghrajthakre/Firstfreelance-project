import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useCoinStore } from "../store/coinStore";
import { getMe } from "../api/userService";

export const useAuthInit = () => {
  const login   = useAuthStore((s) => s.login);
  const setCoins = useCoinStore((s) => s.setCoins);

  useEffect(() => {
    getMe()
      .then((res) => {
        login(res.data.user);
        setCoins(res.data.user?.coins ?? 0);
      })
      .catch(() => {
        // cookie expired or invalid — stay logged out
      });
  }, []);
};  