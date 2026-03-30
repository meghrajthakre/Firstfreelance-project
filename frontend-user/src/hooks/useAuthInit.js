import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useCoinStore } from "../store/coinStore";
import { getMe } from "../api/userService";

export const useAuthInit = () => {
  const login    = useAuthStore((s) => s.login);
  const user     = useAuthStore((s) => s.user);
  const setCoins = useCoinStore((s) => s.setCoins);

  useEffect(() => {
    if (user) return; // 🛑 already logged in

    getMe()
      .then((res) => {
        login(res.data.user);
        setCoins(res.data.user?.coins ?? 0);
      })
      .catch(() => {});
  }, [user]);
};